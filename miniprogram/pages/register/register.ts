// register.ts
Page({
  data: {
    nickname: '',
    phone: '',
    code: '',
    agreedToTerms: false,
    isRegistering: false,
    codeCountdown: 0,
    showTermsDialog: false,
    showPrivacyDialog: false,
    termsContent: '用户协议内容...',
    privacyContent: '隐私政策内容...'
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

  get canRegister(): boolean {
    return this.data.nickname.trim().length > 0 && 
           this.data.phone.length === 11 && 
           this.data.code.length === 6 && 
           this.data.agreedToTerms;
  },

  // 输入事件
  onNicknameChange(e: any) {
    this.setData({ nickname: e.detail.value });
  },

  onPhoneChange(e: any) {
    this.setData({ phone: e.detail.value });
  },

  onCodeChange(e: any) {
    this.setData({ code: e.detail.value });
  },

  onAgreementChange(e: any) {
    this.setData({ agreedToTerms: e.detail.value });
  },

  // 发送验证码
  async onSendCode() {
    if (!this.canSendCode) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    try {
      const result = await wx.cloud.callFunction({
        name: 'sendSmsCode',
        data: {
          phone: this.data.phone,
          type: 'register'
        }
      });

      const res = result.result as any;
      if (res?.success) {
        wx.showToast({
          title: '验证码已发送',
          icon: 'success'
        });
        this.startCountdown();
      } else {
        wx.showToast({
          title: res?.message || '发送失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      wx.showToast({
        title: '发送验证码失败',
        icon: 'none'
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

  // 注册
  async onRegister() {
    if (!this.canRegister) {
      wx.showToast({
        title: '请完善注册信息',
        icon: 'none'
      });
      return;
    }

    this.setData({ isRegistering: true });

    try {
      const result = await wx.cloud.callFunction({
        name: 'userRegister',
        data: {
          nickname: this.data.nickname.trim(),
          phone: this.data.phone,
          code: this.data.code
        }
      });

      const res = result.result as any;
      if (res?.success) {
        wx.showToast({
          title: '注册成功',
          icon: 'success'
        });

        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      } else {
        wx.showToast({
          title: res?.message || '注册失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('注册失败:', error);
      wx.showToast({
        title: '注册失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ isRegistering: false });
    }
  },

  // 显示用户协议
  onShowTerms() {
    this.setData({ showTermsDialog: true });
  },

  // 显示隐私政策
  onShowPrivacy() {
    this.setData({ showPrivacyDialog: true });
  },

  // 关闭弹窗
  onCloseTerms() {
    this.setData({ showTermsDialog: false });
  },

  onClosePrivacy() {
    this.setData({ showPrivacyDialog: false });
  },

  // 跳转到登录页面
  onGoToLogin() {
    wx.navigateBack();
  }
}); 