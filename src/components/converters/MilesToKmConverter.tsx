
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

  // Calculate kilometers from miles
  useEffect(() => {
    if (lastChanged === 'km') return; // If kilometers was just manually changed, don't re-calculate it

    if (miles === '') {
      setKilometers('');
      return;
    }
    const milesNum = parseFloat(miles);
    if (!isNaN(milesNum)) {
      setKilometers((milesNum * MILE_TO_KM_FACTOR).toFixed(2));
    }
    // If milesNum is NaN (e.g. "1.2.a"), kilometers won't update, allowing user to correct 'miles' input.
  }, [miles, lastChanged]);

  // Calculate miles from kilometers
  useEffect(() => {
    if (lastChanged === 'miles') return; // If miles was just manually changed, don't re-calculate it

    if (kilometers === '') {
      setMiles('');
      return;
    }
    const kmNum = parseFloat(kilometers);
    if (!isNaN(kmNum)) {
      setMiles((kmNum / MILE_TO_KM_FACTOR).toFixed(2));
    }
    // If kmNum is NaN, miles won't update.
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
