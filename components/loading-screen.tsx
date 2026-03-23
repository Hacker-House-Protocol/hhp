"use client"

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = "Connecting" }: LoadingScreenProps) {
  return (
    <>
      <style>{`
        @keyframes hhp-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes hhp-spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes hhp-logo-glow {
          0%, 100% {
            opacity: 0.65;
            filter: drop-shadow(0 0 5px oklch(0.62 0.26 295 / 0.35));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 13px oklch(0.62 0.26 295 / 0.65));
          }
        }
        @keyframes hhp-cursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes hhp-bg-breathe {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
      `}</style>

      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-9 relative overflow-hidden">

        {/* Ambient radial glow */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 340,
            height: 340,
            background:
              "radial-gradient(circle, oklch(0.62 0.26 295 / 0.06) 0%, transparent 68%)",
            animation: "hhp-bg-breathe 3.5s ease-in-out infinite",
          }}
        />

        {/* Spinner assembly */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 84, height: 84 }}
        >
          {/* Static track ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid oklch(0.62 0.26 295 / 0.09)" }}
          />

          {/* Outer spinning arc */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1.5px solid transparent",
              borderTopColor: "oklch(0.62 0.26 295)",
              borderRightColor: "oklch(0.62 0.26 295 / 0.22)",
              animation: "hhp-spin 1.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
            }}
          />

          {/* Inner counter-arc */}
          <div
            className="absolute rounded-full"
            style={{
              inset: 17,
              border: "1px solid transparent",
              borderBottomColor: "oklch(0.62 0.26 295 / 0.45)",
              borderLeftColor: "oklch(0.62 0.26 295 / 0.12)",
              animation: "hhp-spin-reverse 2.4s linear infinite",
            }}
          />

          {/* Logo */}
          <img
            src="/assets/hacker-house-protocol-logo.svg"
            alt="HHP"
            width={22}
            height={20}
            style={{ animation: "hhp-logo-glow 2.8s ease-in-out infinite" }}
          />
        </div>

        {/* Message */}
        <p
          className="font-mono text-xs tracking-[0.22em] uppercase select-none"
          style={{ color: "oklch(0.50 0.03 278)" }}
        >
          {message}
          <span
            aria-hidden
            style={{
              display: "inline-block",
              marginLeft: "0.1em",
              animation: "hhp-cursor 1.1s step-end infinite",
            }}
          >
            _
          </span>
        </p>
      </div>
    </>
  )
}
