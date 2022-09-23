import React, { useState, useEffect } from "react";
import MovieTile from "./components/MovieTile";
import Recommendations from "./components/Recommendations";

function App() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [scores, setScores] = useState({});
  const [likedMovies, setLikedMovies] = useState([]);

  useEffect(() => {
    fetch("search_movies/" + search)
      .then((res) => res.json())
      .then((data) => setSearchResults(data));
  }, [search]);

  const handleSearch = (e) => {
    var searchTerm = e.target.value;
    if (searchTerm.length > 3) {
      setSearch(searchTerm);
      console.log(searchTerm);
      console.log(searchTerm.length);
    } else {
      setSearch("");
    }
  };

  return (
    <div>
      <h1>Add a movie</h1>
      <label>Search for Movie</label>
      <input type="text" onChange={handleSearch}></input>

      <MovieTile
        searchResults={searchResults}
        scores={scores}
        setScores={setScores}
        likedMovies={likedMovies}
        setLikedMovies={setLikedMovies}
      />

      {likedMovies.map((x) => (
        <p>{x}</p>
      ))}

      <Recommendations
        scores={scores}
        setScores={setScores}
        likedMovies={likedMovies}
        setLikedMovies={setLikedMovies}
      />
    </div>
  );
}

export default App;
