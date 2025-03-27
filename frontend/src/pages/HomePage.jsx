import React, { useEffect } from "react";
import { useProductStore } from "../store/useProductStore.js";
import { PackageIcon, PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import ProductCard from "../components/ProductCard.jsx";
import AddProductModal from "../components/AddProductModal.jsx";

const HomePage = () => {
  const { products, loading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() =>
            document.getElementById("add_product_modal").showModal()
          }
          className="btn btn-primary"
        >
          <PlusCircleIcon className="size-5" />
          Add Product
        </button>
        <button onClick={fetchProducts} className="btn btn-ghost btn-circle">
          <RefreshCwIcon className="size-5" />
        </button>
      </div>

      <AddProductModal />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg" />
        </div>
      ) : products.length <= 0 ? (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <PackageIcon className="size-12" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">No Products Found</h3>
            <p className="text-gray-500">
              Get started by adding your first product to the inventory
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product Cards */}
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default HomePage;
