"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarTask() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    
    <div>
        <Calendar
          mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => date < new Date("2023-01-01")}
            initialFocus
            className="border border-gray-300 rounded-lg shadow-sm bg-amber-900"
        />
    </div>

  );
}
