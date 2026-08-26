import type { Citta } from "./tipi";

// Coordinate approssimate, usate solo per stimare km stradali via Haversine + fattore di
// tortuosità. Sufficiente per una demo: non serve un vero motore di routing stradale.
const COORDINATE: Record<Citta, [number, number]> = {
  Milano: [45.4642, 9.19],
  Torino: [45.0703, 7.6869],
  Genova: [44.4056, 8.9463],
  Bologna: [44.4949, 11.3426],
  Firenze: [43.7696, 11.2558],
  Roma: [41.9028, 12.4964],
  Napoli: [40.8518, 14.2681],
  Bari: [41.1171, 16.8719],
  Padova: [45.4064, 11.8768],
  Verona: [45.4384, 10.9916],
  Brescia: [45.5416, 10.2118],
  Parma: [44.8015, 10.3279],
  Piacenza: [45.0526, 9.6929],
  Bergamo: [45.6983, 9.6773],
};

const FATTORE_TORTUOSITA = 1.2;
const RAGGIO_TERRA_KM = 6371;

function haversine(a: [number, number], b: [number, number]): number {
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return RAGGIO_TERRA_KM * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function kmTra(a: Citta, b: Citta): number {
  if (a === b) return 0;
  return Math.round(haversine(COORDINATE[a], COORDINATE[b]) * FATTORE_TORTUOSITA);
}

export const TUTTE_LE_CITTA: Citta[] = Object.keys(COORDINATE) as Citta[];
