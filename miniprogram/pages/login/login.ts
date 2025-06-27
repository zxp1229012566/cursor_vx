// login.ts
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    phone: '',
    code: '',
    isLogging: false,
    codeCountdown: 0,
    showPrivacyDialog: false,
    userInfo: null as any,
  },

  onLoad() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'protestfirst-3gb7940f4627cb8a',
        traceUser: true,
      });
    }
  },

  // 计算属性
  get canSendCode(): boolean {
    return this.data.phone.length === 11 && /^1[3-9]\d{9}$/.test(this.data.phone);
  },

  get canLogin(): boolean {
    return this.data.phone.length === 11 && this.data.code.length === 6;
  },

  // 手机号输入
  onPhoneChange(e: any) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 验证码输入
  onCodeChange(e: any) {
    this.setData({
      code: e.detail.value
    });
  },

  // 发送验证码
  async onSendCode() {
    if (!this.canSendCode) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请输入正确的手机号',
        theme: 'warning'
      });
      return;
    }

    try {
      // 调用云函数发送验证码
      const result = await wx.cloud.callFunction({
        name: 'sendSmsCode',
        data: {
          phone: this.data.phone
        }
      });

      if (result.result.success) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '验证码已发送',
          theme: 'success'
        });

        // 开始倒计时
        this.startCountdown();
      } else {
        Toast({
          context: this,
          selector: '#t-toast',
          message: result.result.message || '发送失败',
          theme: 'error'
        });
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      Toast({
        context: this,
        selector: '#t-toast',
        message: '发送验证码失败',
        theme: 'error'
      });
    }
  },

  // 倒计时
  startCountdown() {
    let countdown = 60;
    this.setData({ codeCountdown: countdown });

    const timer = setInterval(() => {
      countdown--;
      this.setData({ codeCountdown: countdown });

      if (countdown <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  },

  // 手机号登录
  async onLogin() {
    if (!this.canLogin) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请输入完整的登录信息',
        theme: 'warning'
      });
      return;
    }

    this.setData({ isLogging: true });

    try {
      // 调用云函数验证登录
      const result = await wx.cloud.callFunction({
        name: 'userLogin',
        data: {
          phone: this.data.phone,
          code: this.data.code
        }
      });

      if (result.result.success) {
        // 保存用户信息到本地存储
        wx.setStorageSync('userInfo', result.result.userInfo);
        wx.setStorageSync('isLoggedIn', true);

        Toast({
          context: this,
          selector: '#t-toast',
          message: '登录成功',
          theme: 'success'
        });

        // 延迟跳转
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1000);
      } else {
        Toast({
          context: this,
          selector: '#t-toast',
          message: result.result.message || '登录失败',
          theme: 'error'
        });
      }
    } catch (error) {
      console.error('登录失败:', error);
      Toast({
        context: this,
        selector: '#t-toast',
        message: '登录失败，请重试',
        theme: 'error'
      });
    } finally {
      this.setData({ isLogging: false });
    }
  },

  // 微信授权登录
  async onWechatLogin(e: any) {
    if (e.detail.errMsg === 'getUserProfile:ok') {
      this.setData({ 
        userInfo: e.detail.userInfo,
        showPrivacyDialog: true 
      });
    } else {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '授权失败',
        theme: 'error'
      });
    }
  },

  // 同意隐私政策
  async onAgreePrivacy() {
    this.setData({ showPrivacyDialog: false });

    try {
      // 获取微信登录凭证
      const loginRes = await wx.login();
      
      if (loginRes.code) {
        // 调用云函数进行微信登录
        const result = await wx.cloud.callFunction({
          name: 'wechatLogin',
          data: {
            code: loginRes.code,
            userInfo: this.data.userInfo
          }
        });

        if (result.result.success) {
          // 保存用户信息
          wx.setStorageSync('userInfo', result.result.userInfo);
          wx.setStorageSync('isLoggedIn', true);

          Toast({
            context: this,
            selector: '#t-toast',
            message: '登录成功',
            theme: 'success'
          });

          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 1000);
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: result.result.message || '登录失败',
            theme: 'error'
          });
        }
      }
    } catch (error) {
      console.error('微信登录失败:', error);
      Toast({
        context: this,
        selector: '#t-toast',
        message: '微信登录失败',
        theme: 'error'
      });
    }
  },

  // 拒绝隐私政策
  onRejectPrivacy() {
    this.setData({ showPrivacyDialog: false });
  },

  // 跳转到注册页面
  onGoToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
}); 