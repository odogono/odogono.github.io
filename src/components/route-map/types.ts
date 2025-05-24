import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  LineString,
  Point
} from 'geojson';

export type DrawMode = 'road' | 'route' | 'select' | 'none';

/**
 * A geo hash for a point
 */
export type GeoHash = string;

/**
 * A geo hash for a road
 * consists of two geo hashes, the start and end of the road
 * joined by a dot
 */
export type RoadGeoHash = string;

export type RoadHash = string;

export interface CommonFeatureProperties {
  [key: string]: unknown;
  hash: string;
}

export type FeatureCollectionWithProperties<T extends Geometry> =
  FeatureCollection<T, GeoJsonProperties> & {
    properties: {
      color: string;
      showIndexes?: boolean;
      strokeWidth?: number;
    };
  };

export type GpsPointFeature = Feature<Point, CommonFeatureProperties>;

export type RoadFeature = Feature<LineString, CommonFeatureProperties>;

export type MappedGpsPointFeature = Feature<Point, MappedGpsPointProperties>;

type MappedGpsPointProperties = CommonFeatureProperties & {
  dist: number; // distance between pt and the closest point
  index: number; // closest point was found on nth line part
  isRoadPoint?: boolean; // whether this is actually a road point
  location: number; // distance along the line between start and the closest point
  multiFeatureIndex: number; // closest point was found on the nth line of the `MultiLineString`
  roadHash: string;
  srcHash: string;
};

export type NodeMap = Map<string, MappedGpsPointFeature | RoadFeature>;

export type NodeRoadMap = Map<string, Set<string>>;

export interface VisitContext {
  currentGpsIndex: number;
  currentHash: string;
  gpsPoints: MappedGpsPointFeature[];
  includeAllGpsPoints: boolean;
  nodeMap: NodeMap;
  nodeRoadMap: NodeRoadMap;
  path: string[];
  roadGpsCountMap: Map<string, number>;
  roads: RoadFeature[];
}
