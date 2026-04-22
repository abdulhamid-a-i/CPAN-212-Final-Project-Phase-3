import React, { useState } from "react";
import { useRouter } from "next/navigation";


interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    description: string;
    genre: string;
    publishedDate: string;
    quantity: number;
    price: number;
    coverImg: string;
    isbn: string; },
  onAddToCart: any
}

export default function BookCard({ book, onAddToCart }: BookCardProps) {
  const router = useRouter();

  const [qty, setQty] = useState(1);

  const increase = () => {
    if (qty < book.quantity) {
      setQty(qty + 1);
    }
  };

  const decrease = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleAdd = () => {
    onAddToCart(book._id, qty);
  };


  return (
    <div className="stat-card">
      <div className="book-photo">
        {book.coverImg ? (<img src={book.coverImg} style={{cursor: "pointer"}} alt={book.title} className="book-image" onClick={() => {router.push(`/shop/${book._id}`)}}/>) : (<div
                    style={{
                      width: "200px",
                      height: "300px",
                      background: "#e5e7eb",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                      cursor: "pointer"
                    }}
                   onClick={() => {router.push(`/shop/${book._id}`)}}>
                    No Cover
                  </div>)}



        
      </div>
<div className="book-content">
        <h3>{book.title}</h3>
        <p className="author">by {book.author}</p>

        <p>{book.description?.slice(0, 100)}...</p>

        <div className="book-meta">
          <span>{book.genre}</span>
          <span>${book.price}</span>
        </div>

        {/* Quantity Selector */}
        <div className="quantity-control">
          <button onClick={decrease}>-</button>
          <span>{qty}</span>
          <button onClick={increase}>+</button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAdd}
          disabled={book.quantity === 0}
          className="add-btn"
        >
          {book.quantity === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}