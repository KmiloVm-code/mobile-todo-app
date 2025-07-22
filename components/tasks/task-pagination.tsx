'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

interface TaskPaginationProps {
  currentPage: number
  totalPages: number
}

export function TaskPagination({
  currentPage,
  totalPages,
}: TaskPaginationProps) {
  const isMobile = useIsMobile()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  // Función para calcular las páginas a mostrar en la paginación
  function getPaginationPages({
    currentPage,
    totalPages,
    maxPages,
  }: {
    currentPage: number
    totalPages: number
    maxPages: number
  }) {
    let start = Math.max(1, currentPage - Math.floor(maxPages / 2))
    const end = Math.min(totalPages, start + maxPages - 1)
    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1)
    }
    const pages: number[] = []
    for (let i = start; i <= end; i++) pages.push(i)
    if (start > 1) pages.unshift(1)
    if (end < totalPages) pages.push(totalPages)
    return Array.from(new Set(pages))
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <>
      {totalPages > 0 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                className="flex items-center justify-center rounded-full text-sm font-medium hover:bg-purple-100 dark:hover:bg-slate-700 transition-colors duration-200"
              >
                <span>Anteriror</span>
              </PaginationPrevious>
            </PaginationItem>
            {getPaginationPages({
              currentPage,
              totalPages: totalPages,
              maxPages: isMobile ? 3 : 5,
            }).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={() => handlePageChange(page)}
                  aria-disabled={currentPage === page}
                  size="icon"
                  className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-100 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  <span>{page}</span>
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  handlePageChange(Math.min(totalPages || 1, currentPage + 1))
                }
                aria-disabled={currentPage === (totalPages || 1)}
                className="flex items-center justify-center rounded-full text-sm font-medium hover:bg-purple-100 dark:hover:bg-slate-700 transition-colors duration-200"
              >
                <span>Siguiente</span>
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}
