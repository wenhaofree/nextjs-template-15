'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type ScreenshotSize = 'full' | '16:9';

export default function ScreenshotPage() {
  const [url, setUrl] = useState('');
  const [size, setSize] = useState<ScreenshotSize>('full');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, size }),
      });

      if (!response.ok) {
        throw new Error('Screenshot generation failed');
      }

      const blob = await response.blob();
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'screenshot.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Website Screenshot Tool</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL"
            required
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Take Screenshot'}
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Screenshot Size</Label>
          <RadioGroup
            defaultValue="full"
            value={size}
            onValueChange={(value) => setSize(value as ScreenshotSize)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full" id="full" />
              <Label htmlFor="full">Full Page</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="16:9" id="16:9" />
              <Label htmlFor="16:9">16:9 Ratio</Label>
            </div>
          </RadioGroup>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
      </form>
    </div>
  );
}
