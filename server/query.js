const MySQLManager = require('./MySQLManager');
const mysqlManager = new MySQLManager();
// mysql tables 
const tables = ['t_television', 't_television_cut']

const SUCCESS_CODE = 200; // 成功
const SQL_ERROR_CODE = 0; // 数据库错误
const API_ERROR_CODE = -1; // 请求错误


// 查询首页数据
function queryMainList(_, res) {
    
    mysqlManager.query('SELECT * FROM t_television order by visits_count desc limit 6;',  (error, results) => {
        if (error) {
            res.jsonp(reponse(SQL_ERROR_CODE, error.code, null));
            return;
        }
        const data_0 = {
            title: "影视剧集",
            type: 0,
            items: results,
        }
        mysqlManager.query('SELECT * FROM t_television_cut order by visits_count desc limit 6;', (error, results) => {
            if (error) {
                res.jsonp(reponse(SQL_ERROR_CODE, error.code, null));
                return;
            }
            const data_1 = {
                title: "影视剪辑",
                type: 1,
                items: results,
            }
            res.jsonp(reponse(SUCCESS_CODE, "请求成功", [data_0, data_1]))
        })
    })

}


/**
 * 查询作品
 */
function queryWorksList(req, res) {

    const { type } = req.query;
    const tableName  = tables[type]
    if (!type || !tableName) {
        res.jsonp(reponse(API_ERROR_CODE, "无效的参数", null))
        return;
    }

    mysqlManager.query(`SELECT * FROM ${tableName} order by visits_count desc;`, (error, results) => {
        if (error) {
            res.jsonp(reponse(SQL_ERROR_CODE, error.code, null));
        }else {
            res.jsonp(reponse(SUCCESS_CODE, "请求成功", results));
        }
    })
}

// 更新访问量
function updateVisits(req, res) {
    const { id, type } = req.body;
    const tableName  = tables[type]

    if( id == undefined || type == undefined || !tableName) {
        res.jsonp(reponse(API_ERROR_CODE, '参数无效', null))
        return
    }
    
    const sql = `UPDATE ${tableName} SET visits_count = (SELECT visits_count FROM (SELECT visits_count FROM ${tableName} WHERE id = ${id} ) as T ) + 1 WHERE id = ${id};`
    mysqlManager.query(sql, (error, results) => {
        if (error) {
            res.jsonp(reponse(SQL_ERROR_CODE, error.code, null))
        }else {
            res.jsonp(reponse(SUCCESS_CODE, '操作成功', {
                id,
                type,
                results
            }))
        }
    })
}

// 资源反馈
function resourceFeedback(req, res) {

    const { name, resour_id, type, message, baidu_link, bili_link, mail } = req.body;

    if (resour_id == undefined || type == undefined || !tables[type]) {
        res.jsonp(reponse(API_ERROR_CODE, '无效的参数', null))
        return;
    }

    const sql =  `INSERT INTO t_television_link ( name, type, resour_id, message, baidu_link, bili_link, mail ) 
                  VALUES 
                  ('${name}', ${type}, ${ resour_id }, '${ message }', '${ baidu_link }', '${ bili_link }', '${ mail }');`
            
    mysqlManager.query(sql, (error, results) => {
        if (error) {
            res.jsonp(reponse(SQL_ERROR_CODE, error.code, null))
        }else {
            res.jsonp(reponse(SUCCESS_CODE, '提交成功', results))
        } 
    })
}
/**
 *  搜索
 *  
 *  @param name 关键字
 *  @param pageNum 页码，第一页为1
 *  @param pageSize 每页数量，默认10
 *  @param order 排序方式.
 */
function querySearch(req, res) {
    
    const query = req.query 

    const name =  query.name || '';
    const pageNum = parseInt(query.pageNum) || 1;
    const pageSize = parseInt(query.pageSize) || 10;

    const start = (pageNum - 1) * pageSize

    const sql = `SELECT * FROM t_television WHERE title like '%${name}%' UNION
                 SELECT * FROM t_television_cut WHERE title like '%${name}%' ORDER BY visits_count desc limit ${start},${pageSize};`

    console.log(sql)

    mysqlManager.query(sql, (error, results) => {
        if (error) {
            res.jsonp(reponse(SQL_ERROR_CODE, error.code, null))
        }else {
            res.jsonp(reponse(SUCCESS_CODE, '查询成功', {
                pageNum,
                pageSize,
                name,
                result: results
            }))
        }
    })
}

// 404
function notFound(req, res) {
    res.jsonp(reponse(404, req.path + ' not found', null))
}


function reponse(code, message, data) {
    return { code, message, data }
}

module.exports = {
    queryMainList,
    queryWorksList,
    updateVisits,
    resourceFeedback,
    querySearch,
    notFound,
    SUCCESS_CODE,
    SQL_ERROR_CODE,
    API_ERROR_CODE
}