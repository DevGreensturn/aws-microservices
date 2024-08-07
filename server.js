require("dotenv").config();

const app = require('express')();

const bp = require('body-parser');

const cors = require("cors");

const port = process.env.AWS_MS_PORT || 3003;

app.use(bp.json({limit:'100mb'}));
app.use('/v1', require("./router/s3.js"));

app.use(bp.urlencoded({
  extended: true,
  limit: '100mb'
}));

app.use(cors({
  origin: '*'
}));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "*"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,OPTIONS");
  next();
});

// app.use('/v1', require("./routes/route"));

app.get("/", (req, res) => {
  res.send({ msg: `aws Server is running fine ${port}` });
});

app.get("/health", (req, res) => {
  try {
    return res.status(200).send({ status: true, message: `AWS CI-CD is running fine at ${port}`});

  } catch (error) {
    return res.status(500).send({ status: false, message: `AWS CI-CD down right now at ${port}.` });
  }
});


app.listen(port, async () => {
  console.log(`aws listening at http://localhost:${port}`);
});
