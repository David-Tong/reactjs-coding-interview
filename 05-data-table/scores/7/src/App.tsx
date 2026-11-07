import { useMemo, useState } from "react";
import { USERS } from "./types";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const totalPage = Math.ceil(USERS.length / pageSize);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return USERS.slice(startIndex, endIndex);
  }, [currentPage, pageSize]);

  return (
    <>
      <ul>
        {currentData.map((user, idx) => (
          <li key={idx}>
            Name : {user.name}, Email : {user.email}, Age : {user.age}
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => {
          setCurrentPage(currentPage - 1);
        }}
      >
        Previous
      </button>
      <span>Page {currentPage}</span>
      <button
        type="button"
        disabled={currentPage === totalPage}
        onClick={() => {
          setCurrentPage(currentPage + 1);
        }}
      >
        Next
      </button>
    </>
  );
}
