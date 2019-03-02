$(function () {

  // 给头部房子注册点击事件->返回到主页
  $('#header .right').on('tap', function () {
    location = 'index.html';
  });

  // 获取url传递过来的id
  var id = GetQueryString('id');
  console.log(id);

  // 发送ajax请求传递当前id参数
  $.ajax({
    url: '/product/queryProductDetail',
    data: {
      id: id
    },
    success: function (res) {
      // 获取尺码并处理成数组好在模版中使用
      var size = res.size.split('-');
      var minSize = size[0] - 0;
      var arr = [];
      for (var i = minSize; i < size[1]; i++) {
        arr.push(i);
      }
      res.size = arr;

      // console.log(res);
      // 渲染页码
      var html = template('detailsTpl', res);
      $('#main .mui-scroll').html(html);

      // 初始化区域滚动
      mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
      });

      // 轮播图初始化
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
      });

      // 初始化数字输入框
      mui('.mui-numbox').numbox();

      // 为尺码注册点击事件
      $('.size button').on('tap', function () {
        $(this).addClass('mui-btn-warning').siblings('button').removeClass('mui-btn-warning');
      })
    }
  })

  // 给加入购物车注册点击事件
  $('.btn-buy-cat').on('tap', function () {
    // 获取尺码
    var size = $('#main .size .mui-btn-warning').data('size');
    // 获取数量
    var sum = mui('.mui-numbox').numbox().getValue()
    // console.log(sum);

    // 调用加入购物车的API实现加入购物车
    $.ajax({
      type: 'post',
      url: '/cart/addCart',
      data: {
        productId: id,
        num: sum,
        size: size
      },
      success: function (res) {
        console.log(res);
        if (res.error) {
          location = 'login.html?returnUrl='+location.href;
        }else {
          mui.confirm( '已加入购物车是否去购物车查看', '温馨提示', ['是','否'],function (e){
            console.log(e);
            if (e.index == 0) {
              location = 'cart.html';
            }else {
              mui.toast('请继续添加',{ duration:'short', type:'div' }) 
            }
          } )
        }
      }
    });

  })



})