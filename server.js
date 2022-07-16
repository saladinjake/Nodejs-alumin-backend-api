const express = require("express");
const mongoose = require("mongoose");
const {MONGO_URI} = require('./config/key')
const dotenv = require("dotenv")
dotenv.config()

const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');

const compression = require('compression'); // Compression middleware, compress responses from all routes
const helmet = require('helmet'); // Protect against web vunerablities, http headers, https://www.npmjs.com/package/helmet
const cors = require("cors");


const app = express();

app.use(compression());
app.use(helmet());
app.use(cors())

// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


mongoose.connect(MONGO_URI, 
  { 
    user: "votting", 
    pass: "yETwJW3iwAApsC16",//process.env.MONGO_PASSWORD,
     useNewUrlParser: true, 
     useUnifiedTopology: true
 })
  .then(() => console.log("Mondodb Connected ...."))
  .catch(err => console.error(err));
//---------model--------//
  require('./models/usermodel')
  require('./models/contestantmodel')

//==========RUTING========//
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server working 🔥");
});

app.use('/auth',require('./routes/authroute'))
app.use("/api/users", require("./routes/user"))
app.use("/api/contestants", require("./routes/contestant"))
//===========PORT SETTING============//

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port port ${port}`));