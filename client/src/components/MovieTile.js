import React, { useState, useEffect } from "react";

const MovieTile = (props) => {
  function sumObjectsByKey(...objs) {
    return objs.reduce((a, b) => {
      for (let k in b) {
        if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
      }
      return a;
    }, {});
  }

  const createReco = (movie_id) => {
    if (-1 === -1) {
      console.log("clicked", movie_id, props.likedMovies);
      fetch("similar_by_id/" + movie_id)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          const currentScores = props.scores;
          const newScores = sumObjectsByKey(currentScores, data[0]);
          console.log("newScores", newScores);
          props.setScores(newScores);
          props.setLikedMovies([...props.likedMovies, movie_id]);
        });
    }
  };

  const displayTiles = () => {
    return props.searchResults.map((movie) => (
      <div>
        <div>
          <img
            src={"https://a.ltrbxd.com/resized/" + movie.image_url + ".jpg"}
            height={200}
            onClick={() => createReco(movie.movie_id)}
          />
        </div>
        <div
          style={{
            with: 150,
            overflow: "clip",
          }}
        >
          <p>
            <b>
              {movie.movie_title.length < 13
                ? movie.movie_title
                : movie.movie_title.substring(0, 16) + ".."}
            </b>{" "}
            <br />
            {movie.year_released}
          </p>
          <p>Rating: {movie.vote_average}</p>
        </div>
      </div>
    ));
  };
  return (
    <div>
      <h2> Search Results</h2>

      <div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            margin: 25,
          }}
        >
          {displayTiles()}
        </div>
      </div>
    </div>
  );
};

export default MovieTile;
