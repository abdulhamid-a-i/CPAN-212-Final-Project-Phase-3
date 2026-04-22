"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { Book } from "@/types/book";
import { useRouter } from "next/navigation";

import StoreShell from "@/components/layout/StoreShell";
import SectionHeader from "@/components/layout/SectionHeader";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import Alert from "@/components/feedback/Alert";

interface CartItem {
  book: Book;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadCart() {
      try {
        const res = await apiRequest<{
          contents: CartItem[];
          total: number;
        }>("/cart");

        setItems(res.data.contents);
        setTotal(res.data.totalPrice);
      } catch (err) {
        console.error(err);
      }
    }

    void loadCart();
  }, []);

  // Update quantity
  const updateQuantity = async (bookId: string, quantity: number) => {
    try {
      const res = await apiRequest("/cart/quantity", {
        method: "PATCH",
        body: { bookId, quantity }
      });

      setMessage(res.message);
      setShowSuccess(true);

      // refresh cart
      const updated = await apiRequest<{
        items: CartItem[];
        totalPrice: number;
      }>("/cart");

      setItems(updated.data.contents);
      setTotal(updated.data.totalPrice);
    } catch (err) {
      console.error(err);
    }
  };

  // Remove item
  const removeItem = async (bookId: string) => {
    try {
      const res = await apiRequest("/cart/remove", {
        method: "PUT",
        body: { bookId }
      });

      setMessage(res.message);
      setShowSuccess(true);

      setItems(res.data.contents);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProtectedRoute>
      <StoreShell>
        <SectionHeader title="Your Cart" subtitle="Review your items" />

        {showSuccess && <Alert variant="success" message={message} />}

        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.book._id} className="cart-item">
                  <img
                    src={item.book.coverImg}
                    alt={item.book.title}
                    className="cart-image"
                  />

                  <div className="cart-info">
                    <h3>{item.book.title}</h3>
                    <p>{item.book.author}</p>
                    <p>${item.book.price}</p>

                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.book._id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.book._id,
                            Math.min(
                              item.book.quantity,
                              item.quantity + 1
                            )
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.book._id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="cart-price">
                    ${(item.book.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <p>Total: ${total.toFixed(2)}</p>

              <button className="checkout-btn" onClick={() => router.push("/shop/checkout")}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </StoreShell>
    </ProtectedRoute>
  );
}