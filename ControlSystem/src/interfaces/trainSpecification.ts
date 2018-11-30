export interface TrainSpecification {
  "network": NetworkPart[],
  "swhitches": Switch[],
  "trains": Train[],
}

export interface NetworkPart {
  "route": string, // R1
  "tracks": string[], // ["0,3", "0,1", "1,0", "5,0", "6,1", "6.3"],
  "readers": string[], //  ["0,2", "6,2"],
}

export interface Switch {
  "id": number,
  "location": string, // 0,3
  "connections": Connection[]
}

export interface Connection {
  "state": 1,
  "route1": string, // R1
  "route2": string // R2
}

export interface Train {
  "id": number,
  "tag1": string, // TT001
  "tag2": string, // TT002
}
