import {
  useCallback,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent
} from 'react';

import type { Feature, LineString, Point } from 'geojson';

import { createLog } from '@helpers/log';
import {
  CANVAS_MARGIN,
  bboxSum,
  latitudeToY,
  longitudeToX
} from '@route-map/helpers';
import { buildGraph } from '@route-map/helpers/build-graph';
import { graphToFeature } from '@route-map/helpers/graph-to-feature';
import { mapGpsLineStringToRoad } from '@route-map/helpers/map-gps-to-road';
import type {
  FeatureCollectionWithProperties,
  RoadFeature
} from '@route-map/types';
import { bbox as turfBbox } from '@turf/bbox';
import { simplify } from '@turf/simplify';

import { scenarios, type ScenarioId } from '../data';
import { createLineStringFeature } from '../helpers/geo';

const log = createLog('useScenario');

export const useScenario = (scenarioId: ScenarioId) => {
  const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const scenario = scenarios.find(s => s.id === scenarioId);
  if (!scenario) {
    throw new Error(`Scenario ${scenarioId} not found`);
  }

  const { gps, roads } = scenario;

  const roadsFC = useMemo<FeatureCollectionWithProperties<LineString>>(
    () => ({
      ...roads,
      bbox: turfBbox(roads),
      properties: {
        color: '#666',
        showIndexes: true
      }
    }),
    [roads]
  );

  const initialGpsFC = useMemo<FeatureCollectionWithProperties<LineString>>(
    () => ({
      ...gps,
      bbox: turfBbox(gps),
      properties: {
        color: '#00ff00',
        showIndexes: true
      }
    }),
    [gps]
  );

  const [gpsFC, setGpsFC] =
    useState<FeatureCollectionWithProperties<LineString>>(initialGpsFC);

  // Create a feature collection from the drawn points if any exist
  const drawnPathFC = useMemo(() => {
    if (drawnPoints.length < 2) {
      // log.debug('not enough points for LineString', drawnPoints);
      return null;
    }

    const lineStringFeature = createLineStringFeature(drawnPoints);
    // log.debug('created LineString', lineStringFeature);

    return {
      features: [lineStringFeature],
      properties: {
        color: '#ff0000',
        showIndexes: false,
        strokeWidth: 2
      },
      type: 'FeatureCollection'
    } as FeatureCollectionWithProperties<LineString>;
  }, [drawnPoints]);

  // calculate overall bbox
  const bbox = bboxSum([roadsFC.bbox, gpsFC.bbox]);
  // const bboxString = bbox.join(',');

  const { error, mappedGpsPoints, route } = useMemo(
    () => calculateRoute(roadsFC, gpsFC),
    [gpsFC, roadsFC]
  );

  // Convert canvas coordinates to bbox coordinates
  const canvasToBboxCoords = useCallback(
    (canvas: HTMLCanvasElement, x: number, y: number): [number, number] => {
      // Get the canvas dimensions
      const width = canvas.width;
      const height = canvas.height;

      // Calculate the scale and offset to fit the bbox in the canvas
      const minX = longitudeToX(bbox[0]);
      const minY = latitudeToY(bbox[1]);
      const maxX = longitudeToX(bbox[2]);
      const maxY = latitudeToY(bbox[3]);

      const dataWidth = maxX - minX;
      const dataHeight = maxY - minY;
      const availableWidth = width - 2 * CANVAS_MARGIN;
      const availableHeight = height - 2 * CANVAS_MARGIN;

      const scaleX = availableWidth / dataWidth;
      const scaleY = availableHeight / dataHeight;
      const scale = Math.min(scaleX, scaleY);

      const scaledWidth = dataWidth * scale;
      const scaledHeight = dataHeight * scale;
      const offsetX = (width - scaledWidth) / 2;
      const offsetY = (height - scaledHeight) / 2;

      // Convert canvas coordinates to normalized coordinates (0-1)
      const normalizedX = (x - offsetX) / scaledWidth;
      const normalizedY = (y - offsetY) / scaledHeight;

      // Convert normalized coordinates to bbox coordinates
      const bboxX = bbox[0] + normalizedX * (bbox[2] - bbox[0]);
      const bboxY = bbox[1] + normalizedY * (bbox[3] - bbox[1]);

      // log.debug('canvasToBboxCoords', {
      //   bboxX,
      //   bboxY,
      //   normalizedX,
      //   normalizedY,
      //   x,
      //   y
      // });
      return [bboxX, bboxY];
    },
    [bbox]
  );

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const canvas = e.target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const coords = canvasToBboxCoords(canvas, x, y);
      // log.debug('handlePointerDown', { x, y }, coords);

      setIsDrawing(true);
      setDrawnPoints([coords]);
    },
    [canvasToBboxCoords]
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) {
        return;
      }

      const canvas = e.target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const coords = canvasToBboxCoords(canvas, x, y);
      // log.debug('handlePointerMove', { x, y }, coords);

      setDrawnPoints(prev => {
        const newPoints = [...prev, coords];
        // log.debug('new points', newPoints);
        return newPoints;
      });
    },
    [isDrawing, canvasToBboxCoords]
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      // log.debug('handlePointerUp', drawnPoints);
      setIsDrawing(false);

      if (drawnPoints.length < 3) {
        return;
      }

      const lineFeature = createLineStringFeature(drawnPoints);

      const simplifiedLineString = simplify(lineFeature, {
        highQuality: true,
        tolerance: 0.000_01
      }) as Feature<LineString>;

      setGpsFC(prev => ({
        ...prev,
        features: [simplifiedLineString]
      }));

      setDrawnPoints([]);
    },
    [drawnPoints]
  );

  return {
    bbox,
    error,
    featureCollections: [roadsFC, mappedGpsPoints, drawnPathFC || gpsFC, route],
    gpsFC: drawnPathFC || gpsFC,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};

const calculateRoute = (
  roadsFc: FeatureCollectionWithProperties<LineString>,
  gpsLineString: FeatureCollectionWithProperties<LineString>
) => {
  const roads = roadsFc.features as RoadFeature[];

  const { mappedGpsPoints } = mapGpsLineStringToRoad(roads, gpsLineString);

  // log.debug('📈 mappedGpsPoints', mappedGpsPoints);

  if (!mappedGpsPoints.length) {
    return {
      error: 'Failed to map GPS points',
      mappedGpsPoints: null,
      route: null
    };
  }

  const nodesFC: FeatureCollectionWithProperties<Point> = {
    ...gpsLineString,
    features: mappedGpsPoints,
    properties: {
      color: '#FFF'
    }
  };

  const graphResult = buildGraph(roads, mappedGpsPoints, {
    includeAllGpsPoints: false
  });

  // log.debug('📈 graphResult', graphResult.path);

  const graphFeatureCollection = graphToFeature(
    graphResult
  ) as FeatureCollectionWithProperties<LineString>;

  if (!graphFeatureCollection) {
    return {
      error: 'No route found',
      mappedGpsPoints: nodesFC,
      route: null
    };
  }

  graphFeatureCollection.properties = {
    color: '#00F',
    showIndexes: true,
    strokeWidth: 4
  };

  // log.debug('nodesFC', nodesFC);

  return {
    error: null,
    mappedGpsPoints: nodesFC,
    route: graphFeatureCollection
  };

  // return [nodesFC, graphFeatureCollection];
};
