$(function () {

  // 获取传递过来的url
  var returnUrl = GetQueryString('returnUrl');
  console.log(returnUrl);

  // 登录按钮注册事件
  $('.btn-login').on('tap', function () {
    // 开关思想
    var check = true;
    // 获取表单的值
    var username = $('.username').val().trim();
    var password = $('.password').val().trim();
    // 表单非空判断
    mui(".mui-input-group input").each(function () {
      //若当前input为空，则alert提醒 
      if (!this.value || this.value.trim() == "") {
        var label = this.previousElementSibling;
        mui.alert(label.innerText + "不允许为空");
        check = false;
        return false;
      }
    });
    if (check) {
      //校验通过，继续执行业务逻辑 
      $.ajax({
        type: 'post',
        url: '/user/login',
        data: {
          username: username,
          password: password
        },
        success: function (res) {
          console.log(res);
          if (res.error) {
            // 登录失败
            mui.alert(res.message, '温馨提示', '确定');
          } else {
            // 登录成功,返回刚才跳转过来的页面
            location = returnUrl;
            
          }
        }
      });
    }
  });

  // 给注册添加点击事件
  $('.btn-register').on('tap', function () {
    location = 'register.html';
  })

});