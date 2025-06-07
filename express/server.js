const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

// const DB = process.env.DATABASE;

// // mongodb  連接
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then((con) => {
//     // console.log(con.connections)
//     console.log("mongodb connect success");
//   })
//   .catch((err) => {
//     console.log(err);
//     console.log("connect fail!!!!");
//   });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app running on ${port}..`);
});
