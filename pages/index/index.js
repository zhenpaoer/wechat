// QQMapKey是在腾讯地图开放平台设置的密钥// 请使用你自己的密钥
const QQMapKey = 'PDQBZ-7CDCS-VEMOM-6FKUC-R76BT-HRBJ7';
// 在密钥设置中开启WebServiceAPI，选择签名校验，即可获取Secret key，即SK// 请使用你自己的SK
const SK = 'wl9nWYGQhIhIVBvwuMgCMqDnfeNtPZl3';
// 引入MD5库import md5 from '../../utils/md5.js';
//获取应用实例const app = getApp()
import md5 from '../../utils/md5.js';
Page({
/**
   * 加载初始数据,有时候为了提升页面打开速度，会将所有数据合并到一个接口中返回，然后列表中的第二页数据开始，使用其它接口返回，即分页获取数据时，
   * 仅获取下一页的数据。（这里仅做示例，因为每一页数据都取一样的。在实际开发中可以考虑这样分开。）
   */
  //https://blog.csdn.net/QQ2856639881/article/details/104886980?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.compare&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.compare
  //遇到的问题就是，第一次扫码进入一个小程序，刷新出来数据以后，返回微信主界面，再点开这个小程序，首页的数据在不重新请求的情况下，之前绑定的数据就没有了；
  //但是如果你手动刷新出来数据，仍然返回微信主页面，然后再打开这个小程序，在不刷新数据的情况下，上次的数据会保留下来，这就让我很烦恼。。没有数据的小程序。。估计会让人秒删
  /**
   * onload onready onshow onhide onunload
   *  第一次打开小程序，以上前3个方法各执行1次，当第一次回到微信主页面的时候onHide,onUnload各执行1次；
   *  第二次打开小程序，以上前3个方法各执行1次,当第二次回到微信主页面的时候onHide执行1次，onUnload不执行； 
      第三次打开小程序，onLoad，onReady不执行，onShow执行一次；当第三次回到微信主页面的时候onHide执行1次，onUnload不执行；
      第四次打开小程序，同第三次
   */
  data:{
    pageSize: 5,          //查询页面页数大小
    productList: [],      //商品list
    currentPage: 1,       //当前的页码
    initNoData: true,     //初始化数据时隐藏没有数据的提示
    hiddenNoData: true,   //加载数据时隐藏没有数据的提示
    lat: 0,               //坐标
    lon: 0,               //坐标
    distance: '100',      //距离
    address: '加载中',    //用户地址
    isLeft: true,         //是否还有商品数据，解决底部不停请求最后一页
    cityId: 1,            //城市id
    cityName: '加载中',   //城市名称
    cityNameList: [],     //城市名称列表 包含了行政区及商圈
    regionId: 0,          //行政区id
    areaId: 0,            //商圈id  
    area:'加载中',        //商圈名称
    loadIndex: false,     //是否加载了首页，用于是否加载地点
    reLoadData: false,    //是否重新加载数据 true：需要重新加载，false:不重新加载
    uid: 0,               //用户id 默认为0
    //过滤参数
    productType: String(0),       //商品类型
    priceType: String(0),         //价格类型
    sortType: String(0),          //排序规则  
    dropDownMenuTitle: ['区域', '类型', '价格', '排序'], //下拉列表的标题栏
    nearbyData: [{
        id: 0,
        title: '附近',
        childModel: [{
            id: '0-1',
            title: '不限',
            value: '100',
          },{
            id: '0-2',
            title: '<1km',
            value: '1',
          },{
            id: '0-3',
            title: '<2km',
            value: '2',
          },{
            id: '0-4',
            title: '<5km',
            value: '5',
          },{
            id: '0-5',
            title: '<10km',
            value: '10',
          }]
      }, 
      
    ],
    nearbyDataBasic: [],
    data2: [{     //价格类型
        id: '1-0',
        title: '全部',
        value: '0'
      },
      {
        id: '1-1',
        title: '火锅',
        value: '6'
      },
      {
        id: '1-2',
        title: '串串香',
        value: '7'
      },  
      {
        id: '1-3',
        title: '烧烤',
        value: '8'
      },  
      {
        id: '1-4',
        title: '甜品',
        value: '10'
      }],
    data3: [{
        id: '2-0',
        title: '全部',
        value: '0',
      },
      {
        id: '2-1',
        title: '50元以下',
        value: '1',
      },
      {
        id: '2-2',
        title: '50-100',
        value: '2',
      },
      {
        id: '2-3',
        title: '100-150',
        value: '3',
      },
      {
        id: '2-4',
        title: '150-200',
        value: '4',
      },
      {
        id: '2-5',
        title: '200元以上',
        value: '5',
      }
    ],
    data4: [{
      id: '3-0',
      title: '智能排序',
      value: '0',
    }, {
      id: '3-1',
      title: '好评优先',
      value: '1',
    }, {
      id: '3-2',
      title: '距离优先',
      value: '2',
    }, {
      id: '3-3',
      title: '价格低到高',
      value: '3',
    }, {
      id: '3-4',
      title: '价格高到低',
      value: '4',
    }],
  },
  //跳转选择城市
  getoCityList(e){
    wx.navigateTo({
      url: '../cityList/cityList',
    })
  },
  //跳转选择商圈
  getoCityArea(e){
    wx.navigateTo({
      url: '../cityArea/cityArea',
    })
  },
  //跳转商品详情
  gotoProductDetail(e){
    var id =e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../productDetail/productDetail?id='+id,
      })
  },
  //跳转搜索
  getoSearchProduct(e){
    wx.navigateTo({
      url: '../searchProduct/searchProduct',
    })
  },
  onLoad(){},
  onShow(){
    var that = this;
    if(!that.data.loadIndex){
      wx.getLocation({
        type: 'gcj02',
        success(res){
          that.setData({
            lon: res.longitude,
            lat: res.latitude,
          });
          that.getAddress(res.latitude, res.longitude)
        },
        fail: (e) => {
          console.log(e)
        }
      })
    }else{
      if(this.data.reLoadData){
        that.setData({
          productList: [],
          nearbyDataContact: [],
        })
        that.resetByChangeCity();
        console.log('----------------请求前数据1---------');
        console.log('productList='+that.data.productList);
        console.log('cityId='+that.data.cityId);
        console.log('cityName='+that.data.cityName);
        console.log('regionId=',that.data.regionId);
        console.log('areaId=',that.data.areaId);
        console.log('lon=',that.data.lon);
        console.log('lat=',that.data.lat);
        console.log('----------------请求前数据2---------');
        that.loadInitData();
        that.transforArray(this.data.cityNameList);
      }else{
        
      }
    }
  },

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
        let formatted_addresses = result.formatted_addresses.recommend // 此处的that指向app    
        let formatted_city =result.address_component.city    
        that.setData({
          address: formatted_addresses,
          cityName: formatted_city,
          area: '商圈',
          loadIndex: true,
        })
        that.getCitys();
        that.loadInitData();
        wx.hideLoading();
      },
      fail: (e) => {
        console.log(e)
        wx.hideLoading()
      }
    })
  },
  //获取首页的城市
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
          // cityNameList = data.data.allCitys; 
          cityNameList = data.leAreaNode;
          console.log('cityNameList',cityNameList)
          that.setData({cityNameList: cityNameList,nearbyDataBasic: that.data.nearbyData});
          that.setCityId(cityNameList);
          that.transforArray(cityNameList);
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
  //设置城市id
  setCityId(cityNameList){
    var that = this;
    var cityName = that.data.cityName;
    var cityId = that.data.cityId;
    for(var i = 0;i<cityNameList.length;i++){
      var cityObject = cityNameList[i];
      if(cityName == cityObject.area){
        that.setData({
          cityId:  cityObject.id,
          area: '商圈',
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
  
  loadInitData: function () {    
    var that = this
    var currentPage = 1;    
    var tips = "加载中...";
    var pageSize = that.data.pageSize;  
    var lon = that.data.lon;
    var lat = that.data.lat;
    var distance = that.data.distance;//公里
    var cityId = that.data.cityId;
    var regionId =  that.data.regionId;
    var areaId =  that.data.areaId;
    var productType = that.data.productType;
    var priceType =that.data.priceType;
    var sortType =that.data.sortType;
    var uid = that.data.uid;
    console.log('----loadInitData-1---');
    console.log('cityId',cityId);
    console.log('regionId',regionId);
    console.log('areaId',areaId);
    console.log('distance',distance);
    console.log('productType',productType);
    console.log('priceType',priceType);
    console.log('sortType',sortType);
    console.log('----loadInitData-2---');
    wx.showLoading({
      title: tips,
    })    
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    wx.request({
      url: 'http://localhost:9001/api/business/product/allforhome?pageSize='+pageSize+'&pageNo='+currentPage+'&lon='+lon+'&lat='+lat+'&distance='+distance+'&cityId='+cityId+'&regionId='+regionId+'&areaId='+areaId+'&productType='+productType+'&priceType='+priceType+'&sortType='+sortType+'&uid='+uid,   
      data: {},      
      header: {'content-type': 'application/json'},      
      success (res) {
        wx.hideLoading();
        var data = res.data; 
        if(res.data.code == 10000){
          var total = data.queryResult.total
          if(total == 0){
            that.setData({initNoData: false}) //显示没有数据
          }else{
            var productList = data.queryResult.list;
            that.transforIssale(productList);
            that.setData({
              // productList: productList, 
              currentPage: currentPage,
              initNoData: true,
              reLoadData: false,
              isLeft: true,
            })
          }
          
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000//持续的时间
          })
        }     
       
      },
      fail(){
        wx.showToast({
          title: "请求失败",
          icon: 'none',
          duration: 2000//持续的时间
        })
      }
    })

  },
  /**
   * 加载下一页数据
   */
  loadMoreData: function () {    
    var that = this
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    var tips = "加载中...";
    var lon = that.data.lon;
    var lat = that.data.lat;
    var pageSize = that.data.pageSize;
    var distance = that.data.distance;//公里
    var cityId = that.data.cityId;
    var regionId =  that.data.regionId;
    var areaId =  that.data.areaId;
    var productType = that.data.productType;
    var priceType =that.data.priceType;
    var sortType =that.data.sortType;
    var uid = that.data.uid;
    if(that.data.isLeft){
      wx.showLoading({      
        title: tips,
      })   
      // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
      wx.request({      
        url: 'http://localhost:9001/api/business/product/allforhome?pageSize='+pageSize+'&pageNo='+currentPage+'&lon='+lon+'&lat='+lat+'&distance='+distance+'&cityId='+cityId+'&regionId='+regionId+'&areaId='+areaId+'&productType='+productType+'&priceType='+priceType+'&sortType='+sortType+'&uid='+uid,       
        data: {},      
        header: {    
          'content-type': 'application/json'
        },      
        success: function (res) {
          wx.hideLoading();        
          var data = res.data;
          if(res.data.code == 10000){
            var total = data.queryResult.total;
            if(total > 0){
              var productList = data.queryResult.list;
              
              // 将新一页的数据添加到原数据后面
              var originProductList = that.data.productList;        
              var newProductList = originProductList.concat(productList);  
              that.transforIssale(newProductList);
              that.setData({          
                // productList: newProductList,         
                currentPage: currentPage
              })
            }else {
              that.setData({
                hiddenNoData: false,
                isLeft: false,
              })
              console.log('我是有底线的');
            }
          } else{
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000//持续的时间
            })
          }
        },
        fail(){
          wx.showToast({
            title: "请求失败",
            icon: 'none',
            duration: 2000//持续的时间
          })
        }
      })
  }
  },
        
  // 上滑加载更多    
  onReachBottom: function() {
    this.loadMoreData()  
  },
  selectedItem(e) {
    var that = this; 
    // var productType = 0;
    // var priceType = 0;
    // var sortType = 0;
    var selectId = e.detail.selectedId;
    var selectValue = e.detail.selectedValue;
    var selectTitle = e.detail.selectedTitle;
    that.setData({productList: [],hiddenNoData:true});
    console.log('id --' + e.detail.selectedId +",title = " + e.detail.selectedTitle + ",value = " + e.detail.selectedValue );
    if(selectId.indexOf('-') >= 0){
      var type = selectId.charAt(0);
      console.log('type',type);
      if(type == 1){  //筛选类型
        that.setData({
          productType:selectValue,
        })
      }
      if(type == 2){   //筛选价格
        that.setData({
          priceType:selectValue,
        })
      }
      if(type == 3){   //排序方式
        that.setData({
          sortType:selectValue,
        })
      }  

    }else{

    }
    that.loadInitData();
    



  },
  selectArea(e){
    var that = this;
    var regionId = 0;
    var areaId = 0;
    var distance = 0;
    var selectId = e.detail.selectedId;
    var selectValue = e.detail.selectedValue;
    var selectTitle = e.detail.selectedTitle;
    that.setData({productList: [],hiddenNoData:true});
    console.log('id --' + e.detail.selectedId +",title = " + e.detail.selectedTitle + ",value = " + e.detail.selectedValue );
    //选择附近
    if(selectId.indexOf('-') >= 0){
      distance = selectValue;
      regionId=0;areaId=0;
      that.setData({
        distance:distance,
        regionId: regionId,
        areaId: areaId,
      });
      console.log('选择附近 distance=' + distance +' / regionId='+ regionId + ' / areaId=' +areaId);
    }else{
      distance = 100;
      //选择行政区
      if(selectTitle == '不限'){
        regionId = selectValue;
        areaId = 0;
        that.setData({
          distance:distance,
          regionId: regionId,
          areaId: areaId,
        });
        console.log('选择行政区 distance=' + distance +' / regionId='+ regionId + ' / areaId=' +areaId);
      }else{
        //选择商圈
        regionId = 0;
        areaId = selectValue;
        that.setData({
          distance:distance,
          regionId: regionId,
          areaId: areaId,
        });
        console.log('选择商圈 distance=' + distance +' / regionId='+ regionId + ' / areaId=' +areaId); 
      }
    }
    that.loadInitData();
    
  },
  requestRegionOrAreaByCityId(){

  },
  showDialog(e) {

  },
  //转换issale为中文
  transforIssale(productList){
    var that = this;
    for(var i=0;i<productList.length;i++){
      var product = productList[i];
      if(product.issale == 1){
        product.issale = '砍价';
      }
      if(product.issale == 2){
        product.issale = '已砍';
      }
      if(product.issale == 3){
        product.issale = '已售';
      }
    }
    that.setData({
      productList: productList,
    })
  },

  //转换数组 将获取到的行政区及商圈放入 下拉框中的数组中
  transforArray(cityNameList){
    var that = this;
    var cityId = that.data.cityId;
    var nearByDataBasic = that.data.nearbyDataBasic;
    var tempList = [];
    for(let i = 0; i < cityNameList.length ; i ++){
      if(cityId == cityNameList[i].id){
        // 找到城市
        var city = cityNameList[i];
        var cityChildren = city.children;
        
        for(let j = 0;j< cityChildren.length; j++){
          var regionObjectOrigion = cityChildren[j];
          var areaList = regionObjectOrigion.children;
          var childModel = [];
          let allArea = {
            id: String(regionObjectOrigion.id),
            title: '不限',
            value: regionObjectOrigion.id
          }
          childModel.push(allArea);
          for(let k = 0;k<areaList.length;k++){
            var areaObjectOrigion = areaList[k];
            let areaObject = {
              id: String(areaObjectOrigion.id),
              title: areaObjectOrigion.area,
              value: areaObjectOrigion.id
            }
            childModel.push(areaObject);
          }
          let regionObject = {
            id: String(regionObjectOrigion.id),
            title: regionObjectOrigion.area,
            value: regionObjectOrigion.id,
            childModel: childModel,
          }
          tempList.push(regionObject);
          that.setData({
            nearbyDataContact: tempList,
          })
        }
        break;
      }
    }
    var nearByDataNew = nearByDataBasic.concat(tempList);
    that.setData({
      nearbyData: nearByDataNew,
    })
  },
  //重置过滤条件
  reset(e){
    this.setData({
      distance:100,
      regionId :  String(0),
      areaId :  String(0),
      productType :  String(0),
      priceType : String(0),
      sortType : String(0),
    })
    this.loadInitData();
  },
  //改变城市触发重置
  resetByChangeCity(e){
    console.log('resetByChangeCity')
    this.selectComponent('#dropDownMenu').reset(e); 
  },
})
