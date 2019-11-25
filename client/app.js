//app.js
App({
  data:{
    
  },
  onLaunch: function () {
    this.initHUD()
    wx.url = function(path) {
      return `https://api-cc.yuxiang.ren/${path}`
    }
  },
  
  initHUD: function() {
    const self = this;
    /**
     * 全局hud对象
     */
    wx.hud = {}
    /**
     * 显示加载
     */
    wx.hud.loading = function (loading, success) {
      wx.hud.hide()
      wx.showLoading({
        title: loading || '加载中...',
        mask: true,
        success: function () {
          if (typeof success != "function") return;
          setTimeout(success, 2000)
        }
      })
    }
    /**
     * 显示成功
     */
    wx.hud.success = function (success, callback) {
      showHUD(success, 'success', null, callback);
    }
    /**
     * 显示失败
     */
    wx.hud.error = function (error, callback) {
      showHUD(error, '', '/img/error.png', null, callback);
    }
    /**
     * 显示toast（单文字）
     */
    wx.hud.toast = function (toast, callback) {
      showHUD(toast, 'none', null, callback);
    }

    /**
     * 隐藏hud
     */
    wx.hud.hide = function () {
      wx.hideLoading();
      wx.hideToast();
    }
    /**
     * 通用显示hud
     * @param title 显示的问题
     * @param icon 图片类型
     * @param image 自定义图片地址
     * @param success 成功后回调
     */
    function showHUD(title, icon, image, success) {
      wx.hud.hide()
      wx.showToast({
        title,
        icon,
        image,
        mask: true,
        success: function () {
          if (typeof success != "function") return;
          setTimeout(success, 2000)
        }
      })
    }
  }
})