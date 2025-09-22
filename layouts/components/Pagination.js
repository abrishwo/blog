import Link from "next/link";
import React from "react";
import { BsArrowRightShort, BsArrowLeftShort } from "react-icons/bs";

const Pagination = ({ section, currentPage, totalPages, onPageChange }) => {
  const hasPrevPage = currentPage > 1;
  const hasNextPage = totalPages > currentPage;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Maximum number of page buttons to show
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to max
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Logic for showing a limited number of pages with ellipses
      let startPage = currentPage - halfMaxPages;
      let endPage = currentPage + halfMaxPages;

      if (startPage < 1) {
        endPage += Math.abs(startPage) + 1;
        startPage = 1;
      }

      if (endPage > totalPages) {
        startPage -= endPage - totalPages;
        endPage = totalPages;
      }

      // Ensure startPage is never less than 1
      startPage = Math.max(startPage, 1);


      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const pageList = getPageNumbers();

  return (
    <>
      {totalPages > 1 && (
        <nav
          className="item-center mb-4 flex justify-center space-x-1 lg:space-x-2"
          aria-label="Pagination"
        >
          {/* previous */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="flex items-center rounded-full px-2 py-1 text-3xl font-bold leading-none text-dark disabled:text-gray-400 dark:text-darkmode-light dark:disabled:text-gray-600"
          >
            <BsArrowLeftShort />
            <span className="ml-3 text-lg">Previous</span>
          </button>

          {/* page index */}
          <div className="flex items-center space-x-1">
            {pageList.map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="inline-flex h-[38px] w-[38px] items-center justify-center px-4 py-1 font-secondary text-lg font-bold leading-none text-dark dark:text-darkmode-light"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => onPageChange(page)}
                  disabled={page === currentPage}
                  className={`inline-flex h-[38px] w-[38px] items-center justify-center rounded-full px-4 py-1 font-secondary text-lg font-bold leading-none text-dark transition-colors duration-150 ease-in-out hover:bg-gray-200 dark:text-darkmode-light dark:hover:bg-gray-700 ${
                    page === currentPage
                      ? "bg-primary text-white dark:bg-primary dark:text-white"
                      : ""
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          {/* next page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="ml-4 flex items-center rounded-full px-2 py-1 text-3xl font-bold leading-none text-dark disabled:text-gray-400 dark:text-darkmode-light dark:disabled:text-gray-600"
          >
            <span className="mr-3 text-lg">Next</span>
            <BsArrowRightShort />
          </button>
        </nav>
      )}
    </>
  );
};
export default Pagination;
