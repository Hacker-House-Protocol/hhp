"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PageContainer } from "../../_components/page-container"
import { CreateHackSpaceForm } from "./_components/create-hack-space-form"

export default function CreateHackSpacePage() {
  const router = useRouter()

  return (
    <PageContainer>
      <div className="w-2xl max-w-full mx-auto flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="font-mono text-xs h-7 px-2 text-muted-foreground"
          >
            ← Back
          </Button>
          <span className="text-border">|</span>
          <h1 className="font-display font-bold text-foreground text-xl">
            Create Hack Space
          </h1>
        </div>

        <CreateHackSpaceForm />
      </div>
    </PageContainer>
  )
}
