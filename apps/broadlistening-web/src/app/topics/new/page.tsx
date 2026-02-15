"use client";

import { FadeIn } from "@ojpp/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTopicPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          quorumThreshold: 0.6,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/topics/${data.id}`);
      } else {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setError(err.error || "作成に失敗しました");
      }
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-6">
        <FadeIn>
          <Link
            href="/topics"
            className="text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            ← Topics
          </Link>

          <h1
            className="mt-6 text-3xl font-black tracking-tight text-white"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            New Topic
          </h1>
          <p className="mt-2 text-white/30 text-sm">
            新しい議論テーマを作成して、意見の生態系を起動する
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label
                htmlFor="topic-title"
                className="block text-xs font-bold text-white/30 uppercase tracking-widest mb-2"
              >
                Title
              </label>
              <input
                id="topic-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例: AI規制のあり方"
                className="input-abyss"
                required
              />
            </div>

            <div>
              <label
                htmlFor="topic-desc"
                className="block text-xs font-bold text-white/30 uppercase tracking-widest mb-2"
              >
                Description
              </label>
              <textarea
                id="topic-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="議論の背景や論点を記述してください..."
                className="input-abyss"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-400">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting || !title.trim()}
                className="btn-glow flex-1 justify-center"
              >
                {submitting ? "作成中..." : "トピックを作成"}
              </button>
              <Link href="/topics" className="btn-glass">
                キャンセル
              </Link>
            </div>
          </form>
        </FadeIn>
      </div>
    </div>
  );
}
