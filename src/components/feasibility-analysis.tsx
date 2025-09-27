"use client";

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UploadCloud, Loader2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { determineCropFeasibility } from '@/ai/flows/crop-analysis';
import type { DetermineCropFeasibilityOutput } from '@/ai/flows/crop-analysis';


const feasibilitySchema = z.object({
  cropType: z.string().min(2, "Please enter a crop type."),
  region: z.string().min(2, "Please enter a region."),
  economicData: z.string().min(10, "Please provide economic data."),
});

export default function FeasibilityAnalysis() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [result, setResult] = useState<DetermineCropFeasibilityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof feasibilitySchema>>({
    resolver: zodResolver(feasibilitySchema),
    defaultValues: {
      cropType: "",
      region: "",
      economicData: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("File is too large. Please upload an image under 4MB.");
        form.setError("root", { type: "custom", message: "File is too large" });
        return;
      }
      setResult(null);
      setError(null);
      form.clearErrors("root");
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(URL.createObjectURL(file));
        setImageData(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof feasibilitySchema>) {
    if (!imageData) {
      setError("Please upload an image of the region.");
      form.setError("root", { type: "custom", message: "Please upload an image of the region." });
      return;
    }
    
    startTransition(async () => {
      setError(null);
      setResult(null);

      try {
        const res = await determineCropFeasibility({ ...values, cropImageUri: imageData });
        setResult(res);
      } catch (e) {
        setError("An error occurred during analysis. Please try again.");
        console.error(e);
      }
    });
  }

  return (
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tomato" {...field} />
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
                    <Input placeholder="e.g., Bankura" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="economicData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Economic Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., High market demand, moderate setup costs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormItem>
                <FormLabel>Region Image</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="region-image" className="cursor-pointer">
                      <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-4 text-center hover:border-primary transition-colors h-40 flex flex-col justify-center items-center">
                        {imagePreview ? (
                          <Image src={imagePreview} alt="Region preview" fill style={{ objectFit: 'contain' }} className="rounded-lg p-1" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-muted-foreground">
                            <UploadCloud className="w-8 h-8" />
                            <span className="font-semibold text-sm">Upload an image of the land</span>
                          </div>
                        )}
                      </div>
                    </label>
                    <input id="region-image" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                  </div>
                </FormControl>
                <FormMessage>{form.formState.errors.root?.message}</FormMessage>
              </FormItem>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Feasibility
            </Button>
          </form>
        </Form>
        <div className="min-h-[20rem] flex items-center justify-center">
          {isPending && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
              <Loader2 className="w-16 h-16 animate-spin" />
              <p>Analyzing feasibility...</p>
            </div>
          )}
          {error && !form.formState.errors.root && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <Card className="w-full animate-in fade-in-50">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">Feasibility Score</CardTitle>
                <div className="flex items-center gap-2 pt-2">
                  <Progress value={result.feasibilityScore} className="w-full" />
                  <span className="text-lg font-bold">{result.feasibilityScore}/100</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Rationale:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{result.rationale}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Recommendations:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{result.recommendations}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </CardContent>
  );
}
