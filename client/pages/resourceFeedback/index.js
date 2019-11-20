// pages/resourceFeedback/resourceFeedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    model: [

    ],
    itemData: {
      "id": 16,
      "baidu_link": "http://pan.baidu.com/s/1dh9fjw",
      "baidu_pwd": "bixb",
      "bilibili_av": "av20969027",
      "type": 0,
      "mark": null,
      "creat_time": "2018-08-08T01:40:25.000Z",
      "update_time": "2019-11-20T02:10:50.000Z",
      "baidu_pan": "1dh9fjw",
      "cover_url": "//i0.hdslb.com/bfs/bangumi/d2a04192596aacb52b2ff1ae195627d86dc682ec.jpg@360w_480h.webp",
      "visits_count": 28,
      "title": "少年大钦差",
      "bili_link": "https://www.bilibili.com/av20969027"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', this.updateData)
  },
  updateData: function(item) {
    this.setData({itemData: item})
  },
  submitForm: function() {
    const { item } = this.data;
    wx.request({
      url: 'https://api-cc.yuxiang.ren/feedback/resource',
      data: {
        name: item.title,
        type: item.type,
        resour_id: item.id,
        mail: '',
        baidu_link: baidu_link,
        bili_link: item.bili_link,
        message: '123'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        const { code, message } = res.data;
        if (code == 1) {
          wx.hud.success(message)
        } else {
          wx.hud.error(message)
        }
      },
      fail: function (res) {
        wx.hud.error(res.errMsg)
      },
    })
  }
})