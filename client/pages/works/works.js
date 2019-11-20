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
    const self = this;
    this.onLoadListData(options, items => {
      this.setData({ items })  
    })
  },
  onLoadListData: function (options, callback) {

    wx.request({
      url: 'https://api-cc.yuxiang.ren/workslist',
      data: options,
      method: 'GET',
      success: function(res) {
        
        const { data: items, code, message } = res.data
        
        if (code != 200) {
          wx.hud.error(message)
        } else {
          callback(items)
        }
      },
      fail: function(res) {
        wx.hud.error("加载失败")
      },
    })
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