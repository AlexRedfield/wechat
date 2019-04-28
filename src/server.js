// ---- 基本設定 ----
var express = require('express');
var app     = express();
var port    = process.env.PORT || 8080;

// ---- ROUTES ----

app.route('/login')

  // 顯示登入表單 (GET http://localhost:8080/login)
  .get(function(req, res) {
    res.send('this is the login form');
  })

  // 處理登入表單 (POST http://localhost:8080/login)
  .post(function(req, res) {
    console.log('processing');
    res.send('processing the login form!');
  });


// 舊方法
app.get('/sample', function(req, res) {
  res.send('this is a sample!');
});

// Express Router

// 建立 Router 物件
var router = express.Router();

// 在每一個請求被處理之前都會執行的 middleware
router.use(function(req, res, next) {

    // 輸出記錄訊息至終端機
    console.log(req.method, req.url);
  
    // 繼續路由處理
    next();
  });

// 首頁路由 (http://localhost:8080)
router.get('/', function(req, res) {
  res.send('home page!');
});

// 另一張網頁路由 (http://localhost:8080/about)
router.get('/about', function(req, res) {
  res.send('about page!');
});

// 驗證 :name 的 route middleware
router.param('name', function(req, res, next, name) {

    // 在這裡驗證資料
    // ... ... ...
  
    // 顯示驗證訊息
    console.log('doing name validations on ' + name);
  
    // 當驗證成功時，將其儲存至 req
    req.name = name;
  
    // 繼續後續的處理流程
    next();
  });

// 含有參數的路由 (http://localhost:8080/hello/:name)
router.get('/hello/:name', function(req, res) {
    res.send('hello ' + req.params.name + '!');
  });

// 將路由套用至應用程式  
//http://localhost:8080/app/about
app.use('/app', router);

// ---- 啟動伺服器 ----
app.listen(port);