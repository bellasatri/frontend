import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useProducts } from "../../utils/ProductContext";

const LIMIT = 5;

// Nama file harus persis sama dengan yang ada di folder public
// (termasuk huruf besar/kecil dan spasi)
const GAMBAR_PRODUK = [
  { cari: "berkah ramadan", file: "/berkah ramadan.jpg" },
  { cari: "welcome little one", file: "/welcome little one.jpg" },
  { cari: "happily ever after", file: "/Happy ever after.jpg" },
  { cari: "cum laude", file: "/cumlaude.jpg" },
  { cari: "cumlaude", file: "/cumlaude.jpg" },
  { cari: "our story box", file: "/our story box.jpg" },
  { cari: "golden years", file: "/golden years.jpg" },
  { cari: "birthday bliss", file: "/birthday bliss.jpg" },
  { cari: "sweet candle", file: "/sweet candles box.jpg" },
];

// Mengembalikan daftar gambar yang akan dicoba berurutan
function getImageCandidates(p) {
  const list = [];

  const raw = p.img_url || p.image || p.image_url || p.img || p.gambar;
  if (raw && typeof raw === "string") {
    if (/^(https?:)?\/\//.test(raw) || raw.startsWith("/") || raw.startsWith("data:")) {
      list.push(raw);
    } else {
      list.push(`/${raw}`);
    }
  }

  const nama = (p.name || "").toLowerCase();
  const cocok = GAMBAR_PRODUK.find((g) => nama.includes(g.cari));
  if (cocok) list.push(cocok.file);

  // encodeURI supaya spasi di nama file menjadi %20
  return list.map((src) => (src.startsWith("data:") ? src : encodeURI(src)));
}

// Coba gambar satu per satu, kalau semua gagal tampilkan ikon hadiah
function Thumb({ sources, alt }) {
  const [index, setIndex] = useState(0);

  if (index >= sources.length) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#F8EEF0] text-2xl">
        🎁
      </div>
    );
  }

  return (
    <img
      src={sources[index]}
      alt={alt}
      onError={() => setIndex((i) => i + 1)}
      className="h-16 w-16 rounded-lg border border-[#F0DCE0] object-cover"
    />
  );
}

export default function Product() {
  const { getProducts, getCategories, deleteProduct } = useProducts();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [filter, setFilter] = useState({ category_id: "", keyword: "" });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", "list", page, filter],
    queryFn: () => getProducts({ page, limit: LIMIT, ...filter }),
    placeholderData: (prev) => prev,
  });

  const items = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setFilter({ category_id: categoryId, keyword: keywordInput });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      await deleteProduct.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil dihapus!");
      if (items.length === 1 && page > 1) setPage(page - 1);
    } catch {
      toast.error("Gagal menghapus produk.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white">
        <p className="text-[#64132F]">Memuat data produk...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600">
        Produk gagal dimuat. Silakan muat ulang halaman.
      </div>
    );
  }

  const th = "border border-[#EBD9CF] px-4 py-3";
  const td = "border border-[#F0E5E7] px-4 py-3";

  return (
    <div className="rounded-2xl border border-[#F0DCE0] bg-white p-5 shadow-sm sm:p-6">
      <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#64132F]">
        Manajemen Produk
      </h1>
      <p className="mt-1 text-sm text-[#987C83]">
        Kelola koleksi produk hampers Giftly.
      </p>

      {/* TOOLBAR */}
      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-lg border border-[#EBD9CF] bg-white px-3 py-2.5 text-sm text-[#351923] outline-none focus:border-[#64132F]"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="Cari produk..."
            className="w-full rounded-lg border border-[#EBD9CF] px-3 py-2.5 text-sm outline-none focus:border-[#64132F] sm:w-56"
          />

          <button
            type="submit"
            className="rounded-lg bg-[#64132F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4A0D22]"
          >
            Cari
          </button>
        </form>

        <Link
          to="/admin/add-product"
          className="inline-flex items-center justify-center rounded-lg bg-[#B88A54] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#A07640]"
        >
          + Tambah Produk
        </Link>
      </div>

      {/* TABEL */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="bg-[#F5E6E9] text-sm font-semibold text-[#64132F]">
              <th className={`${th} w-14`}>#</th>
              <th className={`${th} w-28`}>Image</th>
              <th className={th}>Nama Produk</th>
              <th className={th}>Harga</th>
              <th className={th}>Stok</th>
              <th className={th}>Aksi</th>
            </tr>
          </thead>

          <tbody className="text-sm text-[#351923]">
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className={`${td} py-12 text-center text-[#987C83]`}>
                  Belum ada produk yang ditemukan.
                </td>
              </tr>
            ) : (
              items.map((p, index) => {
                const stockNum = Number(p.stock);

                return (
                  <tr key={p.id} className="transition hover:bg-[#FFF8F8]">
                    <td className={td}>{(page - 1) * LIMIT + index + 1}</td>

                    <td className={`${td} py-2`}>
                      {/* key supaya state Thumb ter-reset saat data berganti */}
                      <Thumb
                        key={`${p.id}-${p.name}`}
                        sources={getImageCandidates(p)}
                        alt={p.name}
                      />
                    </td>

                    <td className={td}>
                      <div className="font-medium">{p.name}</div>
                      <div className="mt-1 text-xs text-[#A58C8C]">
                        #{p.category?.name || "Hampers"}
                      </div>
                    </td>

                    <td className={`${td} whitespace-nowrap`}>
                      Rp {Number(p.price).toLocaleString("id-ID")}
                    </td>

                    <td className={td}>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          stockNum === 0
                            ? "bg-red-100 text-red-700"
                            : stockNum <= 5
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {stockNum === 0 ? "Habis" : p.stock}
                      </span>
                    </td>

                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/edit-product/${p.id}`}
                          className="text-sm font-medium text-[#64132F] hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleteProduct.isPending}
                          className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-5 flex flex-col items-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg bg-[#F3E9EB] px-4 py-2 text-sm text-[#64132F] hover:bg-[#EBD9CF] disabled:opacity-40"
          >
            Sebelumnya
          </button>

          {Array.from({ length: lastPage }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                page === n
                  ? "bg-[#64132F] text-white"
                  : "bg-[#F3E9EB] text-[#64132F] hover:bg-[#EBD9CF]"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            disabled={page === lastPage}
            className="rounded-lg bg-[#64132F] px-4 py-2 text-sm font-medium text-white hover:bg-[#4A0D22] disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
        <span className="text-xs text-[#987C83]">
          Halaman {page} dari {lastPage}
        </span>
      </div>
    </div>
  );
}