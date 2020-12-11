// pages/startUp/startUp.js
// import md5 from './utils/md5.js';
import md5 from '../../utils/md5.js';
const QQMapKey = 'PDQBZ-7CDCS-VEMOM-6FKUC-R76BT-HRBJ7';
const SK = 'wl9nWYGQhIhIVBvwuMgCMqDnfeNtPZl3';
// require('utils/util.js'),
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
    this.initLogin();
  },
  initLogin(){
    var that =this;
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.checkSession({
            success: function () {
              //存在登陆态
              var token = wx.getStorageSync('token');
              if(token == ''){
                that.login();
              }else{
                that.checkLogin(token);
              }
            },
            fail: function () {
              //不存在登陆态
              that.login();
            }
          })
          // that.login();
        } else {
          // 用户没有授权
          console.log('用户没有授权1')
          wx.switchTab({
            url: '../index/index',
          })
        }
      }
    }); 
  },
  checkLogin:function(token){
    var that = this;
    wx.request({
      url: 'http://localhost:8070/userjwt',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": token,
      },
      success(res){
        console.log('userjwt=',res)
        if(res.data.jwt == null){
        that.login();
        }else{
          wx.setStorageSync('jwt', res.data.jwt);
          wx.switchTab({
            url: '../index/index',
          })
        } 
      }
    })
  },
  login:function(){
    var that = this;
    wx.showLoading({
      title: '登陆中...',
    })
    wx.login({
      success: async (res) => {
        wx.request({
          url: 'http://localhost:8070/wxlogin',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          data: {
            code: res.code,
          },
          success: res => {
            //获取到用户凭证 存儲 token 
            var token = res.data.token;
            wx.setStorageSync('token', token);
            wx.request({
              url: 'http://localhost:8070/userjwt',
              header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "token": token,
              },
              success:  (res) => {
                var jwt = res.data.jwt;
                wx.setStorageSync('jwt', jwt);
                that.getlocation(token,jwt);
              }
            });
          }
        });
      }
    });
  },
  getlocation(token,jwt){
    wx.getLocation({
      type: 'gcj02',
      success(res){
        var lat = res.latitude;
        var lon = res.longitude;
        let SIG = md5("/ws/geocoder/v1?key=" + QQMapKey + "&location=" + String(lat) + "," + String(lon) + SK)
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1',
          data: {
            key: QQMapKey,
            location: `${lat},${lon}`,
            sig: SIG
          },
          success(res){
            let result = res.data.result    
            let formatted_addresses = result.formatted_addresses.recommend // 此处的that指向app    
            wx.getUserInfo({
              success: res1 =>{
                wx.request({
                  url: 'http://localhost:8060/user/updateuserlogin',
                  header:{
                    token:token,
                    Authorization: 'Bearer '+jwt,
                  },
                  data: {
                    nickName: res1.userInfo.nickName,
                    avatarUrl: res1.userInfo.avatarUrl,
                    address: formatted_addresses,
                    lon: lon+'',
                    lat: lat+'',
                  },
                  success(){
                    wx.hideLoading();
                    wx.switchTab({
                      url: '../index/index',
                    })
                  }
                })
              }
            });  
          }
        })
      }  
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