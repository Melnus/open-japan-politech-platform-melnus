import { OrganizationList } from "./organization-list";

export default function OrganizationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <h2 className="mb-3 text-3xl font-bold text-white">政治団体一覧</h2>
      <p className="mb-8 text-[#8b949e]">
        全国の政党支部・資金管理団体の政治資金データを検索・閲覧
      </p>
      <OrganizationList />
    </div>
  );
}
