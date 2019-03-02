$(function () {
    /* 1. 登录功能
      1. 点击登录按钮的时候 获取当前输入用户名和密码
      2. 如果用户名或者密码为空 提示用户输入用户名密码
      3. 如果不为空 调用登录API实现登录功能
      4. 如果登录成功跳转回到详情页面
      5. 如果登录失败提示用户失败的原因 让用户继续输入 */
    // 1. 获取登录按钮添加点击事件
    $('.btn-login').on('tap', function () {
        //   2. 获取当前输入用户名和密码    去掉2端空格
        var username = $('.username').val().trim();
        var password = $('.password').val().trim();
        // 3. 判断当前用户名和密码是否为空  !取反   !false == true   !true == false
        if (!username) {
            mui.alert('请输入用户名', '温馨提示', '确定', function () {

            });
            // return  和  return false  区别
            // return 后面的代码不执行
            // return false 不仅后面的代码不执行了 而且这个元素默认行为也会被阻止
            return false;
        }
        if (!password) {
            mui.alert('请输入密码', '温馨提示', '确定', function () {

            });

            return false;
        }

        // 4. 如果用户名和密码都不为空调用登录API实现登录功能
        $.ajax({
            url: '/user/login',
            // 一般进行表单提交 数据提交都使用post
            type: 'post',
            data: {
                username: username,
                password: password
            },
            success: function (data) {
                // 5. 判断当前返回登录状态是否失败
                if (data.error) {
                    // 6. 提示用户错误的原因 错误的原因存在data.message这个属性里面
                    mui.toast(data.message, {
                        duration: 'long',
                        type: 'div'
                    })
                } else {
                    // 7. 表示登录成功 成功返回上一页详情页面  history.back()函数可以返回上一页
                    // 如果前一个页面没有完全加载完毕 回不去的 拿不到前一个页面的url
                    // history.back();
                    // 7.1 登录完成后就要回到我该回去的页面
                    // 7.2 拿到我该回去的页面的地址
                    // 7.3 获取当前登录页面 后面参数returnUrl参数的值 就是我该返回的页面路径
                    var returnUrl = getQueryString('returnUrl');
                    console.log(returnUrl);
                    // 7.4 跳转到这个returnUrl这个页面
                    location = returnUrl;
                }
            }
        })
    });

    // 1. 给注册按钮添加点击事件 tap事件会更快一些
    $('.btn-register').on('tap', function () {
        // 2. 跳转到注册页面
        location = 'register.html';
    });

    // 使用网上封装好的正则的方式完成url参数的值的获取
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            // 默认使用encodeURI去对中文进行的加密  使用decodeURI解密
            return decodeURI(r[2]);
        }
        return null;
    }
})