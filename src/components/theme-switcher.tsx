"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

import { Monitor, Moon, Sun } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Tabs defaultValue={theme} onValueChange={setTheme}>
      <TabsList>
        <TabsTrigger value="light">
            <Sun className="size-[1.2rem]" />
        </TabsTrigger>
        <TabsTrigger value="dark">
            <Moon className="size-[1.2rem]" />
        </TabsTrigger>
        <TabsTrigger value="system">
            <Monitor className="size-[1.2rem]" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
