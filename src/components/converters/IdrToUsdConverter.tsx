
"use client";

import { useState, useEffect, useCallback, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Coins, RefreshCw, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchExchangeRateIDRtoUSD, getStoredExchangeRate, storeExchangeRate, type ExchangeRateData } from '@/lib/currency';

export function IdrToUsdConverter() {
  const [idrAmount, setIdrAmount] = useState<string>('');
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [exchangeRateData, setExchangeRateData] = useState<ExchangeRateData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true); 
  const [lastChanged, setLastChanged] = useState<'idr' | 'usd' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const loadInitialRate = useCallback(async (isRefreshing = false) => {
    setIsLoading(true);
    const storedRate = getStoredExchangeRate();
    if (storedRate && !isRefreshing) { // Only use stored rate if not explicitly refreshing and it exists
      setExchangeRateData(storedRate);
    }

    if (isOnline) {
      try {
        const fetchedRate = await fetchExchangeRateIDRtoUSD();
        const newRateData = storeExchangeRate(fetchedRate);
        setExchangeRateData(newRateData);
        if (isRefreshing) {
          toast({ title: "Exchange rate refreshed!", description: `New IDR to USD rate: ${newRateData.rate.toFixed(2)}` });
        } else if (!storedRate) {
           toast({ title: "Exchange rate updated", description: `IDR to USD rate: ${newRateData.rate.toFixed(2)}` });
        }
      } catch (error) {
        if (isRefreshing || !storedRate) {
          toast({ variant: "destructive", title: "Error fetching rate", description: "Could not fetch new exchange rate. Using stored rate if available." });
        }
        if (!exchangeRateData && storedRate) { // If fetch fails but we had a stored rate initially not set due to refresh
            setExchangeRateData(storedRate);
        }
      }
    } else if (!storedRate) {
        toast({ variant: "destructive", title: "Offline", description: "No internet connection and no stored exchange rate available." });
    } else if (isRefreshing && !isOnline) {
        toast({ variant: "destructive", title: "Offline", description: "Cannot refresh rate. No internet connection." });
    }
    setIsLoading(false);
  }, [toast, isOnline, exchangeRateData]); // Added exchangeRateData to ensure it has latest value if fetch fails during refresh


  useEffect(() => {
    loadInitialRate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // loadInitialRate is memoized and its dependencies are managed.

  useEffect(() => {
    if (lastChanged === 'usd' || !exchangeRateData) {
       if (idrAmount === '' && lastChanged !== 'usd') setUsdAmount('');
      return;
    }
    if (idrAmount === '') {
      setUsdAmount('');
      return;
    }
    const idrNum = parseFloat(idrAmount);
    if (!isNaN(idrNum) && exchangeRateData.rate > 0) {
      setUsdAmount((idrNum / exchangeRateData.rate).toFixed(2));
    } else {
      setUsdAmount('Invalid input');
    }
  }, [idrAmount, exchangeRateData, lastChanged]);

  useEffect(() => {
    if (lastChanged === 'idr' || !exchangeRateData) {
      if (usdAmount === '' && lastChanged !== 'idr') setIdrAmount('');
      return;
    }
     if (usdAmount === '') {
      setIdrAmount('');
      return;
    }
    const usdNum = parseFloat(usdAmount);
    if (!isNaN(usdNum) && exchangeRateData.rate > 0) {
      setIdrAmount((usdNum * exchangeRateData.rate).toFixed(0)); // IDR usually whole number
    } else {
      setIdrAmount('Invalid input');
    }
  }, [usdAmount, exchangeRateData, lastChanged]);

  const handleIdrChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIdrAmount(e.target.value);
    setLastChanged('idr');
  };

  const handleUsdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsdAmount(e.target.value);
    setLastChanged('usd');
  };
  
  const handleRefreshRate = () => {
    loadInitialRate(true); // Pass true to indicate it's a refresh action
  };

  const lastUpdatedDate = exchangeRateData?.lastUpdated 
    ? new Date(exchangeRateData.lastUpdated).toLocaleString()
    : 'N/A';

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Coins className="h-6 w-6 text-primary" />
          IDR to USD Converter
        </CardTitle>
        <CardDescription>Convert between Indonesian Rupiah (IDR) and US Dollars (USD).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="idr" className="text-sm font-medium">Indonesian Rupiah (IDR)</Label>
          <Input
            id="idr"
            type="number"
            value={idrAmount}
            onChange={handleIdrChange}
            placeholder="Enter IDR amount"
            aria-label="Indonesian Rupiah amount input"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="usd" className="text-sm font-medium">US Dollars (USD)</Label>
          <Input
            id="usd"
            type="number"
            value={usdAmount}
            onChange={handleUsdChange}
            placeholder="Enter USD amount"
            aria-label="US Dollars amount input"
            className="mt-1"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 pt-4">
        <div className="text-xs text-muted-foreground">
          Current Rate (1 USD): {exchangeRateData ? `Rp ${exchangeRateData.rate.toFixed(2)}` : (isLoading && !exchangeRateData ? 'Loading...' : 'N/A')}
          <br />
          Last Updated: {isLoading && !exchangeRateData ? 'Loading...' : lastUpdatedDate}
        </div>
        <Button onClick={handleRefreshRate} disabled={isLoading || !isOnline} className="w-full sm:w-auto">
          {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          {isLoading ? 'Refreshing...' : 'Refresh Rate'}
          {!isOnline && <WifiOff className="ml-2 h-4 w-4" />}
        </Button>
         {!isOnline && <p className="text-xs text-destructive flex items-center gap-1"><WifiOff size={14}/> You are offline. Displaying last saved rate.</p>}
      </CardFooter>
    </Card>
  );
}
