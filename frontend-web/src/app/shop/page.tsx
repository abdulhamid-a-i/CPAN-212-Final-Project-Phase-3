"use client";

import React, { useEffect, useState } from "react";
import BookCard from "@/components/store/BookCard";
import type { Book } from "@/types/book";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import Alert from "@/components/feedback/Alert";

import StoreShell from "@/components/layout/StoreShell";
import SectionHeader from "@/components/layout/SectionHeader";
import ProtectedRoute from "@/components/guards/ProtectedRoute";


export default function StoreMainPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();
  const [showError, setError] = useState(false);
  const [showSuccess, setSuccess] = useState(false);
  const [Err, setText] = useState("");
  const [msg, setMsg] = useState("");

    useEffect(() => {
        async function load() {
        const response = await apiRequest<Book[]>("/books");
        setBooks(response.data.books);
        }

        void load();
    }, []);

  const addToCart = async (bookId : string, quantity : number) => {
    try {
      const res = await apiRequest<Book>("/cart/add", {
        method: "PUT",
        body: {
          bookId: bookId,
          quantity: quantity
        
        }
       
      })
       setMsg(res.message);
       setSuccess(true);
      console.log("Cart updated:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProtectedRoute>
        <StoreShell>
            <SectionHeader title="Shop" subtitle="Select items and add them to cart"/>
            {showSuccess && (<Alert variant="success" message={msg}></Alert>)}
                <div className="books-grid">
                    {books.map((book) => (
                        <BookCard
                        key={book._id}
                        book={book}
                        onAddToCart={addToCart}/>
                      
                    ))}
                </div>
        </StoreShell>
    </ProtectedRoute>
  );
};