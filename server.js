require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const MOVIELIST = require("./moviedex.json")

const app = express();

const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "common";
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.use(function validateToken(req, res, next) {
  const authToken = req.get("Authorization");
  const apiToken = process.env.API_TOKEN;

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }

  next();
});

function handleGetMovie(req, res) {
  const { genre = "", country = "", avg_vote = "" } = req.query
  let response = MOVIELIST

  if(genre) {
    response = response.filter( movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    )
  }

  if(country) {
    response = response.filter(movie => 
      movie.country.toLowerCase().includes(country.toLowerCase())
    )
  }

  if (avg_vote) {
    response = response.filter(movie =>
      Number(movie.avg_vote) >= Number(avg_vote)
    )
  }

  res.json(response)
}

app.get('/movie', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})