Page({
  data: {
    notify: true
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