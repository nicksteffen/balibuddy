
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
  const [isOnline, setIsOnline] = useState<boolean>(true); // Assume online initially
  const { toast } = useToast();

  useEffect(() => {
    // Check online status on mount and add event listeners
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

  const loadInitialRate = useCallback(async () => {
    setIsLoading(true);
    const storedRate = getStoredExchangeRate();
    if (storedRate) {
      setExchangeRateData(storedRate);
    }

    if (isOnline) {
      try {
        const fetchedRate = await fetchExchangeRateIDRtoUSD();
        const newRateData = storeExchangeRate(fetchedRate);
        setExchangeRateData(newRateData);
        if (!storedRate) { // Only toast if it's the first fetch and not just an update
          toast({ title: "Exchange rate updated", description: `IDR to USD rate: ${fetchedRate.toFixed(2)}` });
        }
      } catch (error) {
        if (!storedRate) { // If no stored rate and fetch fails
          toast({ variant: "destructive", title: "Error fetching rate", description: "Could not fetch new exchange rate. Using stored rate if available." });
        }
         // Keep using storedRate if fetch fails
      }
    } else if (!storedRate) {
        toast({ variant: "destructive", title: "Offline", description: "No internet connection and no stored exchange rate available." });
    }
    setIsLoading(false);
  }, [toast, isOnline]);


  useEffect(() => {
    loadInitialRate();
  }, [loadInitialRate]); // isOnline dependency removed to avoid re-fetching just on online status change if already loaded.

  useEffect(() => {
    if (idrAmount === '' || !exchangeRateData) {
      setUsdAmount('');
      return;
    }
    const idrNum = parseFloat(idrAmount);
    if (!isNaN(idrNum) && exchangeRateData.rate > 0) {
      setUsdAmount((idrNum / exchangeRateData.rate).toFixed(2));
    } else if (isNaN(idrNum)) {
      setUsdAmount('Invalid input');
    } else {
       setUsdAmount('');
    }
  }, [idrAmount, exchangeRateData]);

  const handleIdrChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIdrAmount(e.target.value);
  };

  const handleRefreshRate = async () => {
    if (!isOnline) {
      toast({ variant: "destructive", title: "Offline", description: "Cannot refresh rate. No internet connection." });
      return;
    }
    setIsLoading(true);
    try {
      const fetchedRate = await fetchExchangeRateIDRtoUSD();
      const newRateData = storeExchangeRate(fetchedRate);
      setExchangeRateData(newRateData);
      toast({ title: "Exchange rate refreshed!", description: `New IDR to USD rate: ${fetchedRate.toFixed(2)}` });
    } catch (error) {
      toast({ variant: "destructive", title: "Refresh Failed", description: "Could not refresh exchange rate. Please try again." });
    }
    setIsLoading(false);
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
        <CardDescription>Convert Indonesian Rupiah (IDR) to US Dollars (USD).</CardDescription>
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
            aria-label="IDR amount input"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="usd" className="text-sm font-medium">US Dollars (USD)</Label>
          <Input
            id="usd"
            type="text"
            value={usdAmount}
            readOnly
            placeholder="Result in USD"
            aria-label="USD result"
            className="mt-1 bg-muted border-dashed"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 pt-4">
        <div className="text-xs text-muted-foreground">
          Current Rate (1 USD): {exchangeRateData ? `Rp ${exchangeRateData.rate.toFixed(2)}` : (isLoading ? 'Loading...' : 'N/A')}
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
