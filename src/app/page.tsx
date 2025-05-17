
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MilesToKmConverter } from "@/components/converters/MilesToKmConverter";
import { PoundsToKgConverter } from "@/components/converters/PoundsToKgConverter";
import { MlToOzConverter } from "@/components/converters/MlToOzConverter";
import { IdrToUsdConverter } from "@/components/converters/IdrToUsdConverter";
import { Coins, Milestone, Scale, Pipette, Plane } from 'lucide-react';

export default function BaliBuddyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
      <header className="text-center mb-8 mt-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Plane className="h-12 w-12 text-primary transform -rotate-12" />
          <h1 className="text-5xl font-extrabold tracking-tight"
              style={{
                // A bit of a tropical gradient for the title
                background: 'linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
          >
            Bali Buddy
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">Your friendly travel companion for Bali conversions</p>
      </header>

      <main className="w-full max-w-xl">
        <Tabs defaultValue="currency" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 shadow-md rounded-lg">
            <TabsTrigger value="currency" className="py-3 text-sm font-semibold">
              <Coins className="mr-2 h-5 w-5" /> Currency
            </TabsTrigger>
            <TabsTrigger value="distance" className="py-3 text-sm font-semibold">
              <Milestone className="mr-2 h-5 w-5" /> Distance
            </TabsTrigger>
            <TabsTrigger value="weight" className="py-3 text-sm font-semibold">
              <Scale className="mr-2 h-5 w-5" /> Weight
            </TabsTrigger>
            <TabsTrigger value="volume" className="py-3 text-sm font-semibold">
              <Pipette className="mr-2 h-5 w-5" /> Volume
            </TabsTrigger>
          </TabsList>

          <TabsContent value="currency">
            <IdrToUsdConverter />
          </TabsContent>
          <TabsContent value="distance">
            <MilesToKmConverter />
          </TabsContent>
          <TabsContent value="weight">
            <PoundsToKgConverter />
          </TabsContent>
          <TabsContent value="volume">
            <MlToOzConverter />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="text-center mt-12 mb-6">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Bali Buddy. Travel smart!
        </p>
      </footer>
    </div>
  );
}
