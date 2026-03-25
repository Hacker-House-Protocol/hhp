"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCreateHackerHouse } from "@/services/api/hacker-houses"
import { PageContainer } from "../../_components/page-container"
import { CreateHackerHouseForm } from "./_components/create-hacker-house-form"
import { BackButton } from "../../../_components/back-button"
import type { CreateHackerHouseInput } from "@/lib/schemas/hacker-house"

export default function CreateHackerHousePage() {
  const router = useRouter()
  const createHackerHouse = useCreateHackerHouse()

  async function handleSubmit(values: CreateHackerHouseInput) {
    const result = await createHackerHouse.mutateAsync(values)
    toast.success("Hacker House created!")
    router.push(`/dashboard/hacker-houses/${result.id}`)
  }

  return (
    <PageContainer>
      <div className="w-2xl max-w-full mx-auto flex flex-col gap-8">
        <BackButton href="/dashboard/hacker-houses" />
        <div>
          <h1 className="font-display font-bold text-foreground text-2xl">Create Hacker House</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Set up a co-living space for builders.
          </p>
        </div>
        <CreateHackerHouseForm
          onFormSubmit={handleSubmit}
          submitLabel="Create House →"
          submittingLabel="Creating..."
        />
      </div>
    </PageContainer>
  )
}
