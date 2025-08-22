import React, { useState } from "react";
import { Product, Sale, User, Category } from "./types";
import { mockProducts, mockSales, mockCategories } from "./utils/mockData";
import { useLocalStorage } from "./hooks/useLocalStorage";

// Components
import Login from "./components/Login";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import POSSystem from "./components/POSSystem";
import ProductManagement from "./components/ProductManagement";
import SalesHistory from "./components/SalesHistory";
import ReceiptPreview from "./components/ReceiptPreview";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [products, setProducts] = useLocalStorage<Product[]>(
    "pos-products",
    mockProducts
  );
  const [sales, setSales] = useLocalStorage<Sale[]>("pos-sales", mockSales);
  const [categories, setCategories] = useLocalStorage<Category[]>(
    "pos-categories",
    mockCategories
  );
  const [selectedReceipt, setSelectedReceipt] = useState<Sale | null>(null);

  const currentUser: User = {
    id: "1",
    username: "admin",
    name: "Store Manager",
    avatar: "",
  };

  const handleLogin = (username: string, password: string) => {
    // Simple authentication - in real app, this would be handled by backend
    if (username === "admin" && password === "password") {
      setIsLoggedIn(true);
      setActiveSection("dashboard");
    } else {
      alert("Invalid credentials. Use: admin / password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection("dashboard");
  };

  const handleAddSale = (sale: Sale) => {
    setSales([...sales, sale]);
  };

  const handleShowReceipt = (sale: Sale) => {
    setSelectedReceipt(sale);
  };

  const handleCloseReceipt = () => {
    setSelectedReceipt(null);
  };

  const handleClearHistory = () => {
    setSales([]);
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard sales={sales} onNavigate={setActiveSection} />;
      case "pos":
        return (
          <POSSystem
            products={products}
            onAddSale={handleAddSale}
            onShowReceipt={handleShowReceipt}
            categories={categories}
          />
        );
      case "products":
        return (
          <ProductManagement
            products={products}
            onUpdateProducts={setProducts}
            categories={categories}
            onUpdateCategories={setCategories}
          />
        );
      case "history":
        return (
          <SalesHistory
            sales={sales}
            onClearHistory={handleClearHistory}
            onShowReceipt={handleShowReceipt}
          />
        );
      case "settings":
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Settings</h1>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard sales={sales} onNavigate={setActiveSection} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={currentUser} onLogout={handleLogout} />

      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="flex-1">{renderMainContent()}</main>
      </div>

      <ReceiptPreview sale={selectedReceipt} onClose={handleCloseReceipt} />
    </div>
  );
}

export default App;
