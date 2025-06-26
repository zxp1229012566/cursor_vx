Page({
  data: {
    notify: true
  },
  onEditProfile() {
    wx.showToast({ title: '修改资料', icon: 'none' });
  },
  onPay() {
    wx.showToast({ title: '微信支付', icon: 'success' });
  },
  onNotifyChange(e) {
    this.setData({ notify: e.detail.checked });
  },
  onEditPhone() {
    wx.showToast({ title: '修改手机号', icon: 'none' });
  },
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '已退出', icon: 'success' });
        }
      }
    });
  }
}); 