// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

interface Template {
  id: string;
  name: string;
  image: string;
}

interface UploadFile {
  url: string;
  name: string;
  type: string;
  size: number;
}

type ViewType = 'front' | 'side' | 'back';

interface ResultImages {
  front: string;
  side: string;
  back: string;
}

Page({
  data: {
    // 上传相关
    uploadFiles: [] as UploadFile[],
    hasUploadedImage: false,
    uploadConfig: {
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    },
    
    // 发型模板相关
    gender: 'male' as 'male' | 'female',
    selectedTemplateId: '',
    templates: [
      { id: 'male-1', name: '短发1', image: '/static/hair1.png' },
      { id: 'male-2', name: '短发2', image: '/static/hair2.png' },
      { id: 'male-3', name: '短发3', image: '/static/hair3.png' },
    ] as Template[],
    femaleTemplates: [
      { id: 'female-1', name: '长发1', image: '/static/hair1.png' },
      { id: 'female-2', name: '长发2', image: '/static/hair2.png' },
      { id: 'female-3', name: '长发3', image: '/static/hair3.png' },
    ] as Template[],
    
    // 效果图相关
    showResult: false,
    currentView: 'front' as ViewType,
    resultImages: {
      front: '',
      side: '',
      back: ''
    } as ResultImages,
    
    // 生成相关
    isGenerating: false,
    canGenerate: false,
    
    // 用户相关
    userPoints: 10,
    showPointsDialog: false,
  },
  
  onLoad() {
    // 加载用户数据
    this.loadUserData();
  },
  
  loadUserData() {
    // 模拟从服务器获取用户数据
    // 实际项目中应该调用API获取用户数据
    setTimeout(() => {
      this.setData({
        userPoints: 10
      });
    }, 500);
  },
  
  // 上传照片相关方法
  onUploadSuccess(e: any) {
    console.log('上传成功', e.detail.files);
    
    this.setData({ 
      uploadFiles: e.detail.files,
      hasUploadedImage: true,
      canGenerate: this.data.selectedTemplateId !== ''
    });
    
    wx.showToast({
      title: '上传成功',
      icon: 'success'
    });
  },
  
  onUploadFail(e: any) {
    console.error('上传失败', e);
    wx.showToast({ 
      title: '上传失败，请重试', 
      icon: 'none' 
    });
  },
  
  onUploadRemove() {
    this.setData({ 
      uploadFiles: [],
      hasUploadedImage: false,
      canGenerate: false,
      showResult: false
    });
  },
  
  previewImage() {
    if (this.data.uploadFiles.length > 0 && this.data.uploadFiles[0].url) {
      wx.previewImage({
        urls: [this.data.uploadFiles[0].url]
      });
    }
  },
  
  // 模板选择相关方法
  onGenderSwitch(e: any) {
    const gender = e.currentTarget.dataset.gender as 'male' | 'female';
    
    this.setData({
      gender,
      templates: gender === 'male' ? this.data.templates : this.data.femaleTemplates,
      selectedTemplateId: '',
      canGenerate: false,
      showResult: false
    });
  },
  
  onSelectTemplate(e: any) {
    const id = e.currentTarget.dataset.id;
    
    this.setData({
      selectedTemplateId: id,
      canGenerate: this.data.hasUploadedImage
    });
  },
  
  // 效果图相关方法
  onViewChange(e: any) {
    const view = e.detail.value as ViewType;
    this.setData({
      currentView: view
    });
  },
  
  previewResultImage() {
    if (this.data.showResult) {
      const view = this.data.currentView;
      const url = this.data.resultImages[view];
      if (url) {
        wx.previewImage({
          urls: [url]
        });
      }
    }
  },
  
  onSaveImage() {
    if (!this.data.showResult) return;
    
    wx.showLoading({ title: '保存中...' });
    
    // 模拟保存图片
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '图片已保存到相册',
        icon: 'success'
      });
    }, 1500);
  },
  
  // 生成效果图
  onGenerate() {
    // 检查是否已上传照片和选择模板
    if (!this.data.hasUploadedImage) {
      wx.showToast({ title: '请先上传您的照片', icon: 'none' });
      return;
    }
    
    if (!this.data.selectedTemplateId) {
      wx.showToast({ title: '请选择一个发型模板', icon: 'none' });
      return;
    }
    
    // 检查积分是否足够
    if (this.data.userPoints <= 0) {
      this.setData({ showPointsDialog: true });
      return;
    }
    
    // 开始生成效果图
    this.setData({ isGenerating: true });
    
    // 模拟生成过程
    setTimeout(() => {
      // 获取选中的模板
      let selectedTemplate: Template | null = null;
      const templates = this.data.gender === 'male' ? this.data.templates : this.data.femaleTemplates;
      
      for (const template of templates) {
        if (template.id === this.data.selectedTemplateId) {
          selectedTemplate = template;
          break;
        }
      }
      
      if (!selectedTemplate) return;
      
      // 生成完成后，更新效果图和积分
      this.setData({
        isGenerating: false,
        showResult: true,
        userPoints: this.data.userPoints - 1,
        resultImages: {
          front: selectedTemplate.image,
          side: '/static/hair2.png',
          back: '/static/hair3.png',
        },
        currentView: 'front'
      });
      
      wx.showToast({ title: '效果图生成成功', icon: 'success' });
    }, 2000);
  },
  
  // 积分相关方法
  onClosePointsDialog() {
    this.setData({ showPointsDialog: false });
  },
  
  onGoToRecharge() {
    this.setData({ showPointsDialog: false });
    wx.navigateTo({ url: '/pages/recharge/recharge' });
  }
})

