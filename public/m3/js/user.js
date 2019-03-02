$(function () {

  // 发送ajax请求,并且渲染到页面上
  $.ajax({
    url: '/user/queryUserMessage',
    success: function (res) {
      console.log(res);
      if (res.error) {
        // 错误则表示没有登录,返回登录页面
        location = 'login.html?returnUrl=' + location.href;
      }else {
        // 获取成功, 把数据渲染到页码上
        $('.username').html(res.username);
        $('.mobile').html(res.mobile);
      }
    }
  });

  // 退出登录注册点击事件
  $('.mui-btn').on('tap', function () {
    $.ajax({
      url: '/user/logout',
      success: function (res) {
        if (res.error) {
          mui.toast('系统错误,退出登录失败',{ duration:'long', type:'div' }) 
        }else {
          location = 'login.html?returnUrl='+location.href;
        }
      }
    });
  });

  // 我的购物车注册点击跳转
  $('.buy-cart').on('tap', function () {
    location = 'cart.html';
  })
});