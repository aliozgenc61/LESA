import { LucideIcon } from "lucide-react";

export function KpiCard({ title, value, note, icon: Icon, tone = "blue" }: { title: string; value: string; note: string; icon: LucideIcon; tone?: "blue" | "red" | "amber" | "green" }) {
  const tones = {
    blue: "bg-sky-50 text-sky-700 border-sky-100",
    red: "bg-red-50 text-red-700 border-red-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`inline-flex rounded-xl border p-2 ${tones[tone]}`}><Icon size={20} /></div>
      <div className="mt-4 text-sm font-semibold text-slate-500">{title}</div>
      <div className="mt-1 text-3xl font-bold text-slate-900">{value}</div>
      <div className="mt-2 text-xs text-slate-500">{note}</div>
    </div>
  );
}
