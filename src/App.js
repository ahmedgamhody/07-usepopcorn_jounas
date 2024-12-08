import Header from "./components/header/Header";
import MainLayout from "./layouts/MainLayout";
import NumResults from "./components/header/NumResults";
import MovieList from "./components/main/moviesBox/MovieList";
import Box from "./components/main/Box";
import WatchSummary from "./components/main/watchBox/WatchSummary";
import WatchedMovieList from "./components/main/watchBox/WatchedMovieList";
import Loader from "./components/loader/Loader";
import Error from "./components/errors/Error";
import Search from "./components/header/Search";
import MovieDetails from "./components/main/watchBox/MovieDetails";
import useMovies from "./hooks/useMovies";

function App() {
  const {
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
  } = useMovies();
  return (
    <div className="App">
      <Header>
        <Search>
          <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={ref}
          />
        </Search>
        <NumResults movies={movies} />
      </Header>
      <MainLayout>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handelSelectMovie} />
          )}
          {error && <Error message={error} />}
          {movies.length === 0 && !error && !isLoading && (
            <p className="no-results">Search for a movie.</p>
          )}
        </Box>

        <Box>
          {movieId ? (
            <MovieDetails
              movieId={movieId}
              handelCloseMovieDetails={handelCloseMovieDetails}
              onAddWatchedMovie={handleAddToWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </MainLayout>
    </div>
  );
}

export default App;
