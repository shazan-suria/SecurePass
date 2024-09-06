import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import crypto from "crypto";
import nodemailer from 'nodemailer';
import cors from "cors"; // Import the cors package
import { User } from "./models/User.js";

const router = express.Router();


const app = express();
const port = 3000;  


const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/User_info");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

connectDB();

// Use the cors middleware
app.use(cors());

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'securepassss@gmail.com', // your Gmail account
    pass: 'oooooooooooooooo', // the generated app password
  },
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }   

    const resetToken = crypto.randomBytes(32).toString('hex');
    
    const resetPasswordExpires = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const mailOptions = {
      from: '"SecurePass Support" <securepassss@gmail.com>', // sender address
      to: user.email, // list of receivers
      subject: 'Reset Your Password', // Subject line
      text: `Hello,
    
    We received a request to reset your password for your SecurePass account associated with this email address. If you made this request, please click the link below to reset your password:
    
    [Reset Password Link]
    
    If you did not request to reset your password, please ignore this email or contact support if you have any concerns.
    
    Thank you,
    SecurePass Support Team`, // plain text body
      html: `<p>Hello,</p>
             <p>We received a request to reset your password for your SecurePass account associated with this email address. If you made this request, please click the link below to reset your password:</p>
             <a href="${resetUrl}">Reset Password</a>
             <p>If you did not request to reset your password, please ignore this email or contact support if you have any concerns.</p>
             <p>Thank you,<br>SecurePass Support Team</p>`, // HTML body
    };
    
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log('Error while sending email:', error);
      }
    });
    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;  // Extract token from URL path
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetPasswordExpires: { $gt: Date.now() },  // Ensure the token is still valid
    });

    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired');
    }

    user.password = newPassword.password;  // Hash the password before saving
    user.resetToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send('Password has been reset');
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});




// Handle the /sign-up route
app.post('/sign-up', async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = new User({
    username,
    email,
    password,
  });

  try {
    await newUser.save();
    const savedUser = await User.findOne({ email });

    if (!savedUser) {
      return res.status(404).send('User not found after saving');
    }

    // Extract the MongoDB-generated _id and convert it to a string
    const userIdString = savedUser._id.toString();
    let userCollection = mongoose.connection.collection(userIdString);


    // Create a new collection with the name of the stringified _id

    // You can now use userCollection to perform operations on the new collection
    // For example, you can insert a document into the new collection
    res.json({ email: savedUser.email, password: savedUser.password, user:savedUser.username, collection: userIdString });
  } catch (error) {
    res.status(500).send('Error signing up user: ' + error.message);
  }
});
app.post('/sign-in', async (req, res) => {
  const { email, password, isAdmin } = req.body;
  
  if (isAdmin) {
    // Check if admin credentials are correct
    if (email === "securepassss@gmail.com" && password === "Secure@Pass231544") {
      return res.json({ success: true, email, password });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid admin credentials' });
    }
  } else {
    try {
      // Check if the user exists and the password matches
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }

      if (user.password !== password) {
        return res.status(400).json({ success: false, message: 'Incorrect password' });
      }

      // If successful, change the collection to the user's MongoDB ID
      const userIdString = user._id.toString();
      let userCollection = mongoose.connection.collection(userIdString);

      let username = user.username;
      return res.json({ success: true, email: email, password: password ,user: username, collection: userIdString});
    } catch (error) {
      return res.status(500).send('Error signing in: ' + error.message);
    }
  }
});

app.put('/edit-account', async (req, res) => {
  const { email, newUsername, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Update the username and password
    user.username = newUsername;
    user.password = newPassword; // You might want to hash this before saving

    await user.save();

    res.json({ message: 'Account updated successfully' });
  } catch (error) {
    res.status(500).send('Error updating account: ' + error.message);
  }
});

app.post('/delete-account', async (req, res) => {
  const { email, collection } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Drop the user's collection
    let userCollection = mongoose.connection.collection(collection);
    await userCollection.drop();

    // Remove the user from the users collection
    await User.deleteOne({ email });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).send('Error deleting account: ' + error.message);
  }
});




// CRUD operations for userCollection

// GET: Retrieve all documents from the userCollection
app.get('/', async (req, res) => {
  const { collection } = req.query;
  if (!collection) {
    return res.status(400).json({ message: 'Collection name is required' });
  }
  try {
    let userCollection = mongoose.connection.collection(collection);

    const documents = await userCollection.find().toArray();
    res.json(documents);
  }
  catch (error) {
    res.status(500).send('Error in getting document: ' + error.message);
  }
});

// POST: Add a new document to the userCollection
app.post('/', async (req, res) => {
  const { collection } = req.query;
  if (!collection) {
    return res.status(400).json({ message: 'Collection name is required' });
  }
  const newDocument = req.body;

  try {
    let userCollection = mongoose.connection.collection(collection);
    const result = await userCollection.insertOne(newDocument);
    const insertedId = result.insertedId; // Ensure you use insertedId
    res.json({
      message: 'Document added successfully',
      insertedId: insertedId,
    });
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).send('Error adding document: ' + error.message);
  }
});



// DELETE: Remove a document from the userCollection by ID
app.delete('/:id', async (req, res) => {
  const { collection } = req.query;
  const { id } = req.params;
  if (!collection) {
    return res.status(400).json({ message: 'Collection name is required' });
  }
  try {
    let userCollection = mongoose.connection.collection(collection);
    const document = await userCollection.findOne({ id: id });
    if (!document) {
      res.json({ message: 'Document not found' });
    }

    const result = await userCollection.deleteOne({ id: id });
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).send('Error deleting document: ' + error.message);
  }
});
app.get('/dashboard', async (req, res) => {
  let users = mongoose.connection.collection("users");
  const documents = await users.find().toArray();
  
  res.json(documents);

});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
