const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());

const port = 3000;

const url = 'mongodb://localhost/';
const dbName = 'restaurantDB';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Connected to MongoDB server');

  const db = client.db(dbName);
  const collection = db.collection('restaurants');

  app.post('/restaurants', (req, res) => {
    collection.insertOne(req.body, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({error: 'Error inserting document into collection'});
        return;
      }
      res.send(result.ops[0]);
    });
  });

  app.get('/restaurants', (req, res) => {
    collection.find({}).toArray((err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({error: 'Error getting documents from collection'});
        return;
      }
      res.send(result);
    });
  });

  app.put('/restaurants/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;

    collection.updateOne({_id: ObjectId(id)}, {$set: data}, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({error: 'Error updating document in collection'});
        return;
      }
      res.send(result);
    });
  });

  app.delete('/restaurants/:id', (req, res) => {
    const id = req.params.id;

    collection.deleteOne({_id: ObjectId(id)}, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({error: 'Error deleting document from collection'});
        return;
      }
      res.send(result);
    });
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

client.on('timeout', () => {
  console.error('MongoDB timeout error');
  client.close();
});
