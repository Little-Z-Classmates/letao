$(function () {
  $('.btn-register').on('tap', function () {
    // 开关思想,如果为true表单没有为空的 , false则有表单还是空着的
    var flag = true;
    $('.mui-input-group input').each(function (index, ele) {
      if ($(ele).val().trim() == '') {
        mui.alert($(ele).prev().text() + '不允许为空', '提示', '确定');
        flag = false;
        return false;
      }
    })
    if (flag) {
      // 表单非空验证已通过
      // 手机判断
      var mobile = $('.mobile').val().trim();
      if (!validateTel(mobile)) {
        mui.alert('您输入的手机号不合法!', '提示', '确定');
        return false;
      }
      
      // 判断用户名长度
      var username = $('.username').val().trim();
      if ( username.length< 6 || username.length > 20) {
        mui.alert('请输入合法的用户名6-20位之间', '提示', '确定');
        return false;
      }
      // 判断2次密码输入是否相同
      var password1 = $('.password1').val().trim();
      var password2 = $('.password2').val().trim();
      if (password1 != password2) {
        mui.alert('两次输入的密码不一致', '提示', '确定');
        return false;
      }
      // 密码长度判断
      if (password1.length < 6 || password1.length > 20) {
        mui.alert('密码请输入6位-20位之间', '提示', '确定');
        return false;
      }
      // 判断验证码是否正确
      if ($('.vcode').val() != getVcode) {
        mui.alert('输入的验证码错误', '提示', '确定');
        return false;
      }

      // console.log($('form').serializeArray());
      var data = $('form').serialize();
      console.log(data);
      // console.log($('form').serialize());
      // 调用注册的API实现注册功能
      $.ajax({
        type: 'post',
        url: '/user/register',
        data: data,
        success: function (res) {
          console.log(res);
          if(res.error) {
            mui.toast(res.message,{ duration:'long', type:'div' });
          }else {
            mui.alert('恭喜您注册成功', '提示', '确定',function () {
              location = 'login.html';
            });
          }
        }
      });

    }
  });

  // 声明全局变量存储随机验证码
  var getVcode;

  // 获取验证码注册点击事件
  $('.btn-vcode').on('tap', function () {

    // 发送ajax获取随机验证码
    $.ajax({
      url: '/user/vCode',
      success: function (res) {
        // console.log(res);
        if (res.error) {
          mui.toast('获取验证码失败', {
            duration: 'short',
            type: 'div'
          })
        } else if (res.vCode) {
          getVcode = res.vCode;
          console.log(res.vCode);
        }
      }
    });
  });

  // 手机正则验证
  function validateTel(tel) {
    var TEL_REGEXP = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (TEL_REGEXP.test(tel)) {
      return true;
    }
    return false;
  }
})