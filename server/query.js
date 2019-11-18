var mysql = require('mysql');
var fs = require('fs');

// 加载mysql验证文件
const sql_config = JSON.parse(fs.readFileSync("./sqlconfig.json"));

const connection = mysql.createConnection(sql_config);

connection.connect();

exports.queryMainList = function(req, res) {

    var data = []
    connection.query('SELECT * FROM t_television limit 400;', function (error, results, fields) {
        if (error != null) {
            console.log(error)
            res.jsonp(reponse(error.code, error.message, []));
        }else {
            var items = []
            for (i in results) {
                var item = results[i]
                item.title = item.name;
                delete item.name;
                items.push(item)
            }
            data.push({
                items: items,
                title: "影视剧集",
                type: 0
            })
            calcCount()
        }
    });
    connection.query('SELECT * FROM t_television_cut limit 100;', function (error, results, fields) {

        if (error != null) {
            console.log(error)
            res.jsonp(reponse(error.code, error.message, []));
        }else {
            data.push({
                items: results,
                title: "影视剪辑",
                type: 1
            })
            calcCount()
        }
        // connection.end()
    });

    var count = 0
    function calcCount() {
        count++
        if (count == 2) {
            res.jsonp(reponse(1, "请求成功", data))

        }
    }

}

exports.notFound = function(req, res) {
    res.jsonp(reponse(404, req.path + ' not found', null))
}





function reponse(code, message, data) {
    return {
        code,
        message,
        data
    }
}
