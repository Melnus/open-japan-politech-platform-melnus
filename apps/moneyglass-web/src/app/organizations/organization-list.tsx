"use client";

import { motion, StaggerGrid, StaggerItem } from "@ojpp/ui";
import { useCallback, useEffect, useState } from "react";
import { FilterBar } from "@/components/filter-bar";
import { SearchInput } from "@/components/search-input";

interface Organization {
  id: string;
  name: string;
  type: string;
  address: string | null;
  party: { id: string; name: string; shortName: string | null; color: string | null } | null;
}

interface PaginatedResult {
  data: Organization[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface Party {
  id: string;
  name: string;
  shortName: string | null;
}

const ORG_TYPE_LABELS: Record<string, string> = {
  PARTY_BRANCH: "政党支部",
  FUND_MANAGEMENT: "資金管理団体",
  SUPPORT_GROUP: "後援会",
  POLITICAL_COMMITTEE: "政治資金委員会",
  OTHER: "その他",
};

export function OrganizationList() {
  const [data, setData] = useState<PaginatedResult | null>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [partyFilter, setPartyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/parties")
      .then((res) => res.json())
      .then((data) => setParties(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "20");
    if (partyFilter) params.set("party", partyFilter);
    if (typeFilter) params.set("type", typeFilter);
    fetch(`/api/organizations?${params}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, [page, partyFilter, typeFilter]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setPage(1);
    if (key === "party") setPartyFilter(value);
    if (key === "type") setTypeFilter(value);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  const filteredData = data?.data.filter((org) => !search || org.name.includes(search));

  return (
    <div>
      <div className="mb-8 space-y-4">
        <SearchInput placeholder="団体名で検索..." onSearch={handleSearch} defaultValue={search} />
        <FilterBar
          filters={[
            {
              label: "政党",
              key: "party",
              value: partyFilter,
              options: parties.map((p) => ({ label: p.name, value: p.id })),
            },
            {
              label: "団体種別",
              key: "type",
              value: typeFilter,
              options: [
                { label: "政党支部", value: "PARTY_BRANCH" },
                { label: "資金管理団体", value: "FUND_MANAGEMENT" },
              ],
            },
          ]}
          onChange={handleFilterChange}
        />
      </div>

      {!filteredData ? (
        <div className="glass-card rounded-xl p-12">
          <p className="text-center text-[#8b949e]">読み込み中...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="glass-card rounded-xl p-12">
          <p className="text-center text-[#8b949e]">該当する団体がありません</p>
        </div>
      ) : (
        <>
          <StaggerGrid className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((org) => {
              const partyColor = org.party?.color ?? "#6B7280";
              return (
                <StaggerItem key={org.id}>
                  <a href={`/organizations/${org.id}`} className="block">
                    <motion.div
                      className="group relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm transition-all duration-300"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: `0 0 20px rgba(255, 107, 53, 0.1)`,
                        transition: { duration: 0.2 },
                      }}
                    >
                      {/* Shimmer overlay on hover */}
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold text-[#f0f0f0]">{org.name}</h3>
                            <p className="mt-1 text-sm text-[#8b949e]">
                              {ORG_TYPE_LABELS[org.type] ?? org.type}
                            </p>
                          </div>
                          {org.party && (
                            <span
                              className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                              style={{
                                backgroundColor: partyColor,
                                boxShadow: `0 0 8px ${partyColor}40`,
                              }}
                            >
                              {org.party.shortName ?? org.party.name}
                            </span>
                          )}
                        </div>
                        {org.address && (
                          <p className="mt-2 text-xs text-[#6e7681]">{org.address}</p>
                        )}
                      </div>
                    </motion.div>
                  </a>
                </StaggerItem>
              );
            })}
          </StaggerGrid>

          {data && data.pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm font-medium text-[#c9d1d9] transition-all hover:border-[rgba(255,107,53,0.3)] hover:bg-[rgba(255,107,53,0.08)] disabled:opacity-30"
              >
                前へ
              </button>
              <span className="text-sm text-[#8b949e]">
                {page} / {data.pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm font-medium text-[#c9d1d9] transition-all hover:border-[rgba(255,107,53,0.3)] hover:bg-[rgba(255,107,53,0.08)] disabled:opacity-30"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
