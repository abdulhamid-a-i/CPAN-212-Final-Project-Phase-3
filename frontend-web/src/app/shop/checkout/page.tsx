"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import type { Book } from "@/types/book";

import StoreShell from "@/components/layout/StoreShell";
import SectionHeader from "@/components/layout/SectionHeader";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import Alert from "@/components/feedback/Alert";

interface CartItem {
  book: Book;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCart() {
      try {
        const res = await apiRequest<{
          contents: CartItem[];
          totalPrice: number;
        }>("/checkout");

        setItems(res.data.contents);
        setTotal(res.data.totalPrice);
      } catch (err) {
        console.error(err);
        setError("Failed to load checkout data");
      }
    }

    void loadCart();
  }, []);

  const placeOrder = async () => {
    try {
      const res = await apiRequest("/checkout/purchase", {
        method: "PUT",
        body: {
          address,
          paymentMethod
        }
      });

      setMessage(res.message || "Order placed successfully!");
      setError("");
      setShowSuccess(true);

      // redirect after success
      setTimeout(() => {
        router.push("/shop");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <ProtectedRoute>
      <StoreShell>
        <SectionHeader title="Checkout" subtitle="Confirm your order" />

        {showSuccess && (
          <Alert variant="success" message={message} />
        )}

        {error && (
          <Alert variant="error"  message={error} />
        )}
        <div className="flex justify-end">
            <button className="btn bg-(--danger)! mb-5">
            Checkout
            </button>
        </div>
    
        <div className="checkout-container">
          {/* LEFT: Order items */}
          <div className="checkout-items">
            {items.map((item) => (
              <div key={item.book._id} className="cart-item mb-5">
                <img
                  src={item.book.coverImg}
                  alt={item.book.title}
                  className="cart-image"
                />

                <div className="cart-info">
                  <h3>{item.book.title}</h3>
                  <p>{item.book.author}</p>
                  <p>Qty: {item.quantity}</p>
                </div>

                <div className="cart-price">
                  ${(item.book.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <p>Total: ${total.toFixed(2)}</p>

            {/* Address */}
            <div style={{ marginTop: "10px" }}>
              <label>Shipping Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter delivery address"
                style={{ width: "100%", minHeight: "80px" }}
              />
            </div>

            {/* Payment */}
            <div style={{ marginTop: "10px" }}>
              <label>Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="card">Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            <button
              className="checkout-btn"
              onClick={placeOrder}
              disabled={items.length === 0}
              style={{ marginTop: "15px" }}
            >
              Place Order
            </button>
          </div>
        </div>
      </StoreShell>
    </ProtectedRoute>
  );
}