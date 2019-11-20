//app.js
App({
  onLaunch: function () {
   
    wx.hud = {}
    wx.hud.loading = function(loading = '加载中...') {
      wx.hud.hide()
      wx.showLoading({ title: loading})
    }
    wx.hud.success = function(success) {
      showHUD(success, 'success');
    }
    wx.hud.error = function(error) {
      showHUD(error, '');
    }
    wx.hud.toast = function(toast) {
      showHUD(toast, 'none');
    }

    wx.hud.hide = function() {
      wx.hideLoading();
      wx.hideToast();
    }

    function showHUD(title, icon) {
      wx.hud.hide()
      wx.showToast({ title, icon })
    }
  },
})