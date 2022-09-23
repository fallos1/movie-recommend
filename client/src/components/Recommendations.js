import React, { useState, useEffect } from "react";

const Recommendations = (props) => {
  const [recommenedMovies, setRecommenedMovies] = useState([]);

  useEffect(() => {
    const sortedScores = Object.entries(props.scores).sort(
      (a, b) => b[1] - a[1]
    );
    const movie_id_list = sortedScores.map((x) => x[0]).slice(0, 40);
    fetch("recommendations/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movie_ids: movie_id_list,
        exclude: props.likedMovies,
      }),
    })
      .then((res) => res.json())
      .then((data) => setRecommenedMovies(data));
  }, [props.scores]);

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
      console.log("clicked", movie_id);
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
    const filteredMovies = recommenedMovies.filter(
      (x) => !props.likedMovies.includes(x.movie_title)
    );
    console.log("filtered movies", filteredMovies);

    return filteredMovies.map((movie) => (
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
            <a href={"https://letterboxd.com/film/" + movie.movie_id}>
              <b>
                {movie.movie_title.length < 13
                  ? movie.movie_title
                  : movie.movie_title.substring(0, 16) + ".."}
              </b>{" "}
            </a>
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
      <h2>Recommendations</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          margin: 25,
        }}
      >
        {displayTiles()}
      </div>
    </div>
  );
};

export default Recommendations;
