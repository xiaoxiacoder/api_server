/* 
数据库模块
*/

//导入数据库模块
const mysql = require('mysql')

//创建数据路连接对象
const db = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'111111',
    database:'db_1',
})

//向外共享连接对象
module.exports = db