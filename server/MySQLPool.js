var mysql = require('mysql');
var fs = require('fs');

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
    const sql_config = JSON.parse(fs.readFileSync("./sqlconfig.json"));
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