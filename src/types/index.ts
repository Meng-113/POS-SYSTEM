export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  sizes?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface Sale {
  id: string;
  receiptNumber: string;
  date: string;
  time: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "cash" | "credit" | "bank";
  bankName?: string;
  bankSlip?: string;
  currency: "USD" | "KHR";
  customerPaid?: number;
  change?: number;
  mixedPayment?: {
    usdPaid: number;
    khrPaid: number;
    totalPaidUSD: number;
  };
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}
