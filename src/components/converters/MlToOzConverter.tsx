
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

  useEffect(() => {
    if (milliliters === '') {
      setOunces('');
      return;
    }
    const mlNum = parseFloat(milliliters);
    if (!isNaN(mlNum)) {
      setOunces((mlNum * ML_TO_OZ_FACTOR).toFixed(2));
    } else {
      setOunces('Invalid input');
    }
  }, [milliliters]);

  const handleMillilitersChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMilliliters(e.target.value);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Pipette className="h-6 w-6 text-primary" />
          Milliliters to Ounces
        </CardTitle>
        <CardDescription>Convert volumes from milliliters to fluid ounces (fl oz).</CardDescription>
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
            type="text"
            value={ounces}
            readOnly
            placeholder="Result in fl oz"
            aria-label="Fluid ounces result"
            className="mt-1 bg-muted border-dashed"
          />
        </div>
      </CardContent>
    </Card>
  );
}
