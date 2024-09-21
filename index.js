const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
require('dotenv').config()

app.use(cors(
  {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
  }
))

app.use(express.json())
app.get('/', async (req, res) => {
  res.send({ message: "Welcome Back" })
})

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://e-shop:Nddrc5kjgisqYfDZ@cluster0.vhkuyua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const productDB = client.db('E-Shop').collection("add-product")


    app.get('/products', async (req, res) => {
      const id = Math.round(req.query.data)
      console.log(id);
      
      const cursor = await productDB.find().skip(id).limit(4).toArray()
      res.send(cursor)
    })

    app.get('/allproduct' , async(req,res)=>{
      const cursor = await productDB.find().toArray() 
      res.send(cursor)
    })

    app.post('/addproducts', async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productDB.insertOne(product)
      res.send(result)
    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})