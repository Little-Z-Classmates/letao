$(function () {
    // 由于轮播图插件默认无法自动轮播图 需要手动调用js初始化方法去初始化
    //获得slider插件对象
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval: 1000 //自动轮播图间隔时间
    });

    // 由于区域滚动默认也是没有初始化需要手动初始化
    mui('.mui-scroll-wrapper').scroll({
        indicators: true, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
})