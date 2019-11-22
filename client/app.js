//app.js
App({
  data:{
    
  },
  onLaunch: function () {
    const self = this;
    wx.hud = {}
    wx.hud.loading = function(loading, success) {
      wx.hud.hide()
      wx.showLoading({ 
        title: loading || '加载中...', 
        mask: true,
        success: function() {
          if (typeof success != "function") return;
          setTimeout(success, 2000)
        }
      })
    }
    wx.hud.success = function (success, callback) {
      self.showHUD(success, 'success', null, callback);
    }
    wx.hud.error = function (error, callback) {
      self.showHUD(error, '', '/img/error.png', null, callback);
    }
    wx.hud.toast = function (toast, callback) {
      self.showHUD(toast, 'none', null, callback);
    }

    wx.hud.hide = function() {
      wx.hideLoading();
      wx.hideToast();
    }
  },
  showHUD: function (title, icon, image, success) {
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
})