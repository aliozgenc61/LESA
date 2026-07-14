import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <section className="w-full max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 md:p-14 shadow-2xl">
        <div className="text-sm tracking-[0.3em] text-sky-300">LESA61</div>
        <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight">CEM’in dijital operasyon ve karar merkezi.</h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          İhaleler, ürün uygunluğu, üretim terminleri, tahsilatlar, teminatlar, garanti ve servis kayıtları tek ekranda.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/dashboard" className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 hover:bg-sky-400">Dashboard’u Aç</Link>
          <Link href="/login" className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/10">Giriş Ekranı</Link>
        </div>
      </section>
    </main>
  );
}
