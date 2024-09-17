import React from "react"

const Skeleton = ({ className }: { className: string }) => (
  <div aria-live="polite" aria-busy="true" className={`${className} bg-muted animate-pulse rounded-md`}>
    <span className="sr-only">Loading...</span>
  </div>
)

const SVGSkeleton = ({ className }: { className: string }) => (
  <div className={`${className} bg-muted animate-pulse rounded-md`} />
)

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-8">
            <div className="relative">
              <div className="absolute -left-4 md:-left-8 top-0 h-full">
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <div className="ml-2 h-full w-0.5 bg-border"></div>
              </div>
              <div className="space-y-6">
                <section className="bg-card rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <SVGSkeleton className="w-32 h-32 rounded-full" />
                  </div>
                </section>
                {[1, 2, 3].map((_, index) => (
                  <section key={index} className="bg-card rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-48" />
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-4 w-full" />
                        ))}
                      </div>
                      {index === 0 && (
                        <div className="mt-6">
                          <Skeleton className="h-64 w-full rounded-md" />
                        </div>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4 mb-4">
                <SVGSkeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="bg-card rounded-lg shadow-md p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <ul className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <li key={i}>
                    <Skeleton className="h-8 w-full rounded" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-lg shadow-md p-6">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}