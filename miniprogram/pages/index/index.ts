// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    tab: 'home',
    showDialog: false,
    uploadFiles: [],
    dialogUploadFiles: [],
    showEffect: false,
    effectImages: {
      front: 'https://via.placeholder.com/80x100?text=正面',
      side: 'https://via.placeholder.com/80x100?text=侧面',
      back: 'https://via.placeholder.com/80x100?text=背面',
    },
    modelImages: [
      '/static/hair1.png',
      '/static/hair2.png',
      '/static/hair3.png',
    ],
    rechargePackages: [
      { point: 10, price: 6 },
      { point: 30, price: 16 },
      { point: 100, price: 48 },
    ],
    notifyPush: true,
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    files: [],
    showEffect: false,
    effectFront: '',
    effectSide: '',
    effectBack: '',
    modelList: [
      '/static/hair1.png',
      '/static/hair2.png',
      '/static/hair3.png'
    ],
    activeTab: 'home',
    showEffectDialog: false
  },
  methods: {
    // 事件处理函数
    bindViewTap() {
      wx.navigateTo({
        url: '../logs/logs',
      })
    },
    onChooseAvatar(e: any) {
      const { avatarUrl } = e.detail
      const { nickName } = this.data.userInfo
      this.setData({
        "userInfo.avatarUrl": avatarUrl,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    onInputChange(e: any) {
      const nickName = e.detail.value
      const { avatarUrl } = this.data.userInfo
      this.setData({
        "userInfo.nickName": nickName,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    getUserProfile() {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    },
<<<<<<< HEAD
    onTabbarChange(e: any) {
      const value = e.detail.value;
      if (value === 'plus') {
        this.setData({ showDialog: true });
        return;
      }
      this.setData({ tab: value });
    },
    // 首页上传
    onUploadSuccess(e: any) {
      this.setData({ uploadFiles: e.detail.files, showEffect: true });
      // 可在此处调用后端生成效果图，更新effectImages
    },
    onUploadFail(e: any) {
      wx.showToast({ title: '上传失败', icon: 'none' });
    },
    onUploadRemove(e: any) {
      this.setData({ uploadFiles: [], showEffect: false });
    },
    // 弹窗上传
    onDialogUploadSuccess(e: any) {
      this.setData({ dialogUploadFiles: e.detail.files });
    },
    onDialogUploadFail(e: any) {
      wx.showToast({ title: '上传失败', icon: 'none' });
    },
    onDialogUploadRemove(e: any) {
      this.setData({ dialogUploadFiles: [] });
    },
    // 悬浮+按钮
    onPlusClick() {
      this.setData({ showDialog: true });
    },
    onDialogClose() {
      this.setData({ showDialog: false, dialogUploadFiles: [] });
    },
    // 我的-充值套餐
    onRechargeSelect(e: any) {
      const idx = e.currentTarget.dataset.index;
      wx.showToast({ title: `选择了${this.data.rechargePackages[idx].point}积分`, icon: 'none' });
    },
    // 我的-通知设置
    onNotifyChange(e: any) {
      this.setData({ notifyPush: e.detail.checked });
    },
    // 我的-修改手机号
    onModifyPhone() {
      wx.showToast({ title: '修改手机号', icon: 'none' });
    },
    // 我的-退出登录
    onLogout() {
      wx.showModal({ title: '提示', content: '确定要退出登录吗？', success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '已退出', icon: 'none' });
        }
      }});
    },
    // 我的-帮助
    onHelp() {
      wx.navigateTo({ url: '/pages/help/help' });
    },
    // 我的-关于
    onAbout() {
      wx.navigateTo({ url: '/pages/about/about' });
    },
=======
    switchTab(e) {
      this.setData({ activeTab: e.currentTarget.dataset.tab });
    },
    openEffectDialog() {
      this.setData({ showEffectDialog: true });
    },
    onCloseEffectDialog() {
      this.setData({ showEffectDialog: false });
    },
    onSelect(e) {
      this.setData({ files: e.detail.files });
      // 上传后模拟生成效果图
      this.setData({
        showEffect: true,
        effectFront: '/static/hair1.png',
        effectSide: '/static/hair2.png',
        effectBack: '/static/hair3.png'
      });
    },
    onRemove(e) {
      this.setData({ files: [], showEffect: false });
    },
    onUploadSuccess(e) {
      // 可处理上传成功逻辑
    },
    onUploadFail(e) {
      // 可处理上传失败逻辑
    }
>>>>>>> 18cde87adc841a12d29663b9f8d821e9d6f363e2
  },
})
