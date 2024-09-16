import React from "react";
import { Book } from "./Book";
import { useRouter } from "next/navigation";

interface IProp {
  book?: Book;
}

const BookCard = ({ book }: IProp) => {
  const router = useRouter();
  if (book == undefined) {
    return null;
  }

  const onClick = () => {
    router.push(`/show-book/${book._id}`);
  };
  return (
    <div className="card-container" onClick={onClick}>
      <img
        src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
        alt="Books"
        height={200}
      />
      <div className="desc">
        <h2>{book.title}</h2>
        <h3>{book.author}</h3>
        <p>{book.description}</p>
      </div>
    </div>
  );
};
export default BookCard;
