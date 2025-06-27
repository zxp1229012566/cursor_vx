// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'protestfirst-3gb7940f4627cb8a'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { phone, type = 'login' } = event
  const wxContext = cloud.getWXContext()

  try {
    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 验证码有效期5分钟
    const expireTime = new Date(Date.now() + 5 * 60 * 1000)
    
    // 保存验证码到数据库
    await db.collection('sms_codes').add({
      data: {
        phone,
        code,
        type,
        expireTime,
        used: false,
        createTime: new Date(),
        openid: wxContext.OPENID
      }
    })
    
    // 这里应该调用真实的短信服务API发送验证码
    // 示例：使用腾讯云短信服务
    // const smsResult = await sendSmsCode(phone, code)
    
    console.log(`验证码已生成: ${phone} - ${code}`)
    
    return {
      success: true,
      message: '验证码发送成功',
      // 开发环境下返回验证码，生产环境请删除
      code: process.env.NODE_ENV === 'development' ? code : undefined
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    return {
      success: false,
      message: '发送验证码失败'
    }
  }
} 