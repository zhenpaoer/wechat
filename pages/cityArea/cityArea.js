// pages/cityArea/cityArea.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    cityId: 0,
    hotAreas:[],
    allAreas:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var info = prevPage.data; //取上页data里的数据也可以修改
    var address = info.address;
    var cityId = info.cityId;
    that.setData({
      address: address,
      cityId: cityId,
    })
    this.getAreas(cityId);
  },
  getAreas(cityId){
    var that =this;
    wx.request({
      url: 'http://localhost:9001/api/area/area/getAllAndHotAreasByCityId?id='+cityId,
      success(res){
        var data = res.data.data; 
        var hotareas = data.hotAreas;
        var allareas = data.allAreas;
        if(res.data.code == 10000){
          that.setData({
            hotAreas: hotareas,
            allAreas: allareas,
          })
        }

      }
    })

  },
  selectAreaAndGotoHome(e){

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    var areaId =e.currentTarget.dataset.id;
    var area =e.currentTarget.dataset.area;
    var searchcount = e.currentTarget.dataset.searchcount
   
    this.updateAreahot(areaId,searchcount);
    if(prevPage.data.areaId == areaId){
      wx.navigateBack({
        data: 1
      })
    }else{
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        area: area, //商圈
        areaId: areaId, //商圈id
        hiddenNoData: true,
        reLoadData: true,
      })
      wx.navigateBack({
        data: 1
      })
    }
    
  },
  updateAreahot(id,searchcount){
    wx.request({
      url: 'http://localhost:9001/api/area/area/updateAreaSearchCountById?id='+id+'&searchcount='+searchcount,
    })
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