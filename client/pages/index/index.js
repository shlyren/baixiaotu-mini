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
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/works/works?type=${type}`,
    })
  },
  onItemClick: function (e) {
    const { type, index } = e.currentTarget.dataset
    const item = this.data.mainData[type].items[index]
    wx.navigateTo({
      url: '/pages/particulars/particulars',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { item })
      }
    })
  },
  jumpToAbout: function() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  // 加载首页主要数据
  loadMainData: function(callback) {
    wx.hud.loading()
    wx.request({
      url: 'https://api-cc.yuxiang.ren/mainlist',
      method: 'GET',
      success: function(res) {
        if (typeof callback == "function") {
          const { data: { data: mainData } } = res
          wx.hud.hide()
          callback(mainData)
        }
      },
      fail: function(res) {
        wx.hud.error("加载失败")
      },
    })
  },
  handleMainData: function (mainData) {
    this.setData({ mainData})
  }
})
