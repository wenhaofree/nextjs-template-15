"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HydrationSafe, useMounted } from "./HydrationSafe";

/**
 * Component to test and demonstrate hydration safety
 */
export function HydrationTest() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [clientTime, setClientTime] = useState<string>("");

  useEffect(() => {
    setClientTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setClientTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hydration Safety Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Safe theme display */}
          <div>
            <h3 className="font-semibold mb-2">Theme Status (Safe):</h3>
            <p>Mounted: {mounted ? "✅ Yes" : "❌ No"}</p>
            <p>Current Theme: {mounted ? theme : "Loading..."}</p>
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              disabled={!mounted}
              className="mt-2"
            >
              Toggle Theme
            </Button>
          </div>

          {/* Client-only content */}
          <HydrationSafe
            fallback={<p>Loading client time...</p>}
          >
            <div>
              <h3 className="font-semibold mb-2">Client Time:</h3>
              <p>{clientTime}</p>
            </div>
          </HydrationSafe>

          {/* Browser info (client-only) */}
          <HydrationSafe
            fallback={<p>Loading browser info...</p>}
          >
            <div>
              <h3 className="font-semibold mb-2">Browser Info:</h3>
              <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
              <p>Language: {navigator.language}</p>
              <p>Online: {navigator.onLine ? "✅" : "❌"}</p>
            </div>
          </HydrationSafe>

          {/* Local storage test */}
          <HydrationSafe
            fallback={<p>Loading storage info...</p>}
          >
            <div>
              <h3 className="font-semibold mb-2">Storage Test:</h3>
              <p>Local Storage Available: {typeof localStorage !== "undefined" ? "✅" : "❌"}</p>
              <Button
                onClick={() => {
                  localStorage.setItem("hydration-test", new Date().toISOString());
                  alert("Saved to localStorage!");
                }}
                className="mt-2"
              >
                Test Local Storage
              </Button>
            </div>
          </HydrationSafe>
        </CardContent>
      </Card>
    </div>
  );
}
