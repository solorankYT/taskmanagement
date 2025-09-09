"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DURATIONS = {
  pomodoro: 25 * 60,
  "short-break": 5 * 60,
  "long-break": 15 * 60,
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<keyof typeof DURATIONS>("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS["pomodoro"]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  useEffect(() => {
    resetTimer();
  }, [mode]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = "You have an active timer. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isRunning]);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(DURATIONS[mode]);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const percentage = ((DURATIONS[mode] - secondsLeft) / DURATIONS[mode]) * 100;

  return (
    <Card className="w-full max-w-md mx-auto p-4 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Focus Mode
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={mode} onValueChange={(value) => setMode(value as keyof typeof DURATIONS)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
            <TabsTrigger value="short-break">Short Break</TabsTrigger>
            <TabsTrigger value="long-break">Long Break</TabsTrigger>
          </TabsList>

          <TabsContent value={mode}>
            <div className="text-center text-5xl font-bold tracking-widest">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>

            <Progress value={percentage} className="h-3 rounded-full bg-muted" />

            <div className="flex justify-center gap-3 pt-4">
              {isRunning ? (
                <Button variant="destructive" onClick={() => setIsRunning(false)}>
                  Pause
                </Button>
              ) : (
                <Button onClick={() => setIsRunning(true)}>Start</Button>
              )}
              <Button variant="secondary" onClick={resetTimer}>
                Reset
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
