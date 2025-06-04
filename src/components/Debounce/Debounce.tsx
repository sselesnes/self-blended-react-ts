import css from "./Debounce.module.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";

interface Post {
  id: number;
  title: string;
  body: string;
}

interface FetchPostsResponse {
  posts: Post[];
}

// Отримання постів
const fetchPosts = async (searchText: string): Promise<Post[]> => {
  if (!searchText.trim()) return [];
  const res = await axios.get<FetchPostsResponse>("https://dummyjson.com/posts/search", {
    params: { q: searchText, limit: 5 },
  });
  return res.data.posts;
};

// HTML-рядкок з підсвічуванням
const highlightText = (text: string, query: string): string => {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text
    .split(regex)
    .map(part => (regex.test(part) ? `<span class="${css.highlight}">${part}</span>` : part))
    .join("");
};

export default function Debounce() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // Затримка, мс

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", debouncedSearchQuery],
    queryFn: () => fetchPosts(debouncedSearchQuery),
    placeholderData: previousData => previousData,
    enabled: !!debouncedSearchQuery.trim(),
  });

  return (
    <div className={css.container}>
      <input
        className={css.input}
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Пошук постів..."
        autoFocus
      />
      {isLoading && <p>Завантаження...</p>}
      {error && <p>Помилка: {error.message}</p>}
      {posts && posts.length > 0 ? (
        <ul className={css.list}>
          {posts.map(post => (
            <li key={post.id} className={css.item}>
              <h3
                dangerouslySetInnerHTML={{
                  __html: highlightText(post.title, debouncedSearchQuery),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: highlightText(post.body, debouncedSearchQuery),
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>Немає результатів пошуку</p>
      )}
    </div>
  );
}
