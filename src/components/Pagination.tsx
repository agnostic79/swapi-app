import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav className="pagination" aria-label="Table pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={isFirstPage} aria-label="Previous page">
        ‹ Prev
      </button>

      <span className="pagination-status">
        Page {currentPage} of {totalPages}
      </span>

      <button onClick={() => onPageChange(currentPage + 1)} disabled={isLastPage} aria-label="Next page">
        Next ›
      </button>
    </nav>
  );
}

export default Pagination;
