"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

interface CalendarTaskProps {
  onDateSelect: (date: Date | undefined) => void;
}

export default function CalendarTask({ onDateSelect }: CalendarTaskProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateSelect(newDate);
  };

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleSelect}
        disabled={(date) => date < new Date("2023-01-01")}
        initialFocus
        className="border border-gray-300 rounded-lg shadow-sm bg-gray-900 max-h-73 overflow-hidden"
      />
    </div>
  );
}
