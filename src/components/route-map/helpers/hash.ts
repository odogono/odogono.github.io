import type { Feature, Point } from 'geojson';
import geohash from 'ngeohash';

// NOTE i have found that precision 9 is not enough for coordinates
const PRECISION = 10;

export const createPointFeatureHash = (
  pointFeature: Feature<Point>,
  precision: number = PRECISION
) => {
  const point = pointFeature.geometry as Point;
  const hash = geohash.encode(
    point.coordinates[1],
    point.coordinates[0],
    precision
  );
  return hash;
};

export const createPointHash = (
  point: GeoJSON.Position,
  precision: number = PRECISION
) => geohash.encode(point[1], point[0], precision);

export const decodePointHash = (hash: string): GeoJSON.Position => {
  const { latitude, longitude } = geohash.decode(hash);
  return [longitude, latitude];
};
