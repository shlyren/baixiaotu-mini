var mysql = require('mysql');
var fs = require('fs');
const os = require('os');

function MySQLManager()  {

    /** 加载mysql验证文件
     {
        "host"     : "",
        "user"     : "",
        "password" : "",
        "database" : ""
    }
    */
    const osName = os.type()
    var sql_config;
    // Mac
    if (osName === 'Darwin') {
        sql_config = JSON.parse(fs.readFileSync("/Users/yuxiang/Documents/Developer/WeChat/baixiaotu-mini/sqlconfig.json"));
    }else if (osName === 'Linux') { // Linux
        sql_config = JSON.parse(fs.readFileSync("/root/swift/baixiaotu.json")).mysql;
    }else { // others
        console.log('请配置Mysql数据')
        return;
    }
    
    const pool = mysql.createPool(sql_config)
    pool.on('connection', function(connection) {
        connection.query("SET SESSION auto_increment_increment=1");
    })

    this.query = function(sql, callback) {
        pool.getConnection(function (error, connection) {
            if (error) {
                console.log(error)
                callback(error, null);
            }else {
                connection.query(sql, callback);
            }
            connection.release();
        })
    }
}

module.exports = MySQLManager;