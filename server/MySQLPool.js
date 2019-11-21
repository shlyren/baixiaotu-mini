var mysql = require('mysql');
var fs = require('fs');
const os = require('os');

function MySQLPool() {
    this.flag = true;

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
        sql_config = JSON.parse(fs.readFileSync("./sqlconfig.json"));
    }else if (osName === 'Linux') { // Linux
        sql_config = JSON.parse(fs.readFileSync("/root/swift/baixiaotu.json")).mysql;
    }else { // windows
        console.log('请配置Mysql数据')
        return;
    }
    
    this.pool = mysql.createPool(sql_config)

    this.getPool = function() {
        if (this.flag) {
            this.pool.on('connection', function(connection) {
                connection.query("SET SESSION auto_increment_increment=1");
                this.flag = false;
            })
        }
        return this.pool
    }
}

module.exports = MySQLPool;