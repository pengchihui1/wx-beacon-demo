// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    mottotitle: 'Hello World',
    beanconList:[]
  },
  // 事件处理函数
  // searchBeacon() {
    
  // },
  onLoad() {
    var that=this
    if (!wx.openBluetoothAdapter) {
      this.showError("当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。");
      return;
    }
    //检测蓝牙状态
    wx.openBluetoothAdapter({
      success: function (res) {//蓝牙状态：打开
        wx.startBeaconDiscovery({//开始搜索附近的iBeacon设备
          uuids: ['e2c56db5-dffb-48d2-b060-d0f5a71096e0'],//参数uuid
          success: function (res) {
            wx.onBeaconUpdate(function (res) {//监听 iBeacon 设备的更新事件  
              wx.getBeacons({
                success: (resa) => {
                  // var temp = this.data.beanconList
                  that.setData({
                    beanconList: resa.beacons
                  })
                  // console.log(resa.beacons)
                }
              })
              //封装请求数据 
              var beacons = res.beacons;
              var reqContent = {};
              var bleArray = [];
              for (var i = 0; i < beacons.length; i++) {
                var bleObj = {};
                bleObj.distance = beacons[i].accuracy;
                bleObj.rssi = beacons[i].rssi;
                bleObj.mac = beacons[i].major + ":" + beacons[i].minor;
                var mytemp = "uuid:" + beacons[i].uuid + ";" +
                  "major:" + beacons[i].major + ";minor:" + beacons[i].minor
                  + ";proximity:" + beacons[i].proximity
                  + ";accuracy:" + beacons[i].accuracy
                  + ";rssi:" + beacons[i].rssi
                // console.log(new Date())
                // console.log(mytemp)
                bleArray.push(bleObj);
                // console.log(bleArray)
              }
              //reqContent.ble = bleArray;
              //请求后台向redis插入数据
              // redisSave(reqContent);
            });
          },
          fail: function (res) {
            console.log(res)
            //先关闭搜索再重新开启搜索,这一步操作是防止重复wx.startBeaconDiscovery导致失败
            // stopSearchBeacon();
          }
        })
      },
      fail: function (res) {//蓝牙状态：关闭
        wx.showToast({ title: "请打开蓝牙", icon: "none", duration: 2000 })
      }
    })
  },

})
