"use client";

import React, { useEffect, useRef, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudRain, Wind, Music, Speaker, Trees } from "lucide-react";

const DURATIONS = {
  pomodoro: 25 * 60,
  "short-break": 5 * 60,
  "long-break": 15 * 60,
} as const;

type Mode = keyof typeof DURATIONS;

type Pomodoro = {
  id: number;
  task_id: number;
  duration_minutes: number;
  is_break: boolean;
};

const QUOTES = [
  "Focus on being productive, not busy.",
  "Discipline is the bridge between goals and accomplishment.",
  "You don’t need more time; you just need more focus.",
  "Consistency beats motivation.",
  "It always seems impossible until it’s done.",
];

const AMBIENCES = [
  { id: "forest", name: "Forest", icon: Trees, file: "/sounds/forest.mp3" },
  { id: "rain", name: "Rain", icon: CloudRain, file: "/sounds/rain.mp3" },
  { id: "wind", name: "Wind", icon: Wind, file: "/sounds/wind.mp3" },
  { id: "lofi", name: "Lofi", icon: Music, file: "/sounds/lofi.mp3" },
];

export default function PomodoroPage() {
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState<number>(DURATIONS.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [quote, setQuote] = useState(() => QUOTES[0]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedAmbience, setSelectedAmbience] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.45);
  const [currentPomodoro, setCurrentPomodoro] = useState<Pomodoro | null>(null);

  const ambienceRef = useRef<Howl | null>(null);
  const intervalRef = useRef<number | null>(null);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const percentage = ((DURATIONS[mode] - secondsLeft) / DURATIONS[mode]) * 100;

  const playAmbience = (id: string) => {
    const item = AMBIENCES.find((a) => a.id === id);
    if (!item) return;
    ambienceRef.current?.stop();
    const sound = new Howl({ src: [item.file], loop: true, volume });
    sound.play();
    ambienceRef.current = sound;
    setSelectedAmbience(id);
  };

  const stopAmbience = () => {
    ambienceRef.current?.stop();
    ambienceRef.current = null;
    setSelectedAmbience(null);
  };

  const startPomodoro = async () => {
    const mock = {
      id: Date.now(),
      task_id: Number(selectedTask) || 0,
      duration_minutes: DURATIONS[mode] / 60,
      is_break: mode !== "pomodoro",
    } as Pomodoro;
    setCurrentPomodoro(mock);
    setSecondsLeft(DURATIONS[mode]);
    setIsRunning(true);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  };

  const stopPomodoro = async () => {
    setIsRunning(false);
    setCurrentPomodoro(null);
    stopAmbience();
  };

  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            window.clearInterval(intervalRef.current!);
            setIsRunning(false);
            stopPomodoro();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    setIsRunning(false);
    setSecondsLeft(DURATIONS[mode]);
  }, [mode]);

  useEffect(() => {
    if (ambienceRef.current) ambienceRef.current.volume(volume);
  }, [volume]);

  const modeAccent = (m: Mode) =>
    m === "pomodoro"
      ? "from-green-500 to-green-400"
      : m === "short-break"
      ? "from-blue-400 to-blue-300"
      : "from-orange-400 to-orange-300";

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-6 bg-gradient-to-b from-[#0B0B0C] to-[#141416] text-gray-100">
        <Card className="w-full max-w-lg rounded-3xl bg-[rgba(24,24,27,0.65)] backdrop-blur-lg border border-gray-800/50 shadow-2xl p-6">
          <CardContent className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <Select onValueChange={(v) => setSelectedTask(v)}>
                  <SelectTrigger className="w-full bg-gray-800/60 border border-gray-700/40 rounded-xl px-3 py-2 text-sm">
                    <SelectValue placeholder={selectedTask ? String(selectedTask) : "Select task"} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/90 text-gray-100">
                    <SelectGroup>
                      <SelectLabel>Work</SelectLabel>
                      <SelectItem value="101">Project A</SelectItem>
                      <SelectItem value="102">Emails</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Personal</SelectLabel>
                      <SelectItem value="201">Reading</SelectItem>
                      <SelectItem value="202">Exercise</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-400 text-right">Today</div>
                <div className="text-sm font-medium">2 / 4</div>
              </div>
            </div>

            {/* Timer */}
            <div className="flex flex-col items-center gap-4">
              <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
                <TabsList className="grid grid-cols-3 gap-2 bg-transparent p-1 rounded-lg">
                  {["pomodoro", "short-break", "long-break"].map((m) => (
                    <TabsTrigger
                      key={m}
                      value={m}
                      className={`rounded-lg py-2 text-sm ${
                        mode === m ? "bg-gradient-to-r text-white" : "text-gray-300/80"
                      }`}
                    >
                      {m === "pomodoro" ? "Pomodoro" : m === "short-break" ? "Short Break" : "Long Break"}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={mode} className="w-full text-center space-y-3">
                  <div className="text-6xl md:text-7xl font-mono font-semibold tracking-tight select-none">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </div>

                  <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${modeAccent(mode)}`}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full">
                    <div className="flex-1 flex gap-3">
                      {!isRunning ? (
                        <Button
                          aria-label="Start Pomodoro"
                          onClick={startPomodoro}
                          className="w-full bg-gradient-to-r from-green-500 to-green-400"
                        >
                          Start
                        </Button>
                      ) : (
                        <Button
                          aria-label="Stop Pomodoro"
                          variant="destructive"
                          onClick={stopPomodoro}
                          className="w-full"
                        >
                          Stop
                        </Button>
                      )}
                      <Button
                        aria-label="Reset timer"
                        variant="secondary"
                        onClick={() => {
                          setIsRunning(false);
                          setSecondsLeft(DURATIONS[mode]);
                        }}
                        className="w-32 hidden sm:inline-flex"
                      >
                        Reset
                      </Button>
                    </div>

                    <Button
                      onClick={() => setIsFocus(true)}
                      className="w-full sm:w-40"
                    >
                      Enter Focus Mode
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Ambience controls */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Speaker size={16} />
                  <span>Ambience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-400">Vol</div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                {AMBIENCES.map((amb) => {
                  const Icon = amb.icon;
                  const active = selectedAmbience === amb.id;
                  return (
                    <button
                      key={amb.id}
                      onClick={() => (active ? stopAmbience() : playAmbience(amb.id))}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition ${
                        active
                          ? "bg-green-500/20 border-green-500/40"
                          : "bg-gray-800/50 border-gray-700/40"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="capitalize">{amb.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div>
                Tip: press <kbd className="px-1 py-0.5 bg-gray-800/50 rounded">Space</kbd> to start/stop
              </div>
              <div>Accessible · Calm theme</div>
            </div>
          </CardContent>
        </Card>

        {/* Focus Mode */}
        {isFocus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl">
            <div className="max-w-2xl w-full rounded-2xl p-10 bg-gradient-to-br from-black/60 to-gray-900/60 border border-gray-800/40 shadow-2xl flex flex-col items-center gap-6">
              <div className="text-6xl md:text-8xl font-mono font-semibold">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <div className="text-center max-w-2xl text-gray-300 italic text-lg">{quote}</div>

              <div className="w-full flex justify-center mt-6">
                <div className="relative w-64 h-3 bg-green-400/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400"
                    style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 w-full max-w-sm">
                <Button className="flex-1" onClick={() => setIsFocus(false)}>
                  Exit Focus Mode
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    stopPomodoro();
                    setIsFocus(false);
                  }}
                >
                  Mark Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
