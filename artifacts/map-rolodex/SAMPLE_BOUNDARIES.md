# Illustrative sample pin locations

Only contacts marked `source = sample` use illustrative map positions. Regular contacts keep their stored city center. This is **not** a location estimate for a person.

The small, static set of interior disks in `src/lib/sample-display-position.ts` was derived on 2026-09-27 from administrative polygon relations in [OpenStreetMap](https://www.openstreetmap.org/copyright) using one-time [Nominatim](https://nominatim.org/release-docs/latest/api/Search/) lookups. Data © OpenStreetMap contributors, licensed under [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/). These are community-mapped administrative boundaries, **not certified official city limits**. The fixed source set avoids requests to Nominatim from app visitors; consult the [public service policy](https://operations.osmfoundation.org/policies/nominatim/) before any future lookups.

| City / country | OSM boundary relation | Interior center (lon, lat) | Conservative radius |
| --- | ---: | --- | ---: |
| Stockholm, SE | [398021](https://www.openstreetmap.org/relation/398021) (Stockholm municipality) | 18.033341, 59.300523 | 2,100 m |
| Singapore, SG | [17140517](https://www.openstreetmap.org/relation/17140517) | 103.8198, 1.3521 | 5,800 m |
| Milan, IT | [44915](https://www.openstreetmap.org/relation/44915) | 9.19, 45.4642 | 2,700 m |
| Accra, GH | [12803764](https://www.openstreetmap.org/relation/12803764) | -0.187, 5.6037 | 2,650 m |
| Tokyo, JP | [1543125](https://www.openstreetmap.org/relation/1543125) (Tokyo metropolitan area) | 139.6503, 35.6762 | 3,600 m |
| London, GB | [175342](https://www.openstreetmap.org/relation/175342) (Greater London) | -0.1276, 51.5072 | 6,800 m |
| Boston, US | [2315704](https://www.openstreetmap.org/relation/2315704) | -71.044296, 42.338517 | 1,700 m |
| São Paulo, BR | [298285](https://www.openstreetmap.org/relation/298285) | -46.6333, -23.5505 | 3,700 m |
| Berlin, DE | [62422](https://www.openstreetmap.org/relation/62422) | 13.405, 52.52 | 5,150 m |
| Copenhagen, DK | [2192363](https://www.openstreetmap.org/relation/2192363) (Copenhagen municipality) | 12.600197, 55.654517 | 850 m |

For each entry, the center was verified inside its polygon (excluding holes). The local projected distance to every edge of its containing polygon was measured; the listed radius is smaller than half that distance, with a 7 km cap. This conservative disk is entirely inside the mapped polygon, including for complex boundaries with holes or disconnected parts. Pins are selected by a stable hash of the contact ID, within 25–95% of the listed radius. The full OSM polygon is **not** shipped to the browser.

Mumbai and Dubai do not have an unambiguous city administrative polygon in this lookup, so they keep their existing city-center positions. Do not replace this fallback with a guessed bounding box. The city and country (and proximity to the vetted center) must match before applying any offset.