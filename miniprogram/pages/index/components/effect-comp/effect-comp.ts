Component({
  data: {
    loading: true,
    showResult: false,
    effectImg: '/static/hair1.png'
  },
  lifetimes: {
    attached() {
      setTimeout(() => {
        this.setData({
          loading: false,
          showResult: true
        });
      }, 2000);
    }
  },
  methods: {
    onSave() {
      wx.showToast({ title: '已保存', icon: 'success' });
    },
    onBack() {
      this.triggerEvent('close');
    }
  }
}); 