import { notFound } from "next/navigation";
import { calculators } from "@/lib/calculators";
import CalculatorClient from "@/components/calculators";

export function generateStaticParams() {
  return calculators.map(c => ({ slug: c.slug }));
}

export default async function CalculatorPage({ params }: { params: { slug: string } }) {
  const meta = calculators.find(c => c.slug === params.slug);
  if (!meta) notFound();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="text-4xl mb-2">{meta.emoji}</div>
        <h1 className="text-2xl font-bold">{meta.title}</h1>
        <p className="text-slate-600 mt-1">{meta.desc}</p>
      </div>
      <CalculatorClient slug={meta.slug} />
    </div>
  );
}
