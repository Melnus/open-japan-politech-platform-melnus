"use client";

import { motion, useInView } from "motion/react";
import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  className = "",
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const tableRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(tableRef, { once: true, margin: "-40px" });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null || bVal == null) return 0;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const alignClass = (align?: string) =>
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <div
      ref={tableRef}
      className={`overflow-x-auto rounded-xl border bg-white shadow-card ${className}`}
    >
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50/80">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium text-gray-600 ${alignClass(col.align)} ${col.sortable ? "cursor-pointer select-none hover:text-gray-900" : ""}`}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-xs">{sortDir === "asc" ? "\u25B2" : "\u25BC"}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, i) => (
            <motion.tr
              key={i}
              className={`border-b last:border-0 transition-colors hover:bg-blue-50/50 ${onRowClick ? "cursor-pointer" : ""}`}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.5) }}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 ${alignClass(col.align)}`}>
                  {col.render ? col.render(item) : String(item[col.key] ?? "")}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
