// pages/productDetail/productDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    leProduct: null,
    productPicurls:[],
    productMenuNodes:[],
    showMore: false,
    menuBody: 'moreMenu',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getProductDetail(this.data.id);
  },
  getProductDetail(id){
    var tips = "加载中..."; 
    var that = this; 
    wx.showLoading({
      title: tips,
    })    
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request
    wx.request({
      url: 'http://localhost:9001/api/business/product/getbyid?id='+id,     
      data: {},      
      header: {'content-type': 'application/json'},      
      success: function (res) {
        wx.hideLoading();        
        var data = res.data;
        if(data.code == 10000){
          var leProductPicMenuExt = data.leProductPicMenuExt; 
          var leProduct = leProductPicMenuExt.leProduct;
          var productPicurls = leProductPicMenuExt.productPicurls;
          var productMenuNodes = leProductPicMenuExt.productMenuNodes;
          console.log(leProductPicMenuExt);
          var showMore = true;
          var menuBody = 'moreMenu';
          if(productMenuNodes.length > 1){
            showMore = false;
            menuBody = 'hidden'
          }
          that.setData({
            leProduct: leProduct,
            productPicurls:productPicurls,
            productMenuNodes:productMenuNodes,
            showMore: showMore,
            menuBody: menuBody,
            // meueLength: productMenuNodes.length(),
            // children: productMenuNodes[0].children,
          }) 
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
  },
  listToggle: function () {
    var shouwMore = !this.data.showMore;
    this.setData({
      showMore: shouwMore,
      menuBody: !shouwMore?'hidden':'moreMenu',
    })
  },
  // // 判断高度是否需要查看更多
  // countifshouqi(){
  //   var that =this;
  //   var query = wx.createSelectorQuery();//查询节点信息的对象
  //   query.select('.menu-common-space').boundingClientRect();//添加节点的布局位置的查询请求
  //   // query.select('.productdetail').boundingClientRect();
  //   query.exec((res)=>{//执行所有的请求。请求结果按请求次序构成数组，在callback的第一个参数中返回
  //     res[0].height;
  //     console.log("res==", res)
  //     console.log("height==", res[0].height)
  //     var height = res[0].height;
  //     //25为css里设置的view的line-height
  //     let colNum = height/40;//40px为css里设置的view的line-height
  //     console.log("行数==", colNum )
  //     if(colNum > 3){
  //       that.setData({
  //         readmore: {
  //             status: true,
  //             tip: '查看更多'
  //         }
  //         })
  //     }else{
  //       that.setData({
  //             colNumShow:false
  //         })
  //     }
  //     that.setData({
  //       colNum: colNum,
  //     })
  //   })
  // },
  // //切换收起 查看更多
  // toggle() {
  //   var status = this.data.readmore.status
  //   this.setData({
  //     readmore: {
  //         status: !status,
  //         tip: status ? '收起' : '查看更多'
  //     }
  //   })
  // },
 
})