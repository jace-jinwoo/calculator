"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { calculators } from "@/lib/calculators";

const categories = ["노무·급여", "날짜·생활", "금융·환율", "단위·건강"] as const;

export default function Home() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => calculators.filter(c => (c.title + c.desc).toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">필요한 계산, 바로 시작하세요</h1>
        <p className="text-slate-600 mb-5">DB나 API 없이 브라우저에서 즉시 계산되는 생활 계산기 모음입니다.</p>
        <input
          className="input max-w-md"
          placeholder="계산기 검색 (예: 퇴직금, 전역일, 평)"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </section>

      {categories.map(cat => {
        const items = filtered.filter(c => c.category === cat);
        if (!items.length) return null;
        return (
          <section key={cat} className="mb-10">
            <h2 className="text-xl font-bold mb-4">{cat}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(c => (
                <Link key={c.slug} href={`/calculators/${c.slug}/`} className="card hover:shadow-md hover:-translate-y-0.5 transition">
                  <div className="text-3xl mb-2">{c.emoji}</div>
                  <div className="font-semibold mb-1">{c.title}</div>
                  <div className="text-sm text-slate-600">{c.desc}</div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && <p className="text-slate-500">검색 결과가 없습니다.</p>}
    </div>
  );
}
