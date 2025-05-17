
"use client";

import { useState, useEffect, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Milestone } from 'lucide-react';

const MILE_TO_KM_FACTOR = 1.60934;

export function MilesToKmConverter() {
  const [miles, setMiles] = useState<string>('');
  const [kilometers, setKilometers] = useState<string>('');
  const [lastChanged, setLastChanged] = useState<'miles' | 'km' | null>(null);

  useEffect(() => {
    if (lastChanged === 'km' || miles === '') {
      if (miles === '' && lastChanged === 'miles') setKilometers('');
      return;
    }
    const milesNum = parseFloat(miles);
    if (!isNaN(milesNum)) {
      setKilometers((milesNum * MILE_TO_KM_FACTOR).toFixed(2));
    } else {
      setKilometers('Invalid input');
    }
  }, [miles, lastChanged]);

  useEffect(() => {
    if (lastChanged === 'miles' || kilometers === '') {
      if (kilometers === '' && lastChanged === 'km') setMiles('');
      return;
    }
    const kmNum = parseFloat(kilometers);
    if (!isNaN(kmNum)) {
      setMiles((kmNum / MILE_TO_KM_FACTOR).toFixed(2));
    } else {
      setMiles('Invalid input');
    }
  }, [kilometers, lastChanged]);

  const handleMilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMiles(e.target.value);
    setLastChanged('miles');
  };

  const handleKilometersChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKilometers(e.target.value);
    setLastChanged('km');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Milestone className="h-6 w-6 text-primary" />
          Miles to Kilometers
        </CardTitle>
        <CardDescription>Convert distances between miles and kilometers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="miles" className="text-sm font-medium">Miles</Label>
          <Input
            id="miles"
            type="number"
            value={miles}
            onChange={handleMilesChange}
            placeholder="Enter miles"
            aria-label="Miles input"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="kilometers-m2k" className="text-sm font-medium">Kilometers</Label>
          <Input
            id="kilometers-m2k"
            type="number"
            value={kilometers}
            onChange={handleKilometersChange}
            placeholder="Enter kilometers"
            aria-label="Kilometers input"
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}
