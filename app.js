//导入express模块
const express = require('express')
//新建服务器实例
const app = express()

//导入cors跨域中间件
const cors = require('cors')
//注册为全局中间件
app.use(cors())

//配置解析application/x-www-form-urlencoded格式的表单数据中间件
app.use(express.urlencoded({extended:false}))

//响应数据的全局中间件
app.use((req,res,next) =>{
    //status=0为成功，status=1为失败，默认将status设置为1
    res.cc = (err,status=1) =>{
        res.send({
            //状态
            status,
            //状态描述,判断err是错误对象还是字符串
            message:err instanceof Error ? err.message:err,
        })
    }
    next()
})


//导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api',userRouter)


const joi = require('joi')

//全局错误中间件
app.use((err,req,res,next) => {
    //数据验证失败
    if(err instanceof joi.ValidationError) return res.cc(err)
    //未知错误
    res.cc(err)
})


//调用listen方法，指定端口号并启动服务器
app.listen(3007,function(){
    console.log('api server running at http://127.0.0.1:3007')
})