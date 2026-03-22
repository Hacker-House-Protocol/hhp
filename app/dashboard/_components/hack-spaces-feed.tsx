export function HackSpacesFeed() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-foreground text-lg">
          Hack Spaces
        </h2>
        <button
          disabled
          className="text-xs font-mono px-3 py-1.5 rounded-sm border border-dashed border-border text-muted-foreground/50 cursor-not-allowed"
        >
          + Create Space
        </button>
      </div>

      {/* Empty state */}
      <div className="bg-card border border-dashed border-border rounded-lg p-12 flex flex-col items-center gap-4 text-center">
        <span className="text-4xl">🔗</span>
        <div className="flex flex-col gap-1">
          <p className="font-display font-semibold text-foreground">
            No Hack Spaces yet.
          </p>
          <p className="text-muted-foreground text-sm">
            The protocol is warming up. Spaces will appear here as builders post projects.
          </p>
        </div>
        <p
          className="text-xs font-mono mt-2"
          style={{ color: "var(--primary)" }}
        >
          Coming soon →
        </p>
      </div>
    </div>
  )
}
