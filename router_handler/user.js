/* 
路由处理函数
*/

//导入数据库操作模块
const db = require('../db/index')

//导入bcryptjs模块，用于对密码加密
const bcrypt = require('bcryptjs')


//注册新用户路由处理函数
exports.regUser = (req,res) => {
    //接收表单数据
    const userinfo = req.body
    //判断数据是否合法
    if(!userinfo.username || !userinfo.password){
        return res.send({status:1,message:'用户名或密码不能为空'})
    }

    //定义sql语句
    const sql1 = 'select * from ev_user where username=?'
    db.query(sql1,userinfo.username,(err,results) =>{
        //执行sql语句失败
        if(err){
            return res.send({status:1,message:err.message})
        }

        //用户名被占用
        if(results.length > 0){
            return res.send({status:1,message:'用户名被占用，请使用其他用户名！'})
        }
    })

    //对密码进行加密,返回值是加密后的字符串
    userinfo.password = bcrypt.hashSync(userinfo.password,10)


    //定义增加用户的sql
    const sql2 = 'insert into ev_user set ?'

    //增加用户
    db.query(sql2,{username:userinfo.username,password:userinfo.password},(err,results) =>{
        //执行sql语句失败
        if(err){
            return res.send({status:1,message:err.message})
        }
        //执行sql语句成功，但是影响行数不为一
        if(results.affectedRows !==1){
            return res.send({status:1,message:'注册用户失败，请稍后再试！'})
        }

        //注册成功
        res.send({status:0,message:'注册成功'})
    })
    
}

//登录路由处理函数
exports.login = (req,res) =>{
    res.send('login ok')
}

