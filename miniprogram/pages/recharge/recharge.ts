Page({
  data: {
    rechargeList: [
      { amount: 10, price: 6 },
      { amount: 30, price: 16 },
      { amount: 100, price: 48 }
    ],
    selected: 0
  },
  onSelect(e) {
    this.setData({ selected: e.currentTarget.dataset.index });
  },
  onPay() {
    wx.showToast({ title: '微信支付', icon: 'success' });
  }
}); 