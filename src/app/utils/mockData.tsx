// utils/mockData.ts
export interface TemperatureData {
  timestamp: string;
  temperature: number;
}

export const generateMockData = (numPoints: number): TemperatureData[] => {
  const data: TemperatureData[] = [];
  const now = Date.now();

  for (let i = 0; i < numPoints; i++) {
    data.push({
      timestamp: new Date(now + i * 5000).toISOString(), // every 5 seconds
      temperature: Math.floor(Math.random() * 30) + 15, // random temp between 15 and 45
    });
  }

  return data;
};
