"use client";
import { useState, useEffect } from "react";
import { getProducts, updateProduct, deleteProduct } from "../actions";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [editData, setEditData] = useState({ id: null, name: "", category: "" });

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
    setProducts(products.filter((p) => p.id !== id)); // Instant UI update
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Product List</h1>

      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-black-200">
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Category Name</th>
            <th>Category ID</th>
            <th>Actions</th>
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
                    onClick={async () => {
                      await updateProduct(p.id, editData.name, editData.category);
                      setEditData({ id: null, name: "", category: "" });
                    }}
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
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button onClick={() => setPage(page + 1)} disabled={page * 10 >= totalProducts}>
          Next
        </button>
      </div>
    </main>
  );
}
