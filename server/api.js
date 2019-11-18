const express = require('express')
const query = require('./query.js')
const app = express()

// 首页数据
app.get('/mainlist', query.queryMainList)


// 404
app.get('/*', query.notFound)

app.listen(8085, () => {
  console.log('listening on port 8085') 
});
