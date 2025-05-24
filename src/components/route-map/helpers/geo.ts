import type { Feature, GeoJsonProperties, LineString, Position } from 'geojson';

export const arePositionsEqual = (
  pos1: Position | undefined,
  pos2: Position | undefined
): boolean => {
  if (!pos1 || !pos2) {
    return false;
  }
  if (pos1.length !== pos2.length) {
    return false;
  }
  for (let i = 0; i < pos1.length; i++) {
    if (pos1[i] !== pos2[i]) {
      return false;
    }
  }
  return true;
};

export const distanceBetweenPoints = (p1: Position, p2: Position): number =>
  Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));

export const createLineStringFeature = (
  coordinates: Position[],
  properties: GeoJsonProperties = {}
): Feature<LineString> => ({
  geometry: {
    coordinates,
    type: 'LineString'
  },
  properties,
  type: 'Feature'
});
