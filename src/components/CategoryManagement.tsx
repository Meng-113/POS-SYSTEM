import React, { useState } from "react";
import { Plus, Edit, Trash2, X, Save, Palette } from "lucide-react";
import { Category } from "../types";

interface CategoryManagementProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  onClose: () => void;
}

const colorOptions = [
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#EC4899",
  "#6B7280",
];

const iconOptions = [
  "👕",
  "👔",
  "🧥",
  "👖",
  "👗",
  "🧦",
  "👟",
  "🎽",
  "🧢",
  "👒",
  "🕶️",
  "👙",
  "🦮",
];

export default function CategoryManagement({
  categories,
  onUpdateCategories,
  onClose,
}: CategoryManagementProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    color: "#3B82F6",
    icon: "👕",
  });

  const handleOpenForm = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        color: category.color,
        icon: category.icon || "👕",
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        color: "#3B82F6",
        icon: "👕",
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map((cat) =>
        cat.id === editingCategory.id ? { ...cat, ...formData } : cat
      );
      onUpdateCategories(updatedCategories);
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
      };
      onUpdateCategories([...categories, newCategory]);
    }

    handleCloseForm();
  };

  const handleDelete = (categoryId: string) => {
    const categoryToDelete = categories.find((cat) => cat.id === categoryId);
    if (
      window.confirm(
        `Are you sure you want to delete "${categoryToDelete?.name}" category?`
      )
    ) {
      const updatedCategories = categories.filter(
        (cat) => cat.id !== categoryId
      );
      onUpdateCategories(updatedCategories);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Manage Categories
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenForm()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={18} />
              <span>Add Category</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showForm ? (
            <div className="space-y-4">
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No categories found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Add your first category to get started
                  </p>
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Color: {category.color}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenForm(category)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        formData.color === color
                          ? "border-gray-800 scale-110"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Icon
                </label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-12 h-12 rounded-lg border-2 text-xl transition-all ${
                        formData.icon === icon
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Or enter custom emoji"
                  maxLength={2}
                />
              </div>

              <div className="flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: formData.color }}
                >
                  {formData.icon}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Save size={16} />
                  <span>{editingCategory ? "Update" : "Add"} Category</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
