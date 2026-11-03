import { useState } from "react";
import { useAsyncSearch } from "./useAsyncSearch";

export default function App() {
  const [keyword, setKeyword] = useState("");
  const { results, loading } = useAsyncSearch(keyword);
  const hasKeyword = keyword.trim() !== "";

  return (
    <>
      <input
        type="text"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
        placeholder="Please input keywork"
      />
      {loading && <p>Searching ...</p>}
      {!loading && hasKeyword && results.length === 0 && (
        <p>We don't have search result for keyword {keyword}</p>
      )}
      {!loading && hasKeyword && results.length > 0 && (
        <ul>
          {results.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </>
  );
}
