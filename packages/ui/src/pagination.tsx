interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseHref: string;
  className?: string;
  /** Use dark variant for dark-themed pages */
  theme?: "light" | "dark";
}

export function Pagination({
  currentPage,
  totalPages,
  baseHref,
  className = "",
  theme = "light",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const getHref = (page: number) => {
    const separator = baseHref.includes("?") ? "&" : "?";
    return `${baseHref}${separator}page=${page}`;
  };

  const isDark = theme === "dark";
  const navBtnClass = isDark
    ? "rounded-lg px-3 py-2 text-sm transition-colors text-[#8b949e] hover:bg-white/[0.06] hover:text-white"
    : "rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100";
  const ellipsisClass = isDark
    ? "px-2 py-2 text-sm text-[#6b7280]"
    : "px-2 py-2 text-sm text-gray-400";
  const activePageClass = isDark
    ? "bg-indigo-600 text-white font-medium"
    : "bg-blue-600 text-white font-medium";
  const inactivePageClass = isDark
    ? "text-[#8b949e] hover:bg-white/[0.06] hover:text-white"
    : "hover:bg-gray-100";

  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`}>
      {currentPage > 1 && (
        <a href={getHref(currentPage - 1)} className={navBtnClass}>
          前へ
        </a>
      )}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className={ellipsisClass}>
            ...
          </span>
        ) : (
          <a
            key={page}
            href={getHref(page)}
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              page === currentPage ? activePageClass : inactivePageClass
            }`}
          >
            {page}
          </a>
        ),
      )}
      {currentPage < totalPages && (
        <a href={getHref(currentPage + 1)} className={navBtnClass}>
          次へ
        </a>
      )}
    </nav>
  );
}
