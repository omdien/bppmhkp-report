type Props = {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number; 
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
};

const Pagination = ({ page, limit, totalRecords, onPageChange, onLimitChange }: Props) => {
  const totalPages = Math.ceil(totalRecords / limit);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const baseClass =
    "ml-2.5 flex items-center justify-center rounded-lg border px-3.5 py-2.5 " +
    "shadow-theme-xs text-sm h-10 disabled:opacity-50 " +
    "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 " +
    "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]";

  // 🚀 full override untuk active agar tidak ketimpa
  const activeClass =
    "ml-2.5 flex items-center justify-center rounded-lg border px-3.5 py-2.5 " +
    "shadow-theme-xs text-sm h-10 " +
    "bg-blue-600 text-white border-blue-600 font-semibold " +
    "hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-500 dark:text-white";

  return (
    <div className="flex items-center space-x-2">
      {/* Prev */}
      <button
        className={baseClass}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        {"<"}
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={idx}
            className={p === page ? activeClass : baseClass}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ) : (
          <span key={idx} className="px-2 text-gray-500 dark:text-gray-400">…</span>
        )
      )}

      {/* Next */}
      <button
        className={baseClass}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {">"}
      </button>

      {/* Limit selector */}
      <select
        className={`${baseClass} !ml-4`}
        value={limit}
        onChange={(e) => onLimitChange(parseInt(e.target.value))}
      >
        {[10, 20, 50, 100].map((l) => (
          <option key={l} value={l}>
            {l} / page
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
