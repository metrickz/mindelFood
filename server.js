const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const options = {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     serverSelectionTimeoutMS: 5000 // erhöhe den Timeout auf 5 Sekunden
   };
   
// Datenbankverbindung mit Mongoose herstellen
mongoose.connect('mongodb://127.0.0.1:27017/restaurant_db', { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000  })
  .then(() => console.log('Datenbankverbindung erfolgreich!'))
  .catch((err) => console.error(err));

// Restaurant-Schema und Model erstellen
const restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  description: String
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// Express-App erstellen
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS-Konfiguration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// RESTful API definieren
app.get('/restaurants', async (req, res) => {
  const restaurants = await Restaurant.find();
  res.send(restaurants);
});

app.get('/restaurants/:id', async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  res.send(restaurant);
});

app.post('/restaurants', async (req, res) => {
  const restaurant = new Restaurant({
    name: req.body.name,
    address: req.body.address,
    description: req.body.description
  });
  await restaurant.save();
  res.send(restaurant);
  console.log("POSTED !!");
});

app.put('/restaurants/:id', async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  restaurant.name = req.body.name;
  restaurant.address = req.body.address;
  restaurant.description = req.body.description;
  await restaurant.save();
  res.send(restaurant);
  console.log("PUT !!");
});

app.delete('/restaurants/:id', async (req, res) => {
  await Restaurant.findByIdAndDelete(req.params.id);
  res.send('Restaurant erfolgreich gelöscht');
});

// Server starten
app.listen(3000, () => console.log('Server läuft auf Port 3000...'));
