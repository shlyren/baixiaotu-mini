// pages/particulars/particulars.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    model: [
      {
        'name': '类型',
        'key': 'type',
        'copyable': false
      },
      {
        'name': 'B站链接',
        'key': 'bili_link',
        'copyable': true
      },
      {
        'name': '网盘链接',
        'key': 'baidu_link',
        'copyable': true
      },
      {
        'name': '更新时间',
        'key': 'update_time',
        'copyable': false
      },
      {
        'name': '说明',
        'key': 'mark',
        'copyable': false
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', this.updateData)
  },

  updateData: function (item) {
    const data = item.item
    this.setData({ data })

    const requestData = {
      type: data.type,
      id: data.id
    }
    wx.request({
      url: 'https://api-cc.yuxiang.ren/calculate/visits',
      data: requestData,
      method: 'PUT',
      dataType: 'json'
    })

  },
  // 复制操作
  copied: function(e) {
    const { key } = e.currentTarget.dataset
    var data = null;
    if (key == 'bili_link') {
      data = this.data.data.bili_link
    } else if (key == 'baidu_link') {
      data = `链接：${this.data.data.baidu_link}  提取码：${this.data.data.baidu_pwd}`
    }
    if (!data) return;
    wx.setClipboardData({
      data
    });
  },
  // 资源反馈
  feedback: function(e) {
    const { data: item } = this.data;
    wx.navigateTo({
      url: '/pages/resourceFeedback/index',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { item })
      }
    })
  }
})