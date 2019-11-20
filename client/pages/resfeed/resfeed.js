
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
    const eventChannel = this.getOpenerEventChannel()
    eventChannel && eventChannel.on('acceptDataFromOpenerPage', (item) => {
      self.setData(item)
    })
  },
  submitForm: function(e) {
    const { mail, message } = e.detail.value;
    if (!message || message.length == 0) {
      wx.hud.toast('请输入反馈内容')
      return;
    }
    const { item } = this.data;
    wx.hud.loading('正在提交')
    wx.request({
      url: 'https://api-cc.yuxiang.ren/feedback/resource',
      data: {
        name: item.title,
        type: item.type,
        resour_id: item.id,
        baidu_link: item.baidu_link,
        bili_link: item.bili_link,
        mail,
        message
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        const { code, message } = res.data;
        if (code == 200) {
          wx.hud.success(message, function() {
            wx.navigateBack({
              delta: 1,
            })
          })
        } else {
          wx.hud.error(message)
        }
      },
      fail: function (res) {
        wx.hud.error('网络错误')
      },
    })
  }
})