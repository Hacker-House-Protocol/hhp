"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value?: string          // ISO date string "YYYY-MM-DD"
  onChange: (value: string | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  /** Disable dates before this date */
  disableBefore?: Date
  startMonth?: Date
  endMonth?: Date
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled,
  disableBefore,
  startMonth,
  endMonth,
}: DatePickerProps) {
  const date = value ? parseISO(value) : undefined

  function handleSelect(selected: Date | undefined) {
    onChange(selected ? format(selected, "yyyy-MM-dd") : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          data-empty={!date}
          className={cn(
            "justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={date}
          onSelect={handleSelect}
          disabled={disableBefore ? { before: disableBefore } : undefined}
          startMonth={startMonth ?? new Date(1900, 0)}
          endMonth={endMonth ?? new Date(new Date().getFullYear() + 5, 11)}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
