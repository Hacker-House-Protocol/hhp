"use client"

import { useState } from "react"
import { useHackSpaces } from "@/services/api/hack-spaces"
import { HackSpaceCard } from "./hack-space-card"
import { CreateHackSpaceModal } from "./create-hack-space-modal"
import { Button } from "@/components/ui/button"

interface HackSpacesFeedProps {
  currentUserId: string | null
}

export function HackSpacesFeed({ currentUserId }: HackSpacesFeedProps) {
  const { data: hackSpaces = [], isLoading } = useHackSpaces()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-foreground text-lg">Hack Spaces</h2>
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 text-xs"
          >
            + Create Space
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5 h-40 animate-pulse" />
            ))}
          </div>
        ) : hackSpaces.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-lg p-12 flex flex-col items-center gap-4 text-center">
            <span className="text-4xl">🔗</span>
            <div className="flex flex-col gap-1">
              <p className="font-display font-semibold text-foreground">No Hack Spaces yet.</p>
              <p className="text-muted-foreground text-sm">
                Be the first to post a project and find your builders.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setShowModal(true)}
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5 mt-2"
            >
              Create the first Space →
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {hackSpaces.map((hs) => (
              <HackSpaceCard key={hs.id} hackSpace={hs} currentUserId={currentUserId} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateHackSpaceModal
          onCreated={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
