// pages/test/test.js
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
    wx.setStorageSync('key', '123');
  },
  async getPromise(){
    console.log('getPromise start')
    let promise = new Promise(function(success,fail){
      wx.getSetting({
        success(res){
          console.log('getPromise-success');
          var key = wx.getStorageSync('key');
          success(key)},
        fail(res){
          console.log('getPromise-fail');
          var key = wx.getStorageSync('key');
          fail(key);
        },
      })
    })
    console.log('getPromise end')
    return promise;
  },
  getKey(){
    console.log('getKey start')
    var that =this;
    var key = '';
    let promise = that.getPromise();
    // promise.then((res)=>{
    //   key = res;
    //   console.log('res=',res);
    // },(error)=>{
    //   key = error;
    //   console.log('error=',error);
    // })
    
    console.log('getKey end')
    return promise.then(res=>res)
    // return key;
  },
  btn(){
    console.log('btn start')
    var key = this.getKey().then(res=>{
      console.log('res=',res);
    })
    console.log('btn end key=',key)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})