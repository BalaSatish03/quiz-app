import express from 'express';
import {MongoClient} from 'mongodb';
import bcrypt from 'bcryptjs';
import session from 'express-session';

const app = express();

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URL ||"mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(express.json());
app.use(session({
  secret:'Balasatish',
  resave:false,
  saveUninitialized: true
}))

// Serve static files from the "public" directory
app.use(express.static('public'));

// Serve the register.html page as the default page
let connection;

async function connectdb() {
 if(!connection){
  connection= await client.connect();
  console.log('connected to mongodb');}
  const db=connection.db('bala_db');
  return db
}


await connectdb().catch(console.error);


app.post('/register',async(req,res) =>{
  
  try{
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
    const db=await connectdb();
    const collection=db.collection('credentials');
    const existinguser=await collection.findOne({username})
    if(existinguser){
      return res.status(400).send('User already exists');
    }
   const hashed_password=await bcrypt.hash(password,10);
    await collection.insertOne({username:username,password:hashed_password});
    res.status(200).send('user register succesfully');
  }

  catch (error) {
    console.error('Error registering user:', error);

  if (!res.headersSent) {
        res.status(500).send('An error occurred while registering user');
        }
} 
});

app.post('/login',async(req,res) =>{
  
  try{
    const {username,password}=req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
    const db=await connectdb();
    const collection=db.collection('credentials');
    const user=await collection.findOne({username});
    if(user && await bcrypt.compare(password,user.password)){
      req.session.username = username;
      res.status(200).send('login successful!');
    }
    else{
      res.status(400).send('invalid username or password!');
    }
  }
  catch (error) {
    console.error('Error fetching data:', error);
    if (!res.headersSent) {
      res.status(500).send('An error occurred while registering user');
    }
    } 
    });

    app.post('/save-score',async(req,res)=>{
      try{
        const db=await connectdb();
        const collection=db.collection('score');
        const {score}=req.body;
        const username=req.session.username;
        if(!username || score==undefined){
          return res.status(400).send('username and score are required');
        }
        await collection.updateOne({username:username},{$set:{score:score}},{upsert:true});
        res.status(200).send('score saved successfully');
      }
      catch (error) {
        console.error('Error saving score:', error);
        if (!res.headersSent) {
          return res.sendStatus(500); }
        }

    })

    app.get('/view-score',async(req,res)=>{
      try{
      const username=req.session.username;
      if(username==undefined){
        return res.status(400).send('username is not defined')
      }
      const db=await connectdb();
      const collection=db.collection('score');
      const sc=await collection.findOne({username});
      if (sc){
        res.status(200).json(sc.score);
      }
      else{
        res.status(400).send('score is not found');
      }
    }
    catch (error) {
      console.error('Error retrieving score:', error);
      if (!res.headersSent) {
        return res.sendStatus(500); }}
      

  })


  // Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.status(200).send('successfully logged out'); // Redirect to login or any other page after logout
  });
});

    


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
