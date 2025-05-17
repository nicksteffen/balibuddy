
"use client";

import { useState, useEffect, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Scale } from 'lucide-react';

const POUND_TO_KG_FACTOR = 0.453592;

export function PoundsToKgConverter() {
  const [pounds, setPounds] = useState<string>('');
  const [kilograms, setKilograms] = useState<string>('');

  useEffect(() => {
    if (pounds === '') {
      setKilograms('');
      return;
    }
    const poundsNum = parseFloat(pounds);
    if (!isNaN(poundsNum)) {
      setKilograms((poundsNum * POUND_TO_KG_FACTOR).toFixed(2));
    } else {
      setKilograms('Invalid input');
    }
  }, [pounds]);

  const handlePoundsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPounds(e.target.value);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Scale className="h-6 w-6 text-primary" />
          Pounds to Kilograms
        </CardTitle>
        <CardDescription>Convert weights from pounds to kilograms.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="pounds" className="text-sm font-medium">Pounds (lbs)</Label>
          <Input
            id="pounds"
            type="number"
            value={pounds}
            onChange={handlePoundsChange}
            placeholder="Enter pounds"
            aria-label="Pounds input"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="kilograms-p2k" className="text-sm font-medium">Kilograms (kg)</Label>
          <Input
            id="kilograms-p2k"
            type="text"
            value={kilograms}
            readOnly
            placeholder="Result in kg"
            aria-label="Kilograms result"
            className="mt-1 bg-muted border-dashed"
          />
        </div>
      </CardContent>
    </Card>
  );
}
