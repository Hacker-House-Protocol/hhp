"use client"

import { useRouter } from "next/navigation"
import { useCreateHackSpace } from "@/services/api/hack-spaces"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PageContainer } from "../../_components/page-container"
import { HackSpaceForm } from "./_components/create-hack-space-form"
import type { CreateHackSpaceInput } from "@/lib/schemas/hack-space"

export default function CreateHackSpacePage() {
  const router = useRouter()
  const createHackSpace = useCreateHackSpace()

  async function handleSubmit(values: CreateHackSpaceInput) {
    const hs = await createHackSpace.mutateAsync(values)
    toast.success("Hack Space created")
    router.push(`/dashboard/hack-spaces/${hs.id}`)
  }

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

        <HackSpaceForm
          onFormSubmit={handleSubmit}
          submitLabel="Launch Space →"
          submittingLabel="Creating..."
        />
      </div>
    </PageContainer>
  )
}
