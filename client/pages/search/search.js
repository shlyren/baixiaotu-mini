// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    loadMore: true,
    noMoreData: false,
    pageNum: 1,
    items: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showInput()
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  // 上拉回调
  onReachBottom: function() {
    if (this.data.noMoreData) {
      return;
    }
    this.setData({
      loadMore: true
    })
    this.onRequestData()
  },
  startSearch: function() {
    this.setData({
      pageNum: 1,
      noMoreData: false,
      items: []
    })
    wx.hud.loading('')
    this.onRequestData()
  },
  onRequestData: function() {
    const { pageNum, inputVal: name } = this.data
    const data = {
      pageNum,
      name,
      pageSize: 10,
      order: 'views'
    } 

    wx.request({
      url: wx.url('search'),
      data: data,
      method: 'GET',
      success: (res) => {
        const { data: resultData, code, message } = res.data;
        if (code == 200) {
          const { result, pageSize } = resultData
          wx.hud.hide()
          const { items } = this.data;
          let data = {
            items: this.data.items.concat(result),
            pageNum: pageNum + 1,
            loadMore: false
          }
          if (result.length < pageSize) {
            data.noMoreData = true;
          }
          this.setData(data)
        }else {
          wx.hud.error(message)
        }
      },
      fail: function(res) {
        wx.hud.error(res.errMsg)
      },
      complete: () => {
        this.setData({
          loadMore: false
        })
      }
    })
  }
})