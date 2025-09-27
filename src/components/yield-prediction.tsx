"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { estimateCropYield } from '@/ai/flows/predictions';
import type { EstimateCropYieldOutput } from '@/ai/flows/predictions';


const yieldPredictionSchema = z.object({
  cropType: z.string().min(2, "Please enter a crop type."),
  region: z.string().min(2, "Please enter a region."),
  historicalData: z.string().min(10, "Please provide some historical data (e.g., past yields, weather)."),
});

export default function YieldPrediction() {
  const [result, setResult] = useState<EstimateCropYieldOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof yieldPredictionSchema>>({
    resolver: zodResolver(yieldPredictionSchema),
    defaultValues: {
      cropType: "",
      region: "",
      historicalData: "",
    },
  });

  function onSubmit(values: z.infer<typeof yieldPredictionSchema>) {
    startTransition(async () => {
      setError(null);
      setResult(null);

      try {
        const res = await estimateCropYield(values);
        setResult(res);
      } catch (e) {
        setError("An error occurred during estimation. Please try again.");
        console.error(e);
      }
    });
  }

  const getConfidenceBadgeVariant = (confidence: string) => {
    switch (confidence?.toLowerCase()) {
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'destructive';
      default:
        return 'outline';
    }
  };


  return (
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Corn, Wheat, Rice" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Birbhum, Kolhapur, Mirzapur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="historicalData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Data</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Last year's yield was 180 bushels/acre with average rainfall."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Estimate Yield
            </Button>
          </form>
        </Form>
        <div className="min-h-[20rem] flex items-center justify-center">
          {isPending && (
             <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
              <Loader2 className="w-16 h-16 animate-spin" />
              <p>Calculating yield estimate...</p>
            </div>
          )}

          {error && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Card className="w-full animate-in fade-in-50">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">{result.estimatedYield}</CardTitle>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm font-medium">Confidence:</span>
                  <Badge variant={getConfidenceBadgeVariant(result.confidenceLevel)}>{result.confidenceLevel}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Key Influencing Factors:</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{result.factorsInfluencingYield}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </CardContent>
  );
}
