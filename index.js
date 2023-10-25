const express = require('express');
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9u7odmy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // Get the database and collection on which to run the operation
    const brandCollection = client.db('brandDB').collection('brand');
    const addToCartCollection = client.db('brandDB').collection('cart');

    // post: myCart
    app.post('/myCart', async (req, res) => {
      const myCart = req.body;
      const result = await addToCartCollection.insertOne(myCart);
      res.send(result);
    })

    // get: data_come_form_database: myCart
    app.get('/myCart', async (req, res) => {
      const cursor = addToCartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // delete: data_delete_form_database: myCart
    app.delete('/myCart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addToCartCollection.deleteOne(query);
      res.send(result);
    })




    // get: data_come_form_database for updated : form brand
    app.get('/addProducts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.findOne(query);
      res.send(result);
    })

    // put: update_data on database: form brand
    app.put('/addProducts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCart = req.body;
      const brand = {
        $set: {
          name: updatedCart.name,
          brandName: updatedCart.brandName,
          photo: updatedCart.photo,
          types: updatedCart.types,
          rantCost: updatedCart.rantCost,
          genre: updatedCart.genre,
          rating: updatedCart.rating,
          releaseDate: updatedCart.releaseDate,
          trailer: updatedCart.description,
        }
      }
      const result = await brandCollection.updateOne(filter, brand, options);
      res.send(result);
    })

    // read
    app.get('/addProducts', async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // post
    app.post('/addProducts', async (req, res) => {
      const newProduct = req.body;
      const result = await brandCollection.insertOne(newProduct);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("Entertainment Media server is running")
})

app.listen(port, () => {
  console.log(`Entertainment Media is running on port: ${port}`);
})



/* 

    app.get('/products-by-name/:brand_name', async (req, res) => {
      const brand_name = req.params.brand_name
      const query = {
        brand_name: brand_name
      }

      const result = await productCollection.find(query).toArray()
      return res.send(result)
    })

*/