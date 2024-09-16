require("dotenv").config();

const express = require('express');
const app = express();
const bp = require('body-parser');
const cors = require('cors');

const port = process.env.AWS_MS_PORT || 3003;
app.use(bp.json({limit:'100mb'}));

app.use(bp.urlencoded({
  extended: true,
  limit: '100mb'
}));

// CORS middleware to allow all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Routes
app.use('/v1', require("./router/s3.js"));

// Error handling
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    return res.status(400).send({ status: 400, success: false, message: 'Bad request.', error });
  }
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send({ msg: `AWS Server is running fine on port ${port}` });
});

// Health check route
app.get("/health", (req, res) => {
  try {
    return res.status(200).send({ status: true, message: `AWS CI--CD is running fine at ${port}` });
  } catch (error) {
    return res.status(500).send({ status: false, message: `AWS CI--CD down right now at ${port}.` });
  }
});

app.listen(port, async () => {
  console.log(`AWS listening at http://localhost:${port}`);
});
