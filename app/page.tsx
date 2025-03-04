"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProduct } from "./actions";

export default function Home() {
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const router = useRouter();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Add Product</h1>

      <div className="mt-4">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter Category Name"
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Enter Product Name"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={async () => {
            await addProduct(product, category);
            setProduct("");
            setCategory("");
            router.push("/products");
          }}
          className="p-2 bg-green-500 text-white rounded"
        >
          Add Product
        </button>
      </div>
    </main>
  );
}
