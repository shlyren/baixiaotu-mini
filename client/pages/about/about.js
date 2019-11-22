// pages/about/about.js
Page({

  data: {
    version: '1.0.1',
    illustrate: [
      '本程序的内容来自互联网或由作者进行二次创作后上传，如若侵权请联系删除。',
      '本程序的发布仅为交流与分享，不能保证内容的正确性及有效性。'
    ],
    links: [
      {
        'title': '源代码',
        'content': 'https://github.com/shlyren/baixiaotu-mini'
      },
      {
        'title': 'bilibili主页',
        'content': 'https://space.bilibili.com/20427061'
      }, {
        'title': '白小兔',
        'content': 'https://baixiaotu.cc'
      }, {
        'title': '联系作者',
        'content': 'shlyjen',
        'describe': '微信号已复制到剪切板，请手动添加微信好友。'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onLinkClick: function(e) {
    const index = e.currentTarget.dataset.index
    const link = this.data.links[index];
    if (!link.content) return;
    
    wx.setClipboardData({
      data: link.content,
      success: function() {
        wx.showModal({
          title: '提示',
          content: link.describe || '链接已复制到剪切板，请使用游览器打开链接。',
          showCancel: false,
        });
      },
      fail: function (res) {
        console.log(res)
      }
    });

    
  }
})