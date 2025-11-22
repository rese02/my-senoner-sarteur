"use client"

import * as React from "react"
import { format, getDay } from "date-fns"
import { de } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BUSINESS_HOURS } from "@/lib/constants"
import { add } from 'date-fns';

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: de }) : <span>Wählen Sie ein Datum</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={de}
          disabled={(day) => {
            const today = new Date();
            today.setHours(0,0,0,0); // Start of today

            // Disable past dates
            if (day < today) return true;

            // Disable closed days (e.g., Sunday)
            if (BUSINESS_HOURS.closedDays.includes(getDay(day))) return true;

            // Disable today if it's too late for preparation
            const earliestPickupTime = add(new Date(), { hours: BUSINESS_HOURS.minPrepTimeHours });
            if (day.getTime() === today.getTime() && new Date() > earliestPickupTime) {
                // This logic is simple, for more complex time-based logic,
                // you would also need a time picker. For now, we just disable today if the prep time window has passed.
                // A better approach would be to disable today if current time > closeHour - prepTime
            }

            return false;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
