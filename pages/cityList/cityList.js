Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityName: '',
    cityNameList: [],
    area: '商圈',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var info =  prevPage.data;
    var that = this;
    that.setData({
      cityName: info.cityName,
      cityNameList: info.cityNameList,
    });
    // this.getCitys();
  },
  getCitys(){
    var that = this;
    var cityNameList = [];
    wx.request({
      // url: 'http://localhost:9001/api/area/area/getAllCitys',
      url: 'http://localhost:9001/api/area/area/getAreaById?id=0',
      data:{},
      success(res){
        var data = res.data; 
        if(res.data.code == 10000){
          cityNameList = data.leAreaNode
          that.setData({cityNameList: cityNameList});
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000//持续的时间
          })
        }
      }
    })
  },
  selectCityAndGotoHome(e){
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    var cityId =e.currentTarget.dataset.id;
    var cityName =e.currentTarget.dataset.area;
    // this.findAreaByCityId(cityId);//商圈
    var area = that.data.area;
    if(cityName == that.data.cityName){
      wx.navigateBack({
        data: 1
      })
    }else{
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        cityId: cityId,
        cityName: cityName,
        area: area,
        areaId: 0,
        regionId: 0,
        hiddenNoData: true,
        reLoadData: true,
      })
      wx.navigateBack({
        data: 1
      })

    }
    
  },
  findAreaByCityId(cityId){
    var that =this;
    wx.request({
      url: 'http://localhost:9001/api/area/area/getAllAndHotAreasByCityId?id='+cityId,
      success(res){
        var data = res.data.data; 
        var hotareas = data.hotAreas;
        if(res.data.code == 10000){
          
        }

      }
    })
    // var that = this;
    // var area = '';
    // var list = that.data.cityNameList
    // for(let i = 0; i <= list.length;i++){
    //   var cityObject = list[i];
    //   if(cityId == cityObject.id){
    //     var children = list[i].children.children;
    //     if(children.length>1){
    //       area = children[0].area;
    //     }else{
    //       area='';
    //     }
    //   }
    // }
    // return{area: area}
  },
  // getCityNameById(e){
  //   var that = this;
  //   that.data.cityNameList
  // },
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