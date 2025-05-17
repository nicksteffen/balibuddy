
"use client";

import { useState, useEffect, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Pipette } from 'lucide-react';

const ML_TO_OZ_FACTOR = 0.033814;

export function MlToOzConverter() {
  const [milliliters, setMilliliters] = useState<string>('');
  const [ounces, setOunces] = useState<string>('');
  const [lastChanged, setLastChanged] = useState<'ml' | 'oz' | null>(null);

  useEffect(() => {
    if (lastChanged === 'oz' || milliliters === '') {
      if (milliliters === '' && lastChanged === 'ml') setOunces('');
      return;
    }
    const mlNum = parseFloat(milliliters);
    if (!isNaN(mlNum)) {
      setOunces((mlNum * ML_TO_OZ_FACTOR).toFixed(2));
    } else {
      setOunces('Invalid input');
    }
  }, [milliliters, lastChanged]);

  useEffect(() => {
    if (lastChanged === 'ml' || ounces === '') {
      if (ounces === '' && lastChanged === 'oz') setMilliliters('');
      return;
    }
    const ozNum = parseFloat(ounces);
    if (!isNaN(ozNum)) {
      setMilliliters((ozNum / ML_TO_OZ_FACTOR).toFixed(2));
    } else {
      setMilliliters('Invalid input');
    }
  }, [ounces, lastChanged]);

  const handleMillilitersChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMilliliters(e.target.value);
    setLastChanged('ml');
  };

  const handleOuncesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOunces(e.target.value);
    setLastChanged('oz');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Pipette className="h-6 w-6 text-primary" />
          Milliliters to Ounces
        </CardTitle>
        <CardDescription>Convert volumes between milliliters (ml) and fluid ounces (fl oz).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="milliliters" className="text-sm font-medium">Milliliters (ml)</Label>
          <Input
            id="milliliters"
            type="number"
            value={milliliters}
            onChange={handleMillilitersChange}
            placeholder="Enter milliliters"
            aria-label="Milliliters input"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="ounces" className="text-sm font-medium">Fluid Ounces (fl oz)</Label>
          <Input
            id="ounces"
            type="number"
            value={ounces}
            onChange={handleOuncesChange}
            placeholder="Enter fluid ounces"
            aria-label="Fluid ounces input"
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}
