const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");

const mealsRouter = require("./api/meals");
const buildPath = path.join(__dirname, "../../dist");
const port = process.env.CLIENT_PORT || 3000;
const cors = require("cors");
const knex = require("./database");

// For week4 no need to look into this!
// Serve the built client html
app.use(express.static(buildPath));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cors());

router.use("/meals", mealsRouter);



app.get('/future-meals', async (req, res) => {
  try {
    const meal = await knex.raw("SELECT * FROM meal WHERE `when` > now()");
    res.status(200).json(meal[0]);
  } catch (error) {
    res.status(404).json({ error: 'error'});
  }
});

app.get('/past-meals', async (req, res) => {
  try {
    const meal = await knex.raw("SELECT * FROM meal WHERE `when` < now()");
    res.status(200).json(meal[0]);
  } catch (error) {
    res.status(404).json({ error: 'error'});
  }
});

app.get('/all-meals', async (req, res) => {
  try {
    const meal = await knex.raw("SELECT * FROM meal ORDER BY id");
    res.json(200).json(meal[0]);
  } catch (error) {
    res.status(404).json({ error: 'error'});
  }
});

if (process.env.API_PATH) {
  app.use(process.env.API_PATH, router);
} else {
  throw "API_PATH is not set. Remember to set it in your .env file";
}

// for the frontend. Will first be covered in the react class
app.use("*", (req, res) => {
  res.sendFile(path.join(`${buildPath}/index.html`));
});

module.exports = app;


