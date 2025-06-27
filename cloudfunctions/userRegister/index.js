// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'protestfirst-3gb7940f4627cb8a'
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { nickname, phone, code } = event
  const wxContext = cloud.getWXContext()

  try {
    // 验证验证码
    const codeResult = await db.collection('sms_codes')
      .where({
        phone,
        code,
        type: 'register',
        used: false,
        expireTime: _.gt(new Date())
      })
      .orderBy('createTime', 'desc')
      .limit(1)
      .get()

    if (codeResult.data.length === 0) {
      return {
        success: false,
        message: '验证码无效或已过期'
      }
    }

    // 检查手机号是否已注册
    const existUser = await db.collection('users')
      .where({
        phone
      })
      .get()

    if (existUser.data.length > 0) {
      return {
        success: false,
        message: '该手机号已注册'
      }
    }

    // 标记验证码为已使用
    await db.collection('sms_codes').doc(codeResult.data[0]._id).update({
      data: {
        used: true,
        useTime: new Date()
      }
    })

    // 创建新用户
    const createResult = await db.collection('users').add({
      data: {
        nickname,
        phone,
        avatar: '',
        openid: wxContext.OPENID,
        createTime: new Date(),
        lastLoginTime: new Date(),
        points: 10 // 新用户赠送10积分
      }
    })

    return {
      success: true,
      message: '注册成功',
      userInfo: {
        id: createResult._id,
        nickname,
        phone,
        avatar: '',
        points: 10
      }
    }
  } catch (error) {
    console.error('注册失败:', error)
    return {
      success: false,
      message: '注册失败'
    }
  }
} 