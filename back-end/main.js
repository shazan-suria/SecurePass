import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import crypto from "crypto";
import nodemailer from 'nodemailer';
import cors from "cors";
import { User } from "./models/User.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const app = express();
const port = 3000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

connectDB();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log("Received forgot-password request for email:", email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = Date.now() + 3600000;

    user.resetToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    const resetUrl = `/reset-password/${resetToken}`;
    const mailOptions = {
      from: '"SecurePass Support" <securepassss@gmail.com>',
      to: user.email,
      subject: 'Reset Your Password',
      text: `Hello, we received a password reset request.`,
      html: `<p>Hello,</p><a href="${resetUrl}">Reset Password</a>`,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error while sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error("Error in /forgot-password:", error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  console.log("Received reset-password request with token:", token);

  try {
    const user = await User.findOne({
      resetToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid or expired token");
      return res.status(400).send('Password reset token is invalid or has expired');
    }

    user.password = newPassword.password;
    user.resetToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    console.log("Password has been reset for user:", user.email);

    res.status(200).send('Password has been reset');
  } catch (error) {
    console.error("Error in /reset-password:", error.message);
    res.status(500).send('Error: ' + error.message);
  }
});

app.post('/sign-up', async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Received sign-up request for email:", email);
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    console.log("User already exists");
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
      console.log("User not found after saving");
      return res.status(404).send('User not found after saving');
    }

    const userIdString = savedUser._id.toString();
    let userCollection = mongoose.connection.collection(userIdString);

    console.log("User created successfully with ID:", userIdString);
    res.json({ email: savedUser.email, password: savedUser.password, user: savedUser.username, collection: userIdString });
  } catch (error) {
    console.error("Error signing up user:", error.message);
    res.status(500).send('Error signing up user: ' + error.message);
  }
});

app.post('/sign-in', async (req, res) => {
  const { email, password, isAdmin } = req.body;
  console.log("Received sign-in request for email:", email);

  if (isAdmin) {
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      console.log("Admin signed in successfully");
      return res.json({ success: true, email, password });
    } else {
      console.log("Invalid admin credentials");
      return res.status(400).json({ success: false, message: 'Invalid admin credentials' });
    }
  } else {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found");
        return res.status(400).json({ success: false, message: 'User not found' });
      }

      if (user.password !== password) {
        console.log("Incorrect password");
        return res.status(400).json({ success: false, message: 'Incorrect password' });
      }

      const userIdString = user._id.toString();
      let userCollection = mongoose.connection.collection(userIdString);

      console.log("User signed in successfully:", userIdString);
      let username = user.username;
      return res.json({ success: true, email: email, password: password, user: username, collection: userIdString });
    } catch (error) {
      console.error("Error signing in:", error.message);
      return res.status(500).send('Error signing in: ' + error.message);
    }
  }
});

app.put('/edit-account', async (req, res) => {
  const { email, newUsername, newPassword } = req.body;
  console.log("Received edit-account request for email:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: 'User not found' });
    }

    user.username = newUsername;
    user.password = newPassword;

    await user.save();
    console.log("Account updated for user:", email);

    res.json({ message: 'Account updated successfully' });
  } catch (error) {
    console.error("Error updating account:", error.message);
    res.status(500).send('Error updating account: ' + error.message);
  }
});

app.post('/delete-account', async (req, res) => {
  const { email, collection } = req.body;
  console.log("Received delete-account request for email:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: 'User not found' });
    }

    let userCollection = mongoose.connection.collection(collection);
    await userCollection.drop();
    await User.deleteOne({ email });

    console.log("Account deleted for user:", email);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error("Error deleting account:", error.message);
    res.status(500).send('Error deleting account: ' + error.message);
  }
});

app.get('/', async (req, res) => {
  const { collection } = req.query;
  console.log("Received GET request for collection:", collection);
  if (!collection) {
    return res.status(400).json({ message: 'Collection name is required' });
  }
  try {
    let userCollection = mongoose.connection.collection(collection);
    const documents = await userCollection.find().toArray();
    res.json(documents);
  }
  catch (error) {
    console.error("Error in GET request:", error.message);
    res.status(500).send('Error in getting document: ' + error.message);
  }
});

app.post('/', async (req, res) => {
  const { collection } = req.query;
  console.log("Received POST request for collection:", collection);
  if (!collection) {
    return res.status(400).json({ message: 'Collection name is required' });
  }
  const newDocument = req.body;

  try {
    let userCollection = mongoose.connection.collection(collection);
    const result = await userCollection.insertOne(newDocument);
    const insertedId = result.insertedId;
    console.log("Document added to collection:", collection, "with ID:", insertedId);
    res.json({
      message: 'Document added successfully',
      insertedId: insertedId,
    });
  } catch (error) {
    console.error('Error adding document:', error.message);
    res.status(500).send('Error adding document: ' + error.message);
  }
});

app.delete('/:id', async (req, res) => {
  const { collection } = req.query;
  const { id } = req.params;
  console.log("Received DELETE request for document ID:", id, "in collection:", collection);
  if (!collection) {
    return res.status(400).json({ message: 'Collection name is required' });
  }
  try {
    let userCollection = mongoose.connection.collection(collection);
    const document = await userCollection.findOne({ id: id });
    if (!document) {
      console.log("Document not found");
      res.json({ message: 'Document not found' });
    }

    const result = await userCollection.deleteOne({ id: id });
    console.log("Document deleted from collection:", collection, "with ID:", id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error("Error deleting document:", error.message);
    res.status(500).send('Error deleting document: ' + error.message);
  }
});

app.get('/dashboard', async (req, res) => {
  console.log("Received dashboard request");
  let users = mongoose.connection.collection("users");
  const documents = await users.find().toArray();
  res.json(documents);
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
