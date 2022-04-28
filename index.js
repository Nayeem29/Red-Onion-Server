const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ebuer.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log('red-users connected');

async function run() {
  try {
    await client.connect();
    const allRedUsers = client.db('Red-Onion').collection('RedUsers');
    const redOrders = client.db('Red-Onion').collection('RedOrders');

    //Get Method 
    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = allRedUsers.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await allRedUsers.findOne(query);
      res.send(user);
    });

    app.get('/orders', async (req, res) => {
      const query = {};
      const cursor = redOrders.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    })
    app.get('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await redOrders.findOne(query);
      res.send(order);
    })

    //POST  METHOD
    app.post('/orders', async (req, res) => {
      const doc = req.body;
      const result = await redOrders.insertOne(doc);
      res.send(result);
    });

    //Update Method 
    app.put('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const doc = req.body;
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: doc.name,
          email: doc.email,
          address: doc.address,
          comments: doc.comments,
          mobile: doc.mobile
        }
      };
      const result = await redOrders.updateOne(filter, updatedDoc, options);
      console.log({ updatedDoc });
      res.send(result);
    })

    //Delete Method
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await redOrders.deleteOne(query);
      res.send(result);
    });

  } finally {
  }
}
run().catch(console.dir());



app.get('/', (req, res) => {
  res.send('red-onion server is starting');
})

app.listen(port, (req, res) => {
  console.log('RED-onion server is working');
})