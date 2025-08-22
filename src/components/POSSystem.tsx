import React, { useState } from "react";
import {
  Plus,
  Minus,
  X,
  Trash2,
  CreditCard,
  DollarSign,
  Building,
  Search,
  RefreshCw,
} from "lucide-react";
import { Product, CartItem, Sale, Category } from "../types";
import { banks, USD_TO_KHR_RATE } from "../utils/mockData";

interface POSSystemProps {
  products: Product[];
  onAddSale: (sale: Sale) => void;
  onShowReceipt: (sale: Sale) => void;
  categories: Category[];
}

export default function POSSystem({
  products,
  onAddSale,
  onShowReceipt,
  categories,
}: POSSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<"USD" | "KHR">("USD");
  const [customerPaid, setCustomerPaid] = useState<number>(0);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [taxRate, setTaxRate] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "credit" | "bank"
  >("cash");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankSlip, setBankSlip] = useState<string>("");

  const allCategories = ["All", ...categories.map((cat) => cat.name)];

  const filteredProducts = products.filter((product) => {
    // Filter by category
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

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

  const handleProductClick = (product: Product) => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedProduct(product);
      setSelectedSize("");
      setShowSizeModal(true);
    } else {
      addToCart(product);
    }
  };

  const addToCart = (product: Product, size?: string) => {
    const existingItem = cart.find(
      (item) => item.id === product.id && item.selectedSize === size
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1, selectedSize: size }]);
    }
  };

  const handleSizeSelection = () => {
    if (selectedProduct && selectedSize) {
      addToCart(selectedProduct, selectedSize);
      setShowSizeModal(false);
      setSelectedProduct(null);
      setSelectedSize("");
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(
      cart
        .map((item, index) => {
          const itemKey = `${item.id}-${item.selectedSize || "no-size"}`;
          if (itemKey === id) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart(
      cart.filter((item) => {
        const itemKey = `${item.id}-${item.selectedSize || "no-size"}`;
        return itemKey !== id;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setPaymentMethod("cash");
    setSelectedBank("");
    setBankSlip("");
    setCustomerPaid(0);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  // Currency conversion functions
  const convertPrice = (price: number) => {
    return currency === "KHR" ? price * USD_TO_KHR_RATE : price;
  };

  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price);
    return currency === "KHR"
      ? `${convertedPrice.toLocaleString()}៛`
      : `$${convertedPrice.toFixed(2)}`;
  };

  const convertedTotal = convertPrice(total);
  const change =
    customerPaid > convertedTotal ? customerPaid - convertedTotal : 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBankSlip(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update customer paid when total changes or currency changes
  React.useEffect(() => {
    setCustomerPaid(convertedTotal);
  }, [convertedTotal]);

  const processPayment = () => {
    if (cart.length === 0) return;

    const sale: Sale = {
      id: Date.now().toString(),
      receiptNumber: `RCP${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      items: cart,
      subtotal,
      tax,
      total,
      currency,
      customerPaid,
      change,
      paymentMethod,
      bankName: paymentMethod === "bank" ? selectedBank : undefined,
      bankSlip: paymentMethod === "bank" ? bankSlip : undefined,
    };

    onAddSale(sale);
    onShowReceipt(sale);
    clearCart();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Point of Sale</h1>
          <button
            onClick={() => setCurrency(currency === "USD" ? "KHR" : "USD")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RefreshCw size={18} />
            <span>
              {currency === "USD" ? "Switch to KHR (៛)" : "Switch to USD ($)"}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
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
        <div className="flex flex-wrap gap-2 font-khmer font-bold text-lg">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Grid */}
        <div className="lg:col-span-2">
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
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-medium text-gray-800 text-sm mb-1 truncate font-khmer">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 font-khmer">
                    {product.category}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold text-gray-800 font-bold">
                Cart
              </h1>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 p-1"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-lg">
                  Cart is empty
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize || "no-size"}`}
                    className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-lg truncate">
                        {item.name}
                      </p>
                      {item.selectedSize && (
                        <p className="text-s text-blue-600">
                          Size: {item.selectedSize}
                        </p>
                      )}
                      <p className="text-s text-gray-600">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() =>
                          updateQuantity(
                            `${item.id}-${item.selectedSize || "no-size"}`,
                            -1
                          )
                        }
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-9 text-center text-s">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            `${item.id}-${item.selectedSize || "no-size"}`,
                            1
                          )
                        }
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        removeFromCart(
                          `${item.id}-${item.selectedSize || "no-size"}`
                        )
                      }
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Totals */}
          {cart.length > 0 && (
            <>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-lg">Subtotal:</span>
                    <span className="font-medium text-lg">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-lg">Tax:</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="w-48 px-4 py-2 text-lg border rounded"
                        min="0"
                        max="50"
                      />
                      <span className="text-s text-gray-500">%</span>
                      <span className="font-medium text-lg">
                        {formatPrice(tax)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-lg">
                        Customer Paid:
                      </span>
                      <input
                        type="number"
                        value={customerPaid}
                        onChange={(e) =>
                          setCustomerPaid(Number(e.target.value))
                        }
                        className="w-48 px-4 py-2 text-lg border rounded text-right"
                        min="0"
                        step={currency === "KHR" ? "100" : "0.01"}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-lg">Change:</span>
                      <span
                        className={`font-medium text-lg ${
                          change > 0
                            ? "text-green-600"
                            : customerPaid < convertedTotal
                            ? "text-red-600"
                            : "text-gray-800"
                        }`}
                      >
                        {currency === "KHR"
                          ? `${change.toLocaleString()}៛`
                          : `$${change.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h1 className="font-semibold text-gray-800 mb-4 text-lg font-bold">
                  Payment Method
                </h1>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="text-blue-500"
                    />
                    <DollarSign size={20} className="text-green-500" />
                    <span className="text-lg">Cash</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="credit"
                      checked={paymentMethod === "credit"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="text-blue-500"
                    />
                    <CreditCard size={20} className="text-blue-500" />
                    <span className="text-lg">Credit Card</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="text-blue-500"
                    />
                    <Building size={20} className="text-purple-500" />
                    <span className="text-lg">Bank Transfer</span>
                  </label>
                </div>

                {paymentMethod === "bank" && (
                  <div className="mt-4 space-y-3">
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-lg"
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Payment Button */}
              <button
                onClick={processPayment}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
              >
                Confirm & Print Receipt
              </button>
            </>
          )}
        </div>
      </div>

      {/* Size Selection Modal */}
      {showSizeModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Size</h3>
              <button
                onClick={() => setShowSizeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <h4 className="font-medium text-gray-800">
                {selectedProduct.name}
              </h4>
              <p className="text-blue-600 font-semibold">
                {formatPrice(selectedProduct.price)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {selectedProduct.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    selectedSize === size
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSizeModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSizeSelection}
                disabled={!selectedSize}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
