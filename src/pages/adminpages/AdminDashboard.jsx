import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "../../utils/ProductContext";

const FILTERS = [
  { key: "semua", label: "Semua" },
  { key: "menipis", label: "Menipis" },
  { key: "habis", label: "Habis" },
];

export default function AdminDashboard() {
  const { getProducts } = useProducts();
  const [filter, setFilter] = useState("semua");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", "dashboard"],
    queryFn: () => getProducts({ page: 1, limit: 100 }),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white">
        <p className="text-[#64132F]">Memuat data dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600">
        Data dashboard gagal dimuat. Silakan muat ulang halaman.
      </div>
    );
  }

  const products = data?.data ?? [];

  const stok = (p) => Number(p.stock) || 0;
  const habis = products.filter((p) => stok(p) === 0);
  const menipis = products.filter((p) => stok(p) > 0 && stok(p) <= 5);
  const totalStok = products.reduce((sum, p) => sum + stok(p), 0);

  const tampil =
    filter === "habis" ? habis : filter === "menipis" ? menipis : products;

  const stats = [
    { label: "Total produk", value: products.length, color: "text-[#64132F]" },
    { label: "Total stok", value: totalStok, color: "text-[#64132F]" },
    { label: "Stok menipis", value: menipis.length, color: "text-[#B88A54]" },
    { label: "Stok habis", value: habis.length, color: "text-red-700" },
  ];

  const th = "border-b border-[#EBD9CF] px-3 py-3 text-left text-sm font-semibold text-[#64132F]";
  const td = "border-b border-[#F0E5E7] px-3 py-3";

  return (
    <div className="space-y-6">

      {/* BANNER */}
      <div className="flex flex-col gap-4 rounded-2xl bg-[#64132F] p-6 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold">
            Dashboard Giftly 🎁
          </h1>
          <p className="mt-1 text-sm text-[#F0DCB8]">
            Selamat datang! Kelola koleksi hampers dan pesanan Giftly di sini.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/product"
            className="rounded-lg bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/25"
          >
            Kelola Produk
          </Link>
          <Link
            to="/admin/add-product"
            className="rounded-lg bg-[#B88A54] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#A07640]"
          >
            + Tambah Produk
          </Link>
        </div>
      </div>

      {/* KARTU STATISTIK */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#F0DCE0] bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-[#987C83]">{s.label}</p>
            <p className={`mt-1 font-['Cormorant_Garamond'] text-4xl font-semibold ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* TABEL STOK */}
      <div className="rounded-2xl border border-[#F0DCE0] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#64132F]">
            Stok hampers
          </h2>

          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  filter === f.key
                    ? "bg-[#64132F] text-white"
                    : "bg-[#F3E9EB] text-[#64132F] hover:bg-[#EBD9CF]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm text-[#351923]">
            <thead>
              <tr>
                <th className={th}>Produk</th>
                <th className={th}>Kategori</th>
                <th className={th}>Harga</th>
                <th className={th}>Stok</th>
              </tr>
            </thead>

            <tbody>
              {tampil.length === 0 ? (
                <tr>
                  <td colSpan="4" className={`${td} py-10 text-center text-[#987C83]`}>
                    Tidak ada produk pada filter ini.
                  </td>
                </tr>
              ) : (
                tampil.map((p) => {
                  const n = stok(p);

                  return (
                    <tr key={p.id} className="transition hover:bg-[#FFF8F8]">
                      <td className={td}>
                        <div className="flex items-center gap-3">
                          <span className="h-3 w-3 shrink-0 rounded-sm bg-[#64132F]" />
                          {p.name}
                        </div>
                      </td>

                      <td className={td}>{p.category?.name || "Hampers"}</td>

                      <td className={`${td} whitespace-nowrap`}>
                        Rp {Number(p.price).toLocaleString("id-ID")}
                      </td>

                      <td className={td}>
                        {n === 0 ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            Habis
                          </span>
                        ) : n <= 5 ? (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                            Sisa {n}
                          </span>
                        ) : (
                          n
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}