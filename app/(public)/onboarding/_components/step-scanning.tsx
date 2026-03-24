"use client"

import { useEffect, useState } from "react"

interface StepScanningProps {
  onComplete: () => void
}

const SCAN_ITEMS = [
  { label: "Wallet address", detail: "resolved" },
  { label: "POAP collection", detail: "importing" },
  { label: "Builder Score", detail: "calculating" },
  { label: "On-chain transactions", detail: "indexing" },
  { label: "Protocol memberships", detail: "verifying" },
]

// Each item appears 380ms apart, starting at 200ms
const ITEM_DELAY_MS = 380
const ITEM_BASE_MS = 200

export function StepScanning({ onComplete }: StepScanningProps) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(onComplete, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    SCAN_ITEMS.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleCount((c) => c + 1), ITEM_BASE_MS + i * ITEM_DELAY_MS),
      )
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Step header */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
          Analyzing
        </p>
        <h1 className="font-display font-bold text-foreground text-4xl leading-tight">
          Reading the chain.
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-md">
          We&apos;re pulling your on-chain history to build your builder profile. This takes just a moment.
        </p>
      </div>

      {/* Scan card */}
      <div
        className="rounded-2xl border p-6 flex flex-col gap-5"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        {/* Progress bar */}
        <div className="flex flex-col gap-2">
          <div
            className="h-px rounded-full overflow-hidden"
            style={{ background: "var(--border)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                background: "var(--primary)",
                width: "0%",
                animation: "scan-progress 2.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
              }}
            />
          </div>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.12em]">
            Scanning on-chain data
          </p>
        </div>

        {/* Scan items */}
        <div className="flex flex-col gap-2.5">
          {SCAN_ITEMS.map((item, i) => {
            const isVisible = i < visibleCount
            return (
              <div
                key={item.label}
                className="flex items-center justify-between transition-all duration-300"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(4px)",
                }}
              >
                <span className="text-sm font-mono text-muted-foreground">{item.label}</span>
                <span
                  className="text-[10px] font-mono uppercase tracking-widest"
                  style={{ color: "var(--primary)" }}
                >
                  {item.detail}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes scan-progress {
          0%   { width: 0% }
          100% { width: 96% }
        }
      `}</style>
    </div>
  )
}
