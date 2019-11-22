const MySQLPool = require('./MySQLPool');
const pool = new MySQLPool().getPool();
const tables = ['t_television', 't_television_cut']

const SUCCESS_CODE = 200; // 成功
const SQL_ERROR_CODE = 0; // 数据库错误
const API_ERROR_CODE = -1; // 请求错误

// 查询首页数据
exports.queryMainList = function(req, res) {

    var data = []

    pool.getConnection(function (error, connection) {
        if (error) {
            res.jsonp(reponse(SQL_ERROR_CODE, error.code, null));

            connection.release();
            return;
        }
        connection.query('SELECT * FROM t_television order by visits_count desc limit 6;', function (error, results, fields) {
            if (error != null) {
                res.jsonp(reponse(SQL_ERROR_CODE, error.code, []));
            }else {
                data[0] = {
                    title: "影视剧集",
                    type: 0,
                    items: results,
                }
                calcCount()
            }
        });
    
        connection.query('SELECT * FROM t_television_cut order by visits_count desc limit 6;', function (error, results, fields) {
    
            if (error != null) {
                res.jsonp(reponse(SQL_ERROR_CODE, error.code, []));
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
                res.jsonp(reponse(SUCCESS_CODE, "请求成功", data))
            }
        }
        connection.release();
    })
}


/**
 * 查询作品
 */
exports.queryWorksList = function(req, res) {

    const { type } = req.query;
    if (!type) {
        res.jsonp(reponse(API_ERROR_CODE, "缺少 type 参数", null))
        return;
    }

    pool.getConnection(function(error, connection) {
        if (error) {
            res.jsonp(reponse(SQL_ERROR_CODE, error.code, []));
            connection.release();
            return
        }
        
        const tableName  = tables[type]
        if (!tableName) {
            res.jsonp(reponse(SUCCESS_CODE, "请求成功", []))
            connection.release();
            return;
        }
        connection.query(`SELECT * FROM ${tableName} order by visits_count desc;`, function (error, results, fields) {
    
            if (error != null) {
                res.jsonp(reponse(SQL_ERROR_CODE, error.code, null));
                return;
            }
            res.jsonp(reponse(SUCCESS_CODE, "请求成功", results));
        });

        connection.release();
    })
}

// 更新访问量
exports.updateVisits = function (req, res) {
    const { id, type } = req.query;
    console.log(req.query)
    if( id == undefined || type == undefined || !tables[type] ) {
        res.jsonp(reponse(API_ERROR_CODE, '参数无效', null))
        return;
    }

    pool.getConnection(function(error, connection) {
        if (error) {
            res.jsonp(reponse(SQL_ERROR_CODE, error.code, null));
            connection.release();
            return
        }
        
        let tableName  = tables[type]
        if (!tableName) {
            res.jsonp(reponse(SQL_ERROR_CODE, "查询不到表", null))
            connection.release();
            return;
        }
        //UPDATE t_television SET visits_count = (SELECT visits_count FROM (SELECT visits_count FROM t_television WHERE id = 1 ) as T ) + 1 WHERE id = 1;
        const sql = `UPDATE ${tableName} SET visits_count = (SELECT visits_count FROM (SELECT visits_count FROM ${tableName} WHERE id = ${id} ) as T ) + 1 WHERE id = ${id};`
        console.log(sql)
        connection.query(sql, function (error, results, fields) {
            if (error) {
                res.jsonp(reponse(SQL_ERROR_CODE, error.code, null))
                return;
            }
            res.jsonp(reponse(SUCCESS_CODE, '操作成功', {
                id,
                type,
                results
            }))

        });

        connection.release();
    })
}

// 资源反馈
exports.resourceFeedback = function(req, res) {

    const { name, resour_id, type, message, baidu_link, bili_link, mail } = req.body;

    if (resour_id == undefined || type == undefined || !tables[type]) {
        res.jsonp(reponse(API_ERROR_CODE, '无效的参数', null))
        return;
    }

    pool.getConnection(function(error, connection) {
        if (error) {
            res.jsonp(reponse(SQL_ERROR_CODE, error.code, null));

            connection.release();
            return
        }

        connection.query(`INSERT INTO t_television_link 
                        ( name, type, resour_id, message, baidu_link, bili_link, mail ) VALUES 
                        ('${name}', ${type}, ${ resour_id }, '${ message }', '${ baidu_link }', '${ bili_link }', '${ mail }');`, function (error, results, fields) {
            if (error) {
                res.jsonp(reponse(SQL_ERROR_CODE, error.code, null))
                return;
            }
            res.jsonp(reponse(SUCCESS_CODE, '提交成功', null))
        });


        connection.release();
    })
}

// s
/**
 *  搜索
 *  @param
 *  name: 关键字
 *  pageNum: 页码，第一页为1
 *  pageSize: 每页数量，默认10
 *  order: 排序方式.
 */
exports.querySearch = function(req, res) {
    
    const query = req.query 

    const name =  query.name || '';
    const pageNum = parseInt(query.pageNum) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    
    pool.getConnection(function(error, connection) {
        if (error) {
            res.jsonp(reponse(SQL_ERROR_CODE, error.code, null));
            connection.release();
            return
        }
        
        const start = (pageNum - 1) * pageSize

        const sql = 'SELECT * FROM t_television UNION ' +
                    `SELECT * FROM t_television_cut WHERE title like '%${name}%' ORDER BY visits_count desc limit ${start},${pageSize};`

        console.log(sql)

        connection.query(sql, function (error, results, fields) {

            if (error) {
                res.jsonp(reponse(SQL_ERROR_CODE, error.code, null))
                return;
            }
            const data = {
                pageNum,
                pageSize,
                name,
                result: results
            }
            console.log(`查询结果：${results.length}`)
            res.jsonp(reponse(SUCCESS_CODE, '查询成功', data))
            
        });
        connection.release();
    })

}

// 404
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
