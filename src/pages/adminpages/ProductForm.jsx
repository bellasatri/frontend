
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProducts } from "../../utils/ProductContext";

export default function ProductForm() {
  const { addProduct, getCategories } = useProducts();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "",
    description: "",
    img: null,
  });

  const [errors, setErrors] = useState({});

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
      }
    });

    try {
      await addProduct(data);
      toast.success("Produk berhasil disimpan!");
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error("Periksa kembali data yang dimasukkan.");
      } else {
        toast.error("Gagal menyimpan produk.");
      }
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition
    focus:border-[#68152f] focus:ring-2 focus:ring-[#68152f]/10
    ${
      errors[field]
        ? "border-red-500"
        : "border-[#e5d5ce]"
    }`;

  const Error = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-600">
        {errors[field][0]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen bg-[#faf3ed] px-4 py-10 flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg sm:p-8"
      >

        {/* Judul */}
        <div className="mb-6 border-b border-[#eee5df] pb-4">
          <h2 className="text-2xl font-bold text-[#68152f]">
            Tambah Produk
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Lengkapi informasi berikut untuk menambahkan produk Giftly.
          </p>
        </div>

        {/* Nama Produk */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Nama Produk
          </label>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masukkan nama produk"
            className={inputClass("name")}
          />

          <Error field="name" />
        </div>

        {/* Kategori */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Pilih Kategori
          </label>

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className={inputClass("category_id")}
          >
            <option value="">-- Pilih Kategori --</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Error field="category_id" />
        </div>

        {/* Harga */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Harga
          </label>

          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Contoh: 75000"
            className={inputClass("price")}
          />

          <Error field="price" />
        </div>

        {/* Stok */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Stok
          </label>

          <input
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Contoh: 50"
            className={inputClass("stock")}
          />

          <Error field="stock" />
        </div>

        {/* Deskripsi */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Deskripsi
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tuliskan deskripsi produk..."
            rows="4"
            className={`${inputClass("description")} resize-none`}
          />

          <Error field="description" />
        </div>

        {/* Gambar */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Gambar Produk
          </label>

          <input
            name="img"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full rounded-lg border border-[#e5d5ce] bg-[#faf7f4] p-2 text-sm text-gray-600
            file:mr-3 file:rounded-md file:border-0 file:bg-[#f3e4e6]
            file:px-4 file:py-2 file:font-medium file:text-[#68152f]
            hover:file:bg-[#ead2d7]"
          />

          <Error field="img" />
        </div>

        {/* Tombol Simpan */}
        <button
          type="submit"
          className="w-full rounded-lg bg-[#68152f] py-3 font-semibold text-white
          shadow-md transition duration-200 hover:bg-[#4d1025]
          hover:shadow-lg active:scale-[0.98]"
        >
          Simpan Produk
        </button>

      </form>
    </div>
  );
}
