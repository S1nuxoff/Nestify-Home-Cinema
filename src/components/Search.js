import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as SearchIcon } from "../assets/icons/search.svg";
import "../styles/Header.css";

function Search({ onSearch, onMovieSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      fetch(
        `http://192.168.0.15:8000/api/v1/rezka/get_search?title=${encodeURIComponent(
          query
        )}`
      )
        .then((res) => res.json())
        .then((data) => setSuggestions(data.results || []))
        .catch((err) => {
          console.error("Search fetch error:", err);
          setSuggestions([]);
        });
    }, 500);

    return () => clearTimeout(debounceTimeoutRef.current);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  return (
    <div className="search-container">
      <form className="hdrezka-header-input-container" onSubmit={handleSubmit}>
        <SearchIcon className="search-icon" />
        <input
          ref={inputRef}
          type="search"
          className="hdrezka-header-search-input"
          placeholder="Search movies, tv shows..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </form>

      {isFocused && suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => onMovieSelect(item)}>
              <strong className="search-title">{item.title}</strong>
              <div className="search-description">{item.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search;
