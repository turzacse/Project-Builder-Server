const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5001;

//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bnzewy6.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    const projectCollection = client.db('ProjectDB').collection('projects');

    //read the product data from the database 
    app.get('/project', async (req, res) => {
      const cursor = projectCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/project/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const options = {
            // Include only the `title` and `imdb` fields in the returned document
            projection: {name: 1, author:1, price: 1, service_id:1, img:1 },
          };
        const result = await projectCollection.findOne(query);
        res.send(result);
    })


    app.post('/project', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await projectCollection.insertOne(newProduct);
      res.send(result);
    })

    app.put('/project/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upset: true };
      const updateProject = req.body;
      const project = {
        $set: {
          
          name: updateProject.name,
          projectName: updateProject.projectName,
          descriptions: updateProject.descriptions,
        }
      }
      const result = await projectCollection.updateOne(filter, project, options);
      res.send(result);
    })

    app.delete('/project/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await projectCollection.deleteOne(query);
      res.send(result);
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})