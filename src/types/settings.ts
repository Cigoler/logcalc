export interface DiameterSetting {
  id: string;
  diameter: number;
  constant: number;
}

export interface Settings {
  diameters: DiameterSetting[];
}

export const DEFAULT_SETTINGS: Settings = {
  diameters: [
    { id: '1', diameter: 105, constant: 0.04198 },
    { id: '2', diameter: 112, constant: 0.04198 }
  ]
};