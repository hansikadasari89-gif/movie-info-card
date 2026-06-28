const express = require("express");
const fs = require("fs"); // for reading/writing favorites.json
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const API_KEY = "98b575cb"; // replace with your OMDb API key

// Home route
app.get("/", (req, res) => {
  res.render("index", { movie: null, favorites: getFavorites() });
});

// Search route
app.post("/search", async (req, res) => {
  try {
    const movieName = req.body.movieName;
    const response = await fetch(`http://www.omdbapi.com/?t=${movieName}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.Response === "False") {
      res.render("index", { movie: null, favorites: getFavorites() });
    } else {
      res.render("index", { movie: data, favorites: getFavorites() });
    }
  } catch (err) {
    console.error("Error fetching movie:", err);
    res.render("index", { movie: null, favorites: getFavorites() });
  }
});

// Add to favorites
app.post("/favorites/add", (req, res) => {
  const movieTitle = req.body.movieTitle;
  let favorites = getFavorites();

  if (!favorites.includes(movieTitle)) {
    favorites.push(movieTitle);
    fs.writeFileSync("favorites.json", JSON.stringify(favorites, null, 2));
  }

  res.redirect("/");
});

// Helper: read favorites.json
function getFavorites() {
  if (fs.existsSync("favorites.json")) {
    return JSON.parse(fs.readFileSync("favorites.json"));
  }
  return [];
}

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));