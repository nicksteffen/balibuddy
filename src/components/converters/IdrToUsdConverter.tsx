
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
    if (storedRate && !isRefreshing && !exchangeRateData) { // Use stored rate if not refreshing, it exists, and no current rate
      setExchangeRateData(storedRate);
    }

    if (isOnline) {
      try {
        const fetchedRate = await fetchExchangeRateIDRtoUSD();
        const newRateData = storeExchangeRate(fetchedRate);
        setExchangeRateData(newRateData); // This will trigger useEffects for conversion
        if (isRefreshing) {
          toast({ title: "Exchange rate refreshed!", description: `New IDR to USD rate: ${newRateData.rate.toFixed(2)}` });
        } else if (!storedRate || (storedRate && storedRate.rate !== newRateData.rate)) {
           toast({ title: "Exchange rate updated", description: `IDR to USD rate: ${newRateData.rate.toFixed(2)}` });
        }
      } catch (error) {
        if (isRefreshing || !storedRate) {
          toast({ variant: "destructive", title: "Error fetching rate", description: "Could not fetch new exchange rate. Using stored rate if available." });
        }
        if (!exchangeRateData && storedRate) { 
            setExchangeRateData(storedRate);
        }
      }
    } else if (!storedRate) {
        toast({ variant: "destructive", title: "Offline", description: "No internet connection and no stored exchange rate available." });
    } else if (isRefreshing && !isOnline) {
        toast({ variant: "destructive", title: "Offline", description: "Cannot refresh rate. No internet connection." });
    }
    setIsLoading(false);
  }, [toast, isOnline, exchangeRateData]);


  useEffect(() => {
    loadInitialRate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // loadInitialRate is memoized.

  // Calculate USD from IDR
  useEffect(() => {
    if (lastChanged === 'usd') return; // If USD was just manually changed, don't re-calculate it

    if (!exchangeRateData || exchangeRateData.rate <= 0) {
      // Potentially clear usdAmount if rate is invalid/unavailable, or show a message
      // For now, if idrAmount is also empty, usdAmount will be cleared. Otherwise, it might show stale data.
      // If idrAmount is empty, clear usdAmount
      if (idrAmount === '') setUsdAmount('');
      return;
    }

    if (idrAmount === '') {
      setUsdAmount('');
      return;
    }
    const idrNum = parseFloat(idrAmount);
    if (!isNaN(idrNum)) {
      setUsdAmount((idrNum / exchangeRateData.rate).toFixed(2));
    }
    // If idrNum is NaN, usdAmount won't update from here.
  }, [idrAmount, exchangeRateData, lastChanged]);

  // Calculate IDR from USD
  useEffect(() => {
    if (lastChanged === 'idr') return; // If IDR was just manually changed, don't re-calculate it

    if (!exchangeRateData || exchangeRateData.rate <= 0) {
      if (usdAmount === '') setIdrAmount('');
      return;
    }
    
    if (usdAmount === '') {
      setIdrAmount('');
      return;
    }
    const usdNum = parseFloat(usdAmount);
    if (!isNaN(usdNum)) {
      setIdrAmount((usdNum * exchangeRateData.rate).toFixed(0)); // IDR usually whole number
    }
    // If usdNum is NaN, idrAmount won't update from here.
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
    loadInitialRate(true); 
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
          Current Rate (1 USD): {exchangeRateData ? `Rp ${exchangeRateData.rate.toFixed(2)}` : (isLoading ? 'Loading...' : 'N/A')}
          <br />
          Last Updated: {isLoading && !exchangeRateData?.lastUpdated ? 'Loading...' : lastUpdatedDate}
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
