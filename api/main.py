from flask import Flask, jsonify, request
import json
import pandas as pd

app = Flask(__name__)

with open("scores.json") as f:
    similarity_scores = json.load(f)
    
movie_data = pd.read_csv("movie_data.csv",  lineterminator='\n')
movie_data = movie_data[movie_data["vote_count"] > 70]
print(movie_data.columns)


@app.route("/")
def index():
    return "Movie Recommender API"

@app.route("/similar_by_id/<movie_id>")
def similar_by_id(movie_id):
    if movie_id in similarity_scores.keys():
        scores = similarity_scores[movie_id]
        scores.pop(movie_id, None)
        return jsonify([scores])
    else:
        return {"error": f"{movie_id} not found"}

@app.route("/search_movies/")
@app.route("/search_movies/<search_term>")
def search_movies(search_term=""):
    sort_by = "vote_count" if search_term == "" else "popularity"
    search_term = search_term.lower()
    movies_data_filtered = movie_data[movie_data["movie_title"].str.lower().str.contains(search_term)]
    movies_data_filtered = movies_data_filtered.sort_values(sort_by, ascending=False)
    movies_data_filtered = movies_data_filtered[0:20]
    return jsonify(movies_data_filtered.to_dict(orient="records"))

@app.route("/recommendations/", methods=["POST"])
def recommendations():
    if request.method == "POST":
        print(request.json)
        #return {"sucess": f"sucess"}
        
        movie_list = request.json["movie_ids"]
        exclusion_list = request.json["exclude"]
        movies_data_filtered = movie_data.set_index("movie_id", drop=False)
        movies_data_filtered = movies_data_filtered.loc[movie_list]
        movies_data_filtered = movies_data_filtered[~movies_data_filtered["movie_id"].isin(exclusion_list)]

        

        return jsonify(movies_data_filtered.to_dict(orient="records"))
    else:
        return {"error": "To get Recommendations use POST request"}
    

app.run(host="0.0.0.0", debug=True)