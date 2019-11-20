// pages/works/works.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onLoadListData(options, this.handleListData)
  },
  onLoadListData: function (options, callback) {
    wx.request({
      url: 'https://api-cc.yuxiang.ren/workslist',
      data: options,
      method: 'GET',
      success: function(res) {
        if (typeof callback == "function") {
          const { data: { data: items } } = res
          callback(items)
        }
      },
      fail: function(res) {
        wx.hud.error("加载失败")
      },
    })
  },
  handleListData: function (items) {
    this.setData({ items})
  },
  onItemClick: function(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.items[index]
    wx.navigateTo({
      url: '/pages/particulars/particulars',
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { item })
      }
    })
  }
})