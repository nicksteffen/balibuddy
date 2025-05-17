
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

  useEffect(() => {
    if (miles === '') {
      setKilometers('');
      return;
    }
    const milesNum = parseFloat(miles);
    if (!isNaN(milesNum)) {
      setKilometers((milesNum * MILE_TO_KM_FACTOR).toFixed(2));
    } else {
      setKilometers('Invalid input');
    }
  }, [miles]);

  const handleMilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMiles(e.target.value);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Milestone className="h-6 w-6 text-primary" />
          Miles to Kilometers
        </CardTitle>
        <CardDescription>Convert distances from miles to kilometers.</CardDescription>
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
            type="text"
            value={kilometers}
            readOnly
            placeholder="Result in km"
            aria-label="Kilometers result"
            className="mt-1 bg-muted border-dashed"
          />
        </div>
      </CardContent>
    </Card>
  );
}
