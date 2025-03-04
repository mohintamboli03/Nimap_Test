"use client";
import { useState, useEffect } from "react";
import { getProducts, updateProduct, deleteProduct } from "../actions";

// Define Product type to ensure TypeScript correctness
type Product = {
  id: number;
  name: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [editData, setEditData] = useState<{ id: number | null; name: string; category: string }>({
    id: null,
    name: "",
    category: "",
  });

  useEffect(() => {
    async function fetchProducts() {
      const { products, totalProducts } = await getProducts(page);
      setProducts(products);
      setTotalProducts(totalProducts);
    }
    fetchProducts();
  }, [page]);

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id)); // Instant UI update
  };

  const handleUpdate = async (id: number) => {
    if (!editData.id) return;
    await updateProduct(id, editData.name, editData.category);

    // 🔥 **Update state immediately after editing**
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, name: editData.name, category: { ...p.category, name: editData.category } } : p
      )
    );

    setEditData({ id: null, name: "", category: "" });
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Product List</h1>

      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Product ID</th>
            <th className="p-2">Product Name</th>
            <th className="p-2">Category Name</th>
            <th className="p-2">Category ID</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {products.map((p) => (
            <tr key={p.id} className="border">
              <td className="p-2">{p.id}</td>
              <td className="p-2">
                {editData.id === p.id ? (
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="border p-1 rounded"
                  />
                ) : (
                  p.name
                )}
              </td>
              <td className="p-2">
                {editData.id === p.id ? (
                  <input
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="border p-1 rounded"
                  />
                ) : (
                  p.category.name
                )}
              </td>
              <td className="p-2">{p.category.id}</td>
              <td className="p-2">
                {editData.id === p.id ? (
                  <button
                    onClick={() => handleUpdate(p.id)}
                    className="p-1 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditData({ id: p.id, name: p.name, category: p.category.name })}
                    className="p-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1 bg-red-500 text-white rounded ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="p-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => (prev * 10 < totalProducts ? prev + 1 : prev))}
          disabled={page * 10 >= totalProducts}
          className="p-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}

