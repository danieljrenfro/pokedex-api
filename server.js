require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json')

console.log(process.env.API_TOKEN);

const app = express();
app.use(morgan('common'));

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  
  console.log('validate bearer token middleware')
  next();
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

function handleGetTypes(req, res) {
  res.json(validTypes);
}

app.get('/types', handleGetTypes)

function handleGetPokemon(req, res) {
  const { name='', type='' } = req.query;

  if (!name && !type) {
    return res.status(400).send('Please search by either a pokemon name or type')
  }

  if (type && !validTypes.includes(type)) {
    return res.status(400).send(`Invalid pokemon type. Please select one of the following valid types:\n ${validTypes.join('\n')}`)
  }

  let results = POKEDEX.pokemon;
  
  if (type && type !== '') {
    results = results.filter(poke => poke.type.includes(type))
  }

  if (name && name !== '') {
    results = results.filter(poke => poke.name.toLowerCase().includes(name.toLowerCase()))
  }
  
  res.send(results);
}

app.get('/pokemon', handleGetPokemon);

const PORT = 8000;

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));