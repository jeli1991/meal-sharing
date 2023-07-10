const express = require('express');
const router = express.Router();
const knex = require('../database');


//api/reservations	GET	Returns all reservations/

router.get('/', async (req, res) => {
  try {
    const reservations = await knex('reservation').select('*');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'error' });
  }
});

//api/reservations	POST	Adds a new reservation to the database

router.post('/', async (req, res) => {
  try {
    const reservation = await knex('reservation').insert(req.body);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(401).json({ error: 'error' });
  }
});

///api/reservations/:id	GET	Returns a reservation by id

router.get('/:id', async (req, res) => {
    try {
      const reservation = await knex('reservation').select('*').where({ id: req.params.id }).first();
      if (reservation) {
        res.json(reservation);
      } else {
        res.status(404).json({ error: 'Could not find reservation' });
      }
    } catch (error) {
      res.status(500).json({ error: 'error' });
    }
  });


  ///api/reservations/:id	PUT	Updates the reservation by id
  router.put('/:id', async (req, res) => {
    try {
      const reservation = await knex('reservations').where({ id: req.params.id }).update(req.body);
      if (reservation) {
        res.json({ message: 'reservation up to date' });
      } else {
        res.status(404).json({ error: 'reservation could not be fond' });
      }
    } catch (error) {
      res.status(500).json({ error: 'error' });
    }
  });

  ///api/reservations/:id	DELETE	Deletes the reservation by id

  router.delete('/:id', async (req, res) => {
    try {
      const reservation = await knex('reservation').where({ id: req.params.id }).del();
      if (reservation) {
        res.json({ message: 'Reservation deleted' });
      } else {
        res.status(404).json({ error: 'reservation could not be found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'error' });
    }
  });

  module.exports = router;