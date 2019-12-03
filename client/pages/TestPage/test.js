// pages/TestPage/test.js
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
    wx.cloud.init()
    
  },
  callCloudFunc: function() {
    wx.cloud.callFunction({
      name: 'request',
      data: {
        num1: 1,
        num2: 2
      }
    }).then(res => {
      console.log(res)
    }).catch(error => {
      console.log(error)
    })
  }

})