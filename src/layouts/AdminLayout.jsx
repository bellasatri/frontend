import { NavLink, Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  const link = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
      isActive
        ? "bg-[#64132F] font-semibold text-white shadow-sm"
        : "text-[#704B54] hover:bg-[#F8E9E5] hover:text-[#64132F]"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF3ED]">

      {/* HEADER */}
      <header className="flex items-center justify-between border-b-4 border-[#64132F] bg-white px-5 py-4 md:px-8">

        <Link to="/admin/dashboard">
          <h1 className="font-serif text-3xl font-bold tracking-wide text-[#64132F]">
            Giftly<span className="text-[#B88A54]">.</span>
          </h1>
          <p className="text-xs text-[#A58C8C]">
            Kelola hampers dan koleksi Giftly
          </p>
        </Link>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-[#4A0D22]">
              Halo, Giftly Admin 👋
            </p>
            <p className="text-xs text-[#A58C8C]">Administrator</p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#64132F] font-bold text-white">
            G
          </div>
        </div>
      </header>

      {/* SIDEBAR DAN KONTEN */}
      <div className="flex flex-1 flex-col md:flex-row">

        {/* SIDEBAR */}
        <aside className="w-full border-b border-[#EBD9CF] bg-white p-4 md:w-60 md:shrink-0 md:border-b-0 md:border-r">

          <p className="mb-3 px-4 text-xs font-semibold text-[#B88A54]">
            Menu utama
          </p>

          <nav className="space-y-1">

            <NavLink to="/admin/dashboard" className={link}>
              <span>⌂</span>
              Dashboard
            </NavLink>

            <NavLink to="/admin/product" className={link}>
              <span>🎁</span>
              Manajemen Produk
            </NavLink>

            <NavLink to="/admin/add-product" className={link}>
              <span>＋</span>
              Tambah Produk
            </NavLink>

            <NavLink to="/admin/about" className={link}>
              <span>♡</span>
              About Giftly
            </NavLink>

          </nav>

          <div className="mt-8 rounded-xl bg-[#FAF3ED] p-4">
            <p className="font-semibold text-[#64132F]">Giftly Collection</p>
            <p className="mt-1 text-xs leading-relaxed text-[#876C70]">
              Hampers spesial untuk setiap momen berharga.
            </p>
          </div>

        </aside>

        {/* ISI HALAMAN */}
        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </main>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#EBD9CF] bg-white px-4 py-4 text-center text-xs text-[#876C70]">
        © 2026 Giftly. Made with love for every special moment.
      </footer>

    </div>
  );
}