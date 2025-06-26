Page({
  data: {
    loading: true,
    showResult: false,
    effectImg: '/static/hair1.png'
  },
  onLoad() {
    setTimeout(() => {
      this.setData({
        loading: false,
        showResult: true
      });
    }, 2000);
  },
  onSave() {
    wx.showToast({ title: '已保存', icon: 'success' });
  },
  onBack() {
    wx.navigateBack();
  }
}); 