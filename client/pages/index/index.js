//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  // 页面加载完成后
  onLoad: function () {
    this.loadMainData(this.handleMainData);
  },
  onSearchClick: function (e) {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  onShowMore: function(e) {
    console.log(e)
  },
  // 加载首页主要数据
  loadMainData: function(callback) {
    wx.request({
      url: 'https://api-cc.yuxiang.ren/mainlist',
      method: 'GET',
      success: function(res) {
        if (typeof callback == "function") {
          const { data: { data: mainData } } = res
          callback(mainData)
        }
      },
      fail: function(res) {
        console.log(res)
      },
    })
  },
  handleMainData: function (mainData) {
    this.setData({ mainData})
  }
})
