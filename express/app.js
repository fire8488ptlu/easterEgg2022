const path = require("path");
const express = require("express");
const morgan = require("morgan");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet"); // 防header
const mongoSanitize = require("express-mongo-sanitize"); // 防nosql
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
// const tourRouter = require("./routes/tourRoutes");
// const userRouter = require("./routes/userRoutes");
// const reviewRouter = require("./routes/reviewRoutes");

// const contentImgRouter = require("./routes/contentImgRoutes");
// const coverImgRouter = require("./routes/coverImgRoutes");
// const viewRouter = require("./routes/viewRoutes");
// const seoRouter = require("./routes/seoRoutes");
// const RefreshTokenRouter = require("./routes/refreshTokenRoutes");
// const refreshToken = require("./models/refreshTokenModel");
// const themeRouter = require("./routes/themeRoutes");
const fs = require("fs");

const app = express();

const whitelist = [
  "http://localhost:3001",
  "http://10.0.1.166:3001",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// static folder !!!
// 如果這裡是類似react 的index.html 會先佔有localhost:3000/ 這個位置 但這裡只是fileserver 沒有index.html 去做route導向
app.use(express.static(path.join(__dirname, "public")));
//=======================-進入route 的一些middleware 設定 格式 資安 流量 各種細節操作=======================

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

//1) middleware the req before the routes
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 防止爬蟲攻擊
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
// app.use('/api', limiter);

// Body parser, reading data from body into req.body ????
//app.use 啟用express.json 來解析含有 json的資料
// 並且設置大小為10kb
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection  ???
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// app.use(express.static(`${__dirname}/public`));

// custom 的middleware
app.use((req, res, next) => {
  //  新增一個requestTime before the 3)routes
  req.requestTime = new Date().toISOString();
  next();
});

// const contentImgRouter = require('./routes/contentImgRoutes');
// const coverImgRouter = require('./routes/coverImgRoutes');
// const viewRouter = require('./routes/viewRoutes');
// const seoRouter = require('./routes/seoRoutes');
//========================================================================================================

//3) routes  //routes 模組  去做get post patch .....
//           //controller 模組 呼叫model模組 還有res 回應 catch error
// url 不符合/api/v1/tours' 自然就不會進來這個use 但不代表沒有經過
// app.use("/api/v1/tours", tourRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/reviews", reviewRouter);
// //custom
// app.use("/api/v1/views", viewRouter);
// app.use("/api/v1/contentImg", contentImgRouter);
// app.use("/api/v1/coverImg", coverImgRouter);
// app.use("/api/v1/seo", seoRouter);
// app.use("/api/v1/refreshToken", RefreshTokenRouter);
// app.use("/api/v1/theme", themeRouter);

// frontend 的順序要優先於 admin frontend 不然localhost:3000 會預設到adminfrontend
//-----frontend----------
// 開通 '/' , 'content/:id' 兩個route

app.get("/", function (request, response) {
  const filePath = path.join(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    var host = request.get("host");
    var url = `http://${host}/`;

    data = data.replace("OG_IMAGE", `${url}CoverEgg/ShareCover.jpg`);
    data = data.replace("OG_TITLE", "2022旌旗教會復活節彩蛋來了~~");
    data = data.replace(
      "OG_DESCRIPTION",
      "旌旗教會復活節彩蛋，一起來抽蛋，領受耶穌的祝福!"
    );
    data = data.replace("OG_IMAGE_WIDTH", "1200");
    data = data.replace("OG_IMAGE_HEIGHT", "700");

    return response.send(data);
  });
});

//1200 W
// 700 H

app.get("/content/:id", function (request, response) {
  const filePath = path.join(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    var host = request.get("host");
    var url = `http://${host}/`;

    data = data.replace(
      "OG_IMAGE",
      `${url}ContentImg/content${request.params.id}.jpg`
    );
    data = data.replace("OG_TITLE", "給你看看，我抽到什麼祝福~~");
    data = data.replace(
      "OG_DESCRIPTION",
      "2022旌旗教會復活節彩蛋，一起來抽蛋，分享經文吧!!"
    );
    data = data.replace("OG_IMAGE_WIDTH", "400");
    data = data.replace("OG_IMAGE_HEIGHT", "700");

    return response.send(data);
  });
});

app.use(express.static(path.join(__dirname, "./build")));

//----admin frontend----------------------------------------------------------

// app.get("/admin/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../newfrontend/build", "index.html"));
// });

// app.use(express.static(path.join(__dirname, "../newfrontend/build")));

// // error 一但發生只能進入最後的middleware 就是(err, req, res, next) 中間不能再加middleware
// // 所有route 遇到的error 跟 此作法是一樣的
app.all("*", (req, res, next) => {
  // 把 paramter先去套AppError的資訊 然後再透過next()傳出去
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// // 發生任何的error 這個就會觸發，所有的error 都會過來
// app.use(globalErrorHandler);

module.exports = app;
