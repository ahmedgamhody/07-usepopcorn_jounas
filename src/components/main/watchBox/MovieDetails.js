import { useEffect, useRef, useState } from "react";
import StarRating from "../../starsandRating/StarRating";
import Loader from "../../loader/Loader";
import useKey from "../../../hooks/useKey";
const KEY = `52067cc6`;

export default function MovieDetails({
  movieId,
  handelCloseMovieDetails,
  onAddWatchedMovie,
  watched,
}) {
  const [loading, setLoading] = useState(false);
  const [movieDetails, setMovieDetails] = useState({});
  const [userRating, setUserRating] = useState(null);
  const countRef = useRef(0);
  const isWatched = watched.map((movie) => movie.imdbID).includes(movieId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === movieId
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Director: director,
    Actors: actors,
    Plot: plot,
    Poster: poster,
    imdbRating: imdbRating,
  } = movieDetails;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: movieId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatchedMovie(newWatchedMovie);
    handelCloseMovieDetails();
  }

  useEffect(() => {
    if (userRating) {
      countRef.current += 1;
    }
  }, [userRating]);

  useEffect(() => {
    async function getMovieDetails() {
      setLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${movieId}`
      );
      const data = await res.json();
      setMovieDetails(data);
      setLoading(false);
    }
    getMovieDetails();
  }, [movieId]);

  // change page title
  useEffect(() => {
    if (title) {
      document.title = `Movie | ${title}`;
    }
    return () => {
      document.title = "usePopcorn"; // the original title
    };
  }, [title]);

  // close movie details on escape

  useKey("Escape", handelCloseMovieDetails);
  return (
    <div className="details">
      {loading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handelCloseMovieDetails}>
              &larr;
            </button>
            <img src={poster} alt={`${title} poster`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            {isWatched ? (
              <div className="rating">
                <p>
                  Already watched and rated this movie {watchedUserRating}{" "}
                  <span>⭐️</span>
                </p>
              </div>
            ) : (
              <div className="rating">
                <StarRating
                  maxRating={10}
                  size={24}
                  onSetRating={setUserRating}
                />
                {userRating && (
                  <button className="btn-add" onClick={handleAdd}>
                    + Add to list
                  </button>
                )}
              </div>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
