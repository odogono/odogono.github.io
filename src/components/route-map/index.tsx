import { useCallback, useEffect, useRef, useState } from 'react';

import { createLog } from '@helpers/log';

import { renderFeatureCollection } from './components/canvas';
import { LayerToggles } from './components/layer-toggles';
import { type ScenarioId } from './data';
import { useDimensions } from './hooks/use-dimensions';
import { useScenario } from './hooks/use-scenario';

const log = createLog('RouteMap');

export interface RouteMapProps {
  height?: number;
  scenarioId: ScenarioId;
}

export const RouteMap = ({ height, scenarioId }: RouteMapProps) => {
  const { containerRef, dimensions } = useDimensions();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [error, setError] = useState<string | null>(null);

  const {
    bbox: scenarioBbox,
    error: scenarioError,
    featureCollections: scenarioFeatureCollections,
    gpsFC,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useScenario(scenarioId);

  // log.debug('scenarioFeatureCollections', scenarioFeatureCollections);
  // log.debug('gpsFC', gpsFC);
  const gpsStr = gpsFC ? gpsFC.bbox?.join(',') : '';

  const [selectedFeatureCollections, setSelectedFeatureCollections] = useState<
    number[]
  >(Array.from({ length: scenarioFeatureCollections.length }, (_, i) => i));

  const handleFeatureCollectionChange = (index: number) => {
    setSelectedFeatureCollections(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  };

  // Render canvas effect
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !scenarioFeatureCollections?.length) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let ii = 0; ii < scenarioFeatureCollections.length; ii++) {
      const featureCollection = scenarioFeatureCollections[ii];
      if (!featureCollection || !selectedFeatureCollections.includes(ii)) {
        continue;
      }

      // console.debug('rendering featureCollection', featureCollection);
      renderFeatureCollection({
        bbox: scenarioBbox,
        canvas,
        ctx,
        featureCollection
      });
    }
  }, [scenarioFeatureCollections, scenarioBbox, selectedFeatureCollections]);

  // Call renderCanvas whenever dimensions, featureData changes or view toggles
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      renderCanvas();
    }
  }, [dimensions, renderCanvas]);

  const errorMessage = scenarioError ? scenarioError : error;

  return (
    <div
      className="relative w-full bg-slate-400"
      ref={containerRef}
      style={{ height }}
    >
      <LayerToggles
        featureCollections={scenarioFeatureCollections}
        onChange={handleFeatureCollectionChange}
        selected={selectedFeatureCollections}
      />

      <div className="pointer-events-none absolute flex h-100 w-full items-center justify-center text-red-500">
        {errorMessage}
      </div>

      <canvas
        className="h-full w-full"
        height={dimensions.height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        ref={canvasRef}
        style={{
          height: dimensions.height / (window.devicePixelRatio || 1),
          width: dimensions.width / (window.devicePixelRatio || 1)
        }}
        width={dimensions.width}
      />
    </div>
  );
};
