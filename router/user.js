/* 
用户路由模块
*/

const express = require('express')
const router = express.Router()

//导入路由处理函数模块
const userHandler = require('../router_handler/user')

//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')

//导入验证规则对象,解构赋值
const {reg_login_schema} = require('../schema/user')

//注册新用户,把验证表单的中间件声明为局部的，
//数据验证通过后，会把请求流转到后面的路由处理函数
//数据验证失败后，会终止代码的执行，并抛出全局的Error
router.post('/reguser',expressJoi(reg_login_schema),userHandler.regUser)

//登录
router.post('/login',expressJoi(reg_login_schema),userHandler.login)




//共享路由对象
module.exports = router