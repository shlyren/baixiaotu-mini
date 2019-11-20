const MySQLPool = require('./MySQLPool');
const pool = new MySQLPool().getPool();
const tables = ['t_television', 't_television_cut']
// 查询首页数据
exports.queryMainList = function(req, res) {

    var data = []

    pool.getConnection(function (error, connection) {
        if (error) {
            res.jsonp(reponse(error.code, error.message, []));
            return;
        }
        connection.query('SELECT * FROM t_television order by visits_count desc limit 6;', function (error, results, fields) {
            if (error != null) {
                res.jsonp(reponse(error.code, error.message, []));
            }else {
                var items = []
                for (i in results) {
                    var item = results[i]
                    item.title = item.name;
                    delete item.name;
                    item.bili_link = item.bilibili_link;
                    delete item.bilibili_link;
                    items.push(item)
                }
                data[0] = {
                    title: "影视剧集",
                    type: 0,
                    items,
                }
                calcCount()
            }
        });
    
        connection.query('SELECT * FROM t_television_cut order by visits_count desc limit 6;', function (error, results, fields) {
    
            if (error != null) {
                res.jsonp(reponse(error.code, error.message, []));
            }else {
                data[1] = {
                    title: "影视剪辑",
                    type: 1,
                    items: results,
                }
                calcCount()
            }
        });
        var count = 0
        function calcCount() {
            count++
            if (count == 2) {
                res.jsonp(reponse(1, "请求成功", data))
                connection.release();
            }
        }
    })
}


/**
 * 查询作品
 */
exports.queryWorksList = function(req, res) {

    const { query: { type } } = req;
    if (!type) {
        res.jsonp(reponse(0, "缺少 type 参数", null))
        return;
    }

    pool.getConnection(function(error, connection) {
        if (error) {
            res.jsonp(reponse(error.code, error.message, []));
            return
        }
        
        let tableName 
        = tables[type]
        if (!tableName) {
            res.jsonp(reponse(1, "请求成功", []))
            return;
        }
        connection.query(`SELECT * FROM ${tableName} order by visits_count desc;`, function (error, results, fields) {
    
            if (error != null) {
                res.jsonp(reponse(error.code, error.message, []));
            }else {
                var items = []
                for (i in results) {
                    var item = results[i]
                    if (!item.title) {
                        item.title = item.name;
                        delete item.name;
                    }
                    if (!item.bili_link) {
                        item.bili_link = item.bilibili_link;
                        delete item.bilibili_link;
                    }

                    items.push(item)
                }

                res.jsonp(reponse(1, "请求成功", items));
            }
        });
    })
}

// 更新访问量
exports.updateVisits = function (req, res) {
    const { body: { id, type } } = req;

    if( id == undefined || type == undefined || !tables[type] ) {
        res.jsonp(reponse(0, '参数无效', null))
        return;
    }

    pool.getConnection(function(error, connection) {
        if (error) {
            res.jsonp(reponse(error.code, error.message, null));
            return
        }
        
        let tableName  = tables[type]
        if (!tableName) {
            res.jsonp(reponse(0, "查询不到表", null))
            return;
        }
        connection.query(`SELECT visits_count FROM ${tableName} where id = '${id}';`, function (error, results, fields) {
            if (error) {
                res.jsonp(reponse(error.code, error.message, null))
                return;
            }
            var { visits_count = 0 } = results[0]
            connection.query(`UPDATE ${tableName} set visits_count = '${++visits_count}' where id = '${id}';`, function (error, results, fields) {
                if (error) {
                    res.jsonp(reponse(error.code, error.message, null))
                    return;
                }
                res.jsonp(reponse(1, '操作成功', {
                    id,
                    type,
                    visits_count
                }))
            });
        });
    })
}

// 资源反馈
exports.resourceFeedback = function(req, res) {

    const { body: {name, id, type, message, baidu_link, bili_link, mail } } = req;

    if( id == undefined || type == undefined || !tables[type] ) {
        res.jsonp(reponse(0, '参数无效', null))
        return;
    }

    pool.getConnection(function(error, connection) {
        if (error) {
            res.jsonp(reponse(error.code, error.message, null));
            return
        }
        
        let tableName  = tables[type]
        if (!tableName) {
            res.jsonp(reponse(0, "查询不到表", null))
            return;
        }
        connection.query(`INSERT INTO ${tableName} 
                        ( name, type, id, message, baidu_link, bili_link, mail ) VALUES 
                        (${name}, ${type}, ${ id }, ${ message }, ${ baidu_link }, ${ bili_link }, ${ mail });`, function (error, results, fields) {
            if (error) {
                res.jsonp(reponse(error.code, error.message, null))
                return;
            }
            res.jsonp(reponse(1, '提交成功成功', null))
        });
    })
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
