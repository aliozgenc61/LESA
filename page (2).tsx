import { AlertTriangle, Banknote, Factory, FileSearch, ShieldCheck, Wrench } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";

const actions = [
  { level: "Kritik", item: "Yeni EKAP ihalesi", detail: "Teknik şartname ve ürün uygunluğu incelenecek", owner: "Satış / İş Planlama" },
  { level: "Yüksek", item: "Üretim termini", detail: "Termin yaklaşan sipariş için fabrika teyidi alınacak", owner: "Üretim" },
  { level: "Yüksek", item: "Geciken tahsilat", detail: "Vadesi geçen müşteriyle ödeme takibi yapılacak", owner: "Satış" },
  { level: "Orta", item: "Garanti uyarısı", detail: "90 gün içinde bitecek garanti için ek garanti teklifi", owner: "Servis" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-slate-950 text-white px-6 py-5 md:px-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div><div className="text-xs tracking-[0.25em] text-sky-300">LESA</div><h1 className="text-2xl font-bold">Operasyon Merkezi</h1></div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm">Muhammet Ali Özgenç</div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl p-6 md:p-10">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">Günaydın Ali</h2>
          <p className="mt-1 text-slate-500">Bugünün kritik işlerini ve yaklaşan riskleri tek ekranda görüyorsun.</p>
        </section>
        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard title="Yeni İhaleler" value="0" note="EKAP bağlantısı sonrası otomatik güncellenecek" icon={FileSearch} />
          <KpiCard title="Üretim Gecikmesi" value="0" note="Termin aşan siparişler" icon={Factory} tone="red" />
          <KpiCard title="Geciken Tahsilat" value="0" note="Vadesi geçmiş açık bakiye" icon={Banknote} tone="amber" />
          <KpiCard title="Garanti Uyarısı" value="0" note="90 gün içinde bitecek" icon={ShieldCheck} tone="green" />
          <KpiCard title="Açık Servis" value="0" note="Sonuç bekleyen kayıtlar" icon={Wrench} />
          <KpiCard title="Kritik Görev" value="0" note="Bugün aksiyon gereken" icon={AlertTriangle} tone="red" />
        </section>
        <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Bugünün Aksiyonları</h3>
            <div className="mt-5 space-y-3">
              {actions.map((a) => (
                <div key={a.item} className="grid gap-2 rounded-xl border border-slate-200 p-4 md:grid-cols-[90px_1fr_180px]">
                  <span className="text-sm font-bold text-red-700">{a.level}</span>
                  <div><div className="font-semibold text-slate-900">{a.item}</div><div className="text-sm text-slate-500">{a.detail}</div></div>
                  <div className="text-sm font-semibold text-slate-600">{a.owner}</div>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
            <h3 className="text-lg font-bold">LESA Süreç Akışı</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              {['İhale ve şartname','Teknik uygunluk','Yönetim fiyat onayı','Sipariş ve üretim','Sevkiyat ve fatura','Tahsilat','Garanti ve servis'].map((s, i) => <div key={s} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-slate-950">{i+1}</span><span className="pt-1">{s}</span></div>)}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
