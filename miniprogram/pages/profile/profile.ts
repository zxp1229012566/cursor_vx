Page({
  data: {
    rechargePackages: [
      { point: 10, price: 6 },
      { point: 30, price: 16 },
      { point: 100, price: 48 },
    ],
    notifyPush: true,
  },
  onRechargeSelect(e: any) {
    const idx = e.currentTarget.dataset.index;
    wx.showToast({ title: `选择了${this.data.rechargePackages[idx].point}积分`, icon: 'none' });
  },
  onNotifyChange(e: any) {
    this.setData({ notifyPush: e.detail.checked });
  },
  onModifyPhone() {
    wx.showToast({ title: '修改手机号', icon: 'none' });
  },
  onLogout() {
    wx.showModal({ title: '提示', content: '确定要退出登录吗？', success: (res) => {
      if (res.confirm) {
        wx.showToast({ title: '已退出', icon: 'none' });
      }
    }});
  },
  onHelp() {
    wx.navigateTo({ url: '/pages/help/help' });
  },
}); 