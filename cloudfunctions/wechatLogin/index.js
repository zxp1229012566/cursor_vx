// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'protestfirst-3gb7940f4627cb8a'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { code, userInfo } = event
  const wxContext = cloud.getWXContext()

  try {
    // 查找或创建用户
    let userResult = await db.collection('users')
      .where({
        openid: wxContext.OPENID
      })
      .get()

    let userData
    if (userResult.data.length === 0) {
      // 创建新用户
      const createResult = await db.collection('users').add({
        data: {
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          openid: wxContext.OPENID,
          unionid: wxContext.UNIONID || '',
          phone: '',
          createTime: new Date(),
          lastLoginTime: new Date(),
          points: 10, // 新用户赠送10积分
          loginType: 'wechat'
        }
      })
      
      userData = {
        _id: createResult._id,
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl,
        phone: '',
        points: 10
      }
    } else {
      // 更新用户信息和最后登录时间
      userData = userResult.data[0]
      await db.collection('users').doc(userData._id).update({
        data: {
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          lastLoginTime: new Date()
        }
      })
      
      userData.nickname = userInfo.nickName
      userData.avatar = userInfo.avatarUrl
    }

    return {
      success: true,
      message: '登录成功',
      userInfo: {
        id: userData._id,
        nickname: userData.nickname,
        avatar: userData.avatar,
        phone: userData.phone,
        points: userData.points,
        openid: wxContext.OPENID
      }
    }
  } catch (error) {
    console.error('微信登录失败:', error)
    return {
      success: false,
      message: '微信登录失败'
    }
  }
} 