// pages/getlocation/getlocation.js
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     lat: 40.00,
//     lon: 116.00,
//     address: '定位中'
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     // 微信api，获取经纬度  


//   },
//   getLocation() {
//     wx.getLocation({
//       type: 'gcj02',
//       success: this.updateLocation,
//       fail: (e) => {
//         this.openLocation()
//       }
//     })
//   },


// })



// QQMapKey是在腾讯地图开放平台设置的密钥// 请使用你自己的密钥
const QQMapKey = 'PDQBZ-7CDCS-VEMOM-6FKUC-R76BT-HRBJ7';
// 在密钥设置中开启WebServiceAPI，选择签名校验，即可获取Secret key，即SK// 请使用你自己的SK
const SK = 'wl9nWYGQhIhIVBvwuMgCMqDnfeNtPZl3';
// 引入MD5库import md5 from '../../utils/md5.js';
//获取应用实例const app = getApp()
import md5 from '../../utils/md5.js';
Page({
  data: {
    lat: 0,
    lon: 0,
    address: '定位中',//地址
    cityNameList: [],
    cityName: '',
    cityId: 0,
    area: '商圈',
    dropDownMenuTitle: ['区域', '来源', '租售', '排序'],
    data1: [{
        id: 0,
        title: '不限',
        childModel: [{
            id: '0-1',
            title: '不限'
          }
        ]
      },

      {
        id: 1,
        title: '道里区',
        childModel: [{
            id: '1-1',
            title: '中央大街'
          },
          {
            id: '1-2',
            title: '埃德蒙顿路'
          }
        ]
      },
      {
        id: 2,
        title: '南岗区',
        childModel: [{
            id: '2-1',
            title: '果戈里'
          },
          {
            id: '2-2',
            title: '通达街'
          }
        ]
      },
      {
        id: 3,
        title: '松北区',
        childModel: [{
            id: '3-1',
            title: '世茂大道'
          },
          {
            id: '3-2',
            title: '市政府'
          }
        ]
      }
    ],
    data2: [{
        id: 1,
        title: '个人房源'
      },
      {
        id: 2,
        title: '经纪人房源'
      }
    ],
    data3: [{
        id: 1,
        title: '出租'
      },
      {
        id: 2,
        title: '出售'
      }
    ],
    data4: [{
      id: 1,
      title: '智能排序'
    }, {
      id: 2,
      title: '发布时间'
    }, {
      id: 3,
      title: '距离优先'
    }],
  },
  onLoad(options) {
    
    this.getLocation();

    // this.getCitys();
  }, 
  //获取库中的城市，在根据定位的城市找到cityid
  getoCityList(e){
    wx.navigateTo({
      url: '../cityList/cityList',
    })
  },
  getoCityArea(e){
    wx.navigateTo({
      url: '../cityArea/cityArea',
    })
  },
  getCitys(){
    var that = this;
    var cityNameList = [];
    wx.request({
      url: 'http://localhost:9001/api/area/area/getAllCitys',
      data:{},
      success(res){
        var data = res.data; 
        if(res.data.code == 10000){
          cityNameList = JSON.stringify(data.data.allCitys); 
          // cityNameList = data.data.allCity; 
          // console.log('cityNameList',cityNameList)
          that.setData({cityNameList: cityNameList});
          that.setCityId(cityNameList);
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
  // 根据经纬度，逆地址解析  
  getAddress(lat, lon) {
    // 在wx.request中，this指向wx.request，故无法setData，此处将this指向that    
    var that = this
    wx.showLoading({
      title: '定位中',
      mask: true,
      duration: 3000
    })
    let SIG = md5("/ws/geocoder/v1?key=" + QQMapKey + "&location=" + String(lat) + "," + String(lon) + SK)
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1',
      data: {
        key: QQMapKey,
        location: `${lat},${lon}`,
        sig: SIG
      },
      success(res) {

        let result = res.data.result
        // console.log(result)       
        // formatted_addresses.recommend是经过腾讯地图优化过的描述方式，更具人性化特点        
        let formatted_addresses = result.formatted_addresses.recommend // 此处的that指向app
        let formatted_city =result.address_component.city
        that.setData({
          address: formatted_addresses,
          cityName: formatted_city,
        })
        wx.hideLoading()
        that.getCitys();
      },
      fail: (e) => {
        console.log(e)
        wx.hideLoading()
      }
    })
  },
  // 根据经纬度，设置数据  
  updateLocation(res) {
    this.setData({
      lon: res.longitude,
      lat: res.latitude,
    })
    this.getAddress(res.latitude, res.longitude)
  },
  // 微信api，获取经纬度 39.5 116.3 
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: this.updateLocation,
      fail: (e) => {
        console.log(e)
      }
    })
  },
  setCityId(cityNameList){
    var that = this;
    var cityName = that.data.cityName;
    var cityId = that.data.cityId;
    for(var i = 0;i<cityNameList.length;i++){
      var cityObject = cityNameList[i];
      if(cityName === cityObject.area){
        that.setData({
          cityId:  cityObject.id,
        })
      }
    }
    if(cityId == 0){
      that.setData({
        cityId:  1,
        cityName: '北京市'
      })
    }
  },
  selectedItem: function(e) {
    console.log('id --' + e.detail.selectedId + "cityname = " + e.detail.selectedTitle);
  },
  showDialog: function(e) {

  },
})



