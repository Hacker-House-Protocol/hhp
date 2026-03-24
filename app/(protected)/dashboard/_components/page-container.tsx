interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <main className={`max-w-6xl mx-auto px-6 py-8 w-full ${className}`}>
      {children}
    </main>
  )
}
