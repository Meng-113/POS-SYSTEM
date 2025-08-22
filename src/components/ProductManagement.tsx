import React, { useState } from "react";
import { Plus, Edit, Trash2, X, Upload, Search, Settings } from "lucide-react";
import { Product, Category } from "../types";
import CategoryManagement from "./CategoryManagement";

interface ProductManagementProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
}

export default function ProductManagement({
  products,
  onUpdateProducts,
  categories,
  onUpdateCategories,
}: ProductManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: categories[0]?.name || "T-Shirts",
    price: 0,
    stock: 0,
    image: "",
    sizes: [] as string[],
  });

  const allCategories = ["All", ...categories.map((cat) => cat.name)];

  const filteredProducts = products.filter((product) => {
    // Filter by category
    const matchesCategory =
      filterCategory === "All" || product.category === filterCategory;

    // Filter by search term
    let matchesSearch = true;
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();

      // Check if search term is a price search (contains $ or is a number)
      if (search.includes("$") || /^\d+(\.\d{1,2})?$/.test(search)) {
        const priceSearch = search.replace("$", "");
        const searchPrice = parseFloat(priceSearch);
        if (!isNaN(searchPrice)) {
          matchesSearch = product.price === searchPrice;
        }
      } else {
        // Search by product name
        matchesSearch = product.name.toLowerCase().includes(search);
      }
    }

    return matchesCategory && matchesSearch;
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        image: product.image,
        sizes: product.sizes || [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: categories[0]?.name || "T-Shirts",
        price: 0,
        stock: 0,
        image: "",
        sizes: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...formData } : p
      );
      onUpdateProducts(updatedProducts);
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
      };
      onUpdateProducts([...products, newProduct]);
    }

    handleCloseModal();
  };

  const handleDelete = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter((p) => p.id !== productId);
      onUpdateProducts(updatedProducts);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    } else {
      setFormData({
        ...formData,
        sizes: formData.sizes.filter((s) => s !== size),
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Product Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your store inventory</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCategoryManagement(true)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Settings size={20} />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or price (e.g., 'White Shirt' or '299')"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400 text-sm mt-2">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Try selecting a different category"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border p-4"
            >
              <div className="relative mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
                  >
                    <Edit size={14} className="text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                {product.sizes && product.sizes.length > 0 && (
                  <p className="text-xs text-blue-600">
                    Sizes: {product.sizes.join(", ")}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes (optional)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["S", "M", "L", "Free Size", "36", "37", "38", "39"].map(
                  (size) => (
                    <label
                      key={size}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.sizes.includes(size)}
                        onChange={(e) =>
                          handleSizeChange(size, e.target.checked)
                        }
                        className="text-blue-500"
                      />
                      <span className="text-sm">{size}</span>
                    </label>
                  )
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Selected sizes:{" "}
                {formData.sizes.length > 0 ? formData.sizes.join(", ") : "None"}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="Enter image URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="text-center text-gray-500 text-sm">OR</div>
                  <div className="flex items-center justify-center">
                    <label className="flex items-center space-x-2 cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg">
                      <Upload size={16} />
                      <span className="text-sm">Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {editingProduct ? "Update" : "Add"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryManagement && (
        <CategoryManagement
          categories={categories}
          onUpdateCategories={onUpdateCategories}
          onClose={() => setShowCategoryManagement(false)}
        />
      )}
    </div>
  );
}
