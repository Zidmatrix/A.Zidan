// Representative points within each state; coordinates are [longitude, latitude].
// Add a state here to populate both the map and the responsive list.
export const markets = [
 {name:'Michigan',coordinates:[-85.6024,44.3148]},
 {name:'Florida',coordinates:[-81.6868,27.7663]},
 {name:'Texas',coordinates:[-99.9018,31.9686]},
 {name:'California',coordinates:[-119.4179,36.7783]},
 {name:'Georgia',coordinates:[-83.5007,32.1656]},
 {name:'Arizona',coordinates:[-111.0937,34.0489]},
 {name:'North Carolina',coordinates:[-79.0193,35.7596]},
 {name:'Pennsylvania',coordinates:[-77.1945,41.2033]},
 {name:'Virginia',coordinates:[-79.0,37.6]},
 {name:'Tennessee',coordinates:[-86.58,35.52]},
 {name:'Indiana',coordinates:[-86.13,40.0]},
 {name:'Illinois',coordinates:[-89.2,40.0]},
 {name:'Ohio',coordinates:[-82.9,40.4]},
] as const;
export const marketDescription = 'U.S. real estate market — cold calling & lead management.';

// Representative city point, GeoNames 360630: https://www.geonames.org/360630/cairo.html
export const cairoCoordinates = [31.24967, 30.06263] as const;
export const projectMapPoint = (coordinates: readonly [number, number]) => [
 (coordinates[0] + 180) * 1000 / 360,
 (90 - coordinates[1]) * 500 / 180,
] as const;

// Spherical interpolation, projected with the same equirectangular projection
// as the bundled Natural Earth map. These indicate remote collaboration.
export function collaborationRoute(destination: readonly [number, number]) {
 const vector = ([lon, lat]: readonly [number, number]) => {
  const a = lon * Math.PI / 180, b = lat * Math.PI / 180;
  return [Math.cos(b) * Math.cos(a), Math.cos(b) * Math.sin(a), Math.sin(b)];
 };
 const a = vector(cairoCoordinates), b = vector(destination);
 const angle = Math.acos(Math.max(-1, Math.min(1, a.reduce((sum, value, i) => sum + value * b[i], 0))));
 const sine = Math.sin(angle);
 return Array.from({length: 49}, (_, i) => {
  const t = i / 48;
  const u = sine ? Math.sin((1 - t) * angle) / sine : 1 - t;
  const v = sine ? Math.sin(t * angle) / sine : t;
  const p = a.map((value, j) => value * u + b[j] * v);
  const coordinates: [number, number] = [Math.atan2(p[1], p[0]) * 180 / Math.PI, Math.atan2(p[2], Math.hypot(p[0], p[1])) * 180 / Math.PI];
  const [x, y] = projectMapPoint(coordinates);
  return `${i ? 'L' : 'M'}${x.toFixed(3)} ${y.toFixed(3)}`;
 }).join(' ');
}
