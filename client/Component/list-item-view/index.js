// Component/list-item-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    divider: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onItemClick: function () {
      wx.navigateTo({
        url: '/pages/particulars/particulars',
        success: res => {
          res.eventChannel.emit('data', this.data.item)
        }
      })
    }
  },
  lifetimes: {

    attached: function () {

    }
  }
  
})
