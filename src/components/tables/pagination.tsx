import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxButtons?: number;
};

export default function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
  maxButtons = 5,
}: Props) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= maxButtons + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
       
      const left = Math.max(currentPage - Math.floor(maxButtons / 2), 2);
      const right = Math.min(currentPage + Math.floor(maxButtons / 2), totalPages - 1);
        console.log('pagination testing..',currentPage,totalPages, left, right, Math.floor(maxButtons / 2));
      pages.push(1);
      if (left > 2) pages.push("...");

      for (let i = left; i <= right; i++) pages.push(i);

      if (right < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Pagination className="w-full flex justify-center mt-4">
      <PaginationContent className="flex flex-wrap gap-1 justify-center">
        {/* Previous */}
        <PaginationItem>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center px-2 py-1 rounded-md border text-sm transition
              ${currentPage === 1
                ? "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 border-gray-300 bg-white hover:bg-gray-100"}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </PaginationItem>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <span className="px-2 py-1 text-gray-400 text-sm">...</span>
            ) : (
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                className={`cursor-pointer ${
                  page === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-2 py-1 rounded-md border text-sm transition
              ${currentPage === totalPages
                ? "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 border-gray-300 bg-white hover:bg-gray-100"}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
