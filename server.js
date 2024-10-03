require("dotenv").config();
const express= require("express")
const app = express()
const path = require("path")


const {logger} = require("./middleware/logEvents")
const errorHandler = require("./middleware/errorHandler")

const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require("cookie-parser")
const credentials = require("./middleware/credentials")
const PORT = process.env.PORT || 3500;


// connect to Mongo DB
const mongoose = require("mongoose")
const connectDB = require("./config/dbConn")
connectDB()

// custom middleware logger
app.use(logger)

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({extended:false}))
// built-in middleware for json 
app.use(express.json());
//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
//middleware for cookies
app.use(cookieParser());



app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"))
app.use("/auth", require("./routes/auth"))
app.use("/refresh", require("./routes/refresh"))
app.use("/logout", require("./routes/logout"))
app.use("/posts", require("./routes/api/posts"));
app.use(verifyJWT);
app.use("/users", require("./routes/api/users"));

// 404エラー処理の前に全てのリクエストをindex.htmlにリダイレクト
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.all("*", (req, res) => {
  res.status(404); //not found
  if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "views", '404.html'));
  } else if (req.accepts('json')) {
    res.json({ "error": "404 Not Found" });
  } else {
      res.type('txt').send("404 Not Found");
  }
});
// req.accepts() checks which format client can accepts (HTML、JSON、plain text usw.）。
// クライアントが希望するレスポンス形式（HTML、JSON、テキスト）に合わせて適切な形式で404エラーメッセージを返します。

app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("connected to MongoDB")
    app.listen(PORT,() => console.log(`server running on port ${PORT}`) )
})