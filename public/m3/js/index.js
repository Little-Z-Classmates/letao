$(function () {

  //获得slider插件对象
  // 轮播图初始化
  var gallery = mui('#slide .mui-slider');
  gallery.slider({
    interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
  });

  // 滑块初始化
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });
})