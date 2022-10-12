//index.js
//获取应用实例
const app = getApp();

// 获取sdk实例
const brtloc = require('../libs/brtmap-2.4.2.js');

// 建筑ID
const buildingID = 'ZS020227';
// 有效token
const token = 'BB00003ea35147aa93a0c1a596698f12';

Page({
  data: {},
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


    // 监听 实时的定位点
    $locate.on('location', point => {
      console.log('point', point);
    });

  }
})