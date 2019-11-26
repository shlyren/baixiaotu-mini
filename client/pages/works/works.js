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
  onLoad: function(options) {
    
    const title = options.type == 0 ? '影视剧集' : '影视剪辑剪辑';

    wx.setNavigationBarTitle({
      title: `全部作品 - ${ title }`,
    })
    this.setData({ type: options.type })
    this.onPullDownRefresh()
  },
  onPullDownRefresh: function() {
    const self = this;
    this.onLoadListData({type: this.data.type}, items => {
      self.setData({ items })
    })
  },
  onLoadListData: function (options, callback) {
    wx.hud.loading()
    wx.request({
      url: wx.url('workslist'),
      data: options,
      method: 'GET',
      success: function(res) {
        
        const { data: items, code, message } = res.data
        
        if (code != 200) {
          wx.hud.error(message)
        } else {
          wx.hud.hide()
          callback(items)
        }
      },
      fail: function(res) {
        wx.hud.error("加载失败")
      },
      complete: function() {
        wx.stopPullDownRefresh()
      }
    })
  },
  onItemClick: function(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.items[index]
    wx.navigateTo({
      url: '/pages/particulars/particulars',
      success: function(res) {
        res.eventChannel.emit('data', item)
      }
    })
  }
})