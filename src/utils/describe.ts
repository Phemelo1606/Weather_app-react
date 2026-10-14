export const describeHumidity = (value: number): string =>
  value < 40 ? 'Dry' : value <= 65 ? 'Comfortable' : 'Humid';

export const describeUv = (index: number): string =>
  index < 3 ? 'Low' : index < 6 ? 'Moderate' : index < 8 ? 'High' : 'Very high';

export const uvAdvice = (index: number): string =>
  index < 3 ? 'No protection needed' : 'Wear sunscreen';

export const describeVisibility = (km: number): string =>
  km >= 10 ? 'Clear horizon' : 'Hazy';
