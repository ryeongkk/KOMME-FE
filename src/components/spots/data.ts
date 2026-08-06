export const TOPICS = [
  "Korean Spa/Sauna",
  "Traditional Market",
  "Chimaek",
  "Convenience Store",
  "K-Culture",
  "Hiking/Walking",
] as const;

export type Topic = (typeof TOPICS)[number];

export type Spot = {
  id: string;
  region: string;
  name: string;
  saves: number;
  distanceKm: number;
  hours: string;
  address: string;
  phone: string;
  topic: Topic;
};

// ponytail: no spot API yet, static data mirrors the Figma mock (3 spots, listed twice)
export const SPOTS: Spot[] = [
  {
    id: "park-spa-land",
    region: "Seoul Mapo",
    name: "The Park Spa Land",
    saves: 4,
    distanceKm: 2.8,
    hours: "10:00~23:00",
    address: "The Park 365, 50 Seonyudong 1-ro, Yeongdeungpo-gu, Seoul",
    phone: "010-1111-3333",
    topic: "Korean Spa/Sauna",
  },
  {
    id: "moclock-gangnam",
    region: "Seoul Gangnam",
    name: "Moclock Gangnam Main Branch | Head Spa",
    saves: 6,
    distanceKm: 3.1,
    hours: "10:00~23:00",
    address: "123 Teheran-ro, Gangnam-gu, Seoul",
    phone: "010-2222-4444",
    topic: "Korean Spa/Sauna",
  },
  {
    id: "sparex-dongdaemun",
    region: "Seoul Dongdaemun",
    name: "Sparex Dongdaemun",
    saves: 4,
    distanceKm: 2.8,
    hours: "10:00~23:00",
    address: "45 Cheonggyecheon-ro, Dongdaemun-gu, Seoul",
    phone: "010-3333-5555",
    topic: "Korean Spa/Sauna",
  },
];
