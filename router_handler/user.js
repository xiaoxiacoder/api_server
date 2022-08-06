/* 
路由处理函数
*/

//导入数据库操作模块
const db = require('../db/index')

//导入bcryptjs模块，用于对密码加密
const bcrypt = require('bcryptjs')

//导入config
const config = require('../config')
//导入jsonwebtoken
const jwt = require('jsonwebtoken')



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
    //接收表单的数据
    const userinfo = req.body
    console.log(userinfo);
    //定义sql语句
    const sql1 = 'select * from ev_user where username=?'
    //执行sql语句
    db.query(sql1,userinfo.username,(err,results) =>{
        //执行sql语句错误
        if(err) return res.cc(err)
        //执行sql语句成功，但是查询数据条数不等于1
        if(results.length !== 1) return res.cc('登录失败')
        //执行成功，判断用户登录密码是否一致
        //调用bcrypt.compareSync(用户提交的密码，数据库中的密码)比较是否一致
        //返回值为布尔，true为一致
        const compareResult = bcrypt.compareSync(userinfo.password,results[0].password)//results是数组
        //不一致的情况
        if(!compareResult){
            return res.cc('登录失败，请检查用户名与密吗码')
        }
        //一致的情况，登录成功
        //接下来生成JWT的token字符串
        //es6语法，剔除password和用户头像
        const user = {...results[0],password:'',user_pic:''}
        //生成token字符串
        const tokenStr = jwt.sign(user,config.jwtSecretkey,{
            expiresIn:'10h'})//token有效期10小时

        //响应给客户端
        res.send({
            status:0,
            message:'登陆成功',
            //需要Bearer前缀
            token:'Bearer '+tokenStr,

        })

    })
}

