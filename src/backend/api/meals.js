const express = require("express");
const router = express.Router();
const knex = require("../database");

router.get("/", async (request, response) => {
  try {
    // knex syntax for selecting things. Look up the documentation for knex for further info
    const titles = await knex("meals").select("title");
    response.json(titles);
  } catch (error) {
    throw error;
  }
});

///api/meals	GET	Returns all meals

router.get('/:id', async (req, res) => {
  try {
    const meal = await knex('meals').select('*').where({ id: req.params.id }).first();
    if (meal) {
      res.json(meal);
    } else {
      res.status(404).json({ error: 'Sorry, no meal' });
    }
  } catch (error) {
    res.status(500).json({ error: 'error' });
  }
});

//api/meals/:id	DELETE	Deletes the meal by id

router.delete('/:id', async (req, res) => {
  try {
    const meal = await knex('meals').where({ id: req.params.id }).del();
    if (meal) {
      res.json({ message: 'Meal deleted' });
    } else {
      res.status(404).json({ error: 'Meal not found' });
    } 
  } catch (error) {
    throw error,
    res.status(500).json({ error: 'An error occurred while deleting the meal' });
  }
});

//api/meals/:id	PUT	Updates the meal by id
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    // Validate id
    if (!id) {
      return res.status(400).json({ error: 'Missing ID parameter' });
    }

    // Validate body
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ error: 'Missing request body' });
    }

    const meal = await knex('meals').where({ id }).update(body);

    if (meal) {
      res.json({ message: 'Meal updated' });
    } else {
      res.status(404).json({ error: 'Meal not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the meal' });
  }
});


module.exports = router;
