export interface ExchangeRateData {
  rate: number;
  lastUpdated: string;
}

const EXCHANGE_RATE_STORAGE_KEY = 'baliBuddyExchangeRateIDRtoUSD';

// Mock API call - in a real app, replace this with an actual API fetch
export async function fetchExchangeRateIDRtoUSD(): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate network delay and potential failure
      if (Math.random() < 0.9) { // 90% success rate
        // Simulate a rate fluctuation
        const baseRate = 15000;
        const fluctuation = (Math.random() - 0.5) * 500; // +/- 250
        resolve(baseRate + fluctuation);
      } else {
        reject(new Error('Failed to fetch exchange rate. Network error.'));
      }
    }, 1000); // 1 second delay
  });
}

export function getStoredExchangeRate(): ExchangeRateData | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const storedData = localStorage.getItem(EXCHANGE_RATE_STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData) as ExchangeRateData;
    } catch (error) {
      console.error("Error parsing stored exchange rate:", error);
      localStorage.removeItem(EXCHANGE_RATE_STORAGE_KEY); // Clear corrupted data
      return null;
    }
  }
  return null;
}

export function storeExchangeRate(rate: number): ExchangeRateData {
  if (typeof window === 'undefined') {
    // This should ideally not happen if called from client-side logic
    console.warn("Attempted to store exchange rate outside browser environment.");
    // Return what would have been stored, for consistency, though it won't persist.
    return { rate, lastUpdated: new Date().toISOString() };
  }
  const data: ExchangeRateData = {
    rate,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(EXCHANGE_RATE_STORAGE_KEY, JSON.stringify(data));
  return data;
}
