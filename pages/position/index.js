//index.js
//获取应用实例
const app = getApp();

// 获取sdk实例
const brtloc = require('../../libs/brtloc.miniprogram.js');

// 建筑ID
const buildingID = 'ZS020227';
// 有效token
const token = '填写有效token';

// 与H5集成开发 理念：
//   小程序调用 ibeacon扫描功能  通过 userId 唯一标识ID 推送到服务器(socket方式)。  利用浏览器get方式 把userId传送给H5，H5的定位SDK会获取 location_user_id 参数(userId) 去服务器拉取beacons 并实现H5端定位功能。 

Page({
  data: {
    // h5的域名地址
    url: ''
  },
  onLoad: function () {

    // 唯一ID
    let userId = +new Date();

    // 实例
    let $locate = new brtloc.Location({
      userId,
      buildingID,
      token
    });

    // ready
    $locate.on('ready', () => {

      // 监听扫描ibeacon
      wx.onBeaconUpdate(res => {
        // console.log('onBeaconUpdate', res.beacons);

        // 分析beacons， 计算定位点
        $locate.beaconAnalysis(res.beacons);

      });

      //开启 ibeacon扫描
      wx.startBeaconDiscovery({
        uuids: $locate.uuids,
        success: res => {}
      });

    });

    // 通过url方式 把  'location_user_id' 传入给H5 （后续H5定位SDK做 唯一连接处理）
    this.setData({
      url: '//127.0.0.1:8080/index.html?location_user_id=' + userId
    });
  }
})