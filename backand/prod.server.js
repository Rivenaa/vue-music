const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const csrf = require('xsrf')
const registerRouter = require('./router')

const port = process.env.PORT || 9002

const app = express()

const csrfProtection = csrf({
  cookie: true,
  ignoreMethods: ['HEAD', 'OPTIONS'],
  checkPathReg: /^\/api/
})
app.use(cookieParser())
app.use(csrfProtection)

app.get('/', function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  return next()
})

registerRouter(app)

app.use(compression())

app.use(express.static('./dist'))

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next()
  }

  // handle CSRF token errors here
  res.status(403)
  res.send(
    '<p>接口已经被我用 CSRF 保护了，请参考课程用自己的服务器代理接口</p><p>如果你还未购买课程并想学习课程的话，请去慕课网购买<a href="https://coding.imooc.com/class/107.html">正版课程</a>，不仅可以学到很多硬货知识，更有机会加我微信喔~</p><p>课程项目<a href="http://ustbhuangyi.com/music">体验地址</a>'
  )
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
