import { useEffect, useRef, useState } from "react";
import useKey from "./useKey";
const KEY = `52067cc6`;
export default function useMovies() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(() => {
    const storedWatched = localStorage.getItem("watched");
    return storedWatched ? JSON.parse(storedWatched) : [];
  });
  const [query, setQuery] = useState("black");
  const [movieId, setMovieId] = useState(null);
  const ref = useRef(null);
  function handelCloseMovieDetails() {
    setMovieId(null);
  }

  function handelSelectMovie(id) {
    setMovieId((selectedId) => (selectedId === id ? null : id));
  }

  function handleAddToWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // effect for storing watched movies
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          {
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          throw new Error("Something went wrong with fetching movies.");
        }

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error("Movie not found.");
        }

        setMovies(data.Search);
        setError("");
      } catch (error) {
        console.error(error);

        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    handelCloseMovieDetails();
    fetchMovies();
    return () => controller.abort();
  }, [query]);

  useEffect(() => {
    const storedWatched = JSON.parse(localStorage.getItem("watched"));
    if (storedWatched) setWatched(storedWatched);
  }, []);

  useKey("Enter", () => {
    if (document.activeElement === ref.current) return;
    ref.current.focus();
    setQuery("");
  });

  return {
    query,
    setQuery,
    movies,
    isLoading,
    error,
    movieId,
    handelCloseMovieDetails,
    handelSelectMovie,
    watched,
    handleAddToWatched,
    handleDeleteWatched,
    ref,
  };
}
