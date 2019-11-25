//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  // 页面加载完成后
  onLoad: function () {
    this.onPullDownRefresh()
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
  /**
   * 跳转到关于界面
   */
  jumpToAbout: function() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  /**
   * 下拉回调
   */
  onPullDownRefresh: function() {
    this.loadMainData(mainData => {
      this.setData({ mainData })
    });
  },
  // 加载首页主要数据
  loadMainData: function (callback) {
    wx.hud.loading()
    wx.request({
      url: wx.url('mainlist'),
      method: 'GET',
      success: function (res) {
        wx.hud.hide()
        if (typeof callback == "function") {
          const { data: mainData, code, message } = res.data
          if (code == 200) {
            callback(mainData)
          } else {
            wx.hud.error(message)
          }
        }
      },
      fail: function (res) {
        wx.hud.error(res.errMsg)
      },
      complete: function() {
        wx.stopPullDownRefresh()
      }
    })
  },
})
