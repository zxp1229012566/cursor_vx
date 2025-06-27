// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'protestfirst-3gb7940f4627cb8a'
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { phone, code } = event
  const wxContext = cloud.getWXContext()

  try {
    // 验证验证码
    const codeResult = await db.collection('sms_codes')
      .where({
        phone,
        code,
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

    // 标记验证码为已使用
    await db.collection('sms_codes').doc(codeResult.data[0]._id).update({
      data: {
        used: true,
        useTime: new Date()
      }
    })

    // 查找或创建用户
    let userResult = await db.collection('users')
      .where({
        phone
      })
      .get()

    let userInfo
    if (userResult.data.length === 0) {
      // 创建新用户
      const createResult = await db.collection('users').add({
        data: {
          phone,
          nickname: `用户${phone.substr(-4)}`,
          avatar: '',
          openid: wxContext.OPENID,
          createTime: new Date(),
          lastLoginTime: new Date(),
          points: 10 // 新用户赠送10积分
        }
      })
      
      userInfo = {
        _id: createResult._id,
        phone,
        nickname: `用户${phone.substr(-4)}`,
        avatar: '',
        points: 10
      }
    } else {
      // 更新最后登录时间
      userInfo = userResult.data[0]
      await db.collection('users').doc(userInfo._id).update({
        data: {
          lastLoginTime: new Date()
        }
      })
    }

    return {
      success: true,
      message: '登录成功',
      userInfo: {
        id: userInfo._id,
        phone: userInfo.phone,
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        points: userInfo.points
      }
    }
  } catch (error) {
    console.error('登录失败:', error)
    return {
      success: false,
      message: '登录失败'
    }
  }
} 