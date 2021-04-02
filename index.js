const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tnvy9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
  const jerseyCollection = client.db("jerseyShop").collection("jerseys");
  
  app.get('/jerseys', (req, res) => {
      jerseyCollection.find()
      .toArray((err, jerseys) => {
          res.send(jerseys)
      })
  })

  app.post('/admin', (req, res) => {
    const newJersey = req.body;
    console.log('adding new jersey: ', newJersey)
    jerseyCollection.insertOne(newJersey)
    .then(result => {
        console.log('inserted count: ', result.insertedCount)
        res.send(result.insertedCount > 0)
    })
  })

  app.delete('manageJerseyDelete/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    jerseyCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(!!documents.value))
  })

//   client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})