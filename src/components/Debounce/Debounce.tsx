import css from "./Debounce.module.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Parser } from "html-to-react"; // sanitarize

interface Post {
  id: number;
  title: string;
  body: string;
}

const parser = new Parser();

const fetchPosts = async (searchText: string) => {
  if (!searchText.trim()) return [];
  const response = await axios.get("https://dummyjson.com/posts/search", {
    params: { q: searchText, limit: 5 },
  });
  return response.data.posts as Post[];
};

// Підсвічування тексту
const highlightText = (text: string, query: string) => {
  const cleanQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!cleanQuery.trim()) return parser.parse(text);
  const regex = new RegExp(`(${cleanQuery})`, "gi");
  const highlightedHtml = text.replace(regex, `<span class="${css.highlight}">$1</span>`);
  return parser.parse(highlightedHtml);
};

export default function Debounce() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500); // Затримка, мс

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", debouncedQuery],
    queryFn: () => fetchPosts(debouncedQuery),
    enabled: !!debouncedQuery.trim(),
  });

  return (
    <div className={css.container}>
      <input
        className={css.input}
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Пошук постів..."
      />
      {isLoading && <p>Завантаження...</p>}
      {error && <p>Помилка: {error.message}</p>}
      {posts && posts.length > 0 ? (
        <ul className={css.list}>
          {posts.map(post => (
            <li key={post.id} className={css.item}>
              <h3>{highlightText(post.title, debouncedQuery)}</h3>
              <p>{highlightText(post.body, debouncedQuery)}</p>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>Немає результатів</p>
      )}
    </div>
  );
}
