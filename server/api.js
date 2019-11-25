const express = require('express')
const query = require('./query.js')
const app = express()

app.disable('x-powered-by');


const bodyParser = require("body-parser");

// 解析application/json数据
const jsonParser = bodyParser.json();
// 解析application/x-www-form-urlencoded数据
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// 首页数据
app.get('/mainlist', query.queryMainList)

// 查询作品数据
app.get('/workslist', query.queryWorksList)

//资源搜索
app.get('/search', query.querySearch)

// 更新访问量
app.put('/calculate/visits', jsonParser, query.updateVisits)

//资源失效反馈
app.post('/feedback/resource', jsonParser, query.resourceFeedback)

// 404
app.all('/*', query.notFound)

app.listen(8085, () => {
  console.log('listening on port 8085') 
});
