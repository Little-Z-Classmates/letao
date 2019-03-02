$(function () {
    /*  1. 退出登录功能
       1. 给退出登录添加点击事件
       2. 点击的时候调用退出登录的API
       3. 退出了之后跳转到登录页面 登录完成后回到个人中心 */
    // 1. 给退出登录添加点击事件
    $('.btn-exit').on('tap', function () {
        // 2. 点击的时候调用退出登录的API
        $.ajax({
            url: '/user/logout',
            success: function (data) {
                console.log(data);
                // 3. 判断如果退出成功跳转到登录页面
                if (data.success) {
                    // 4. 退出登录跳转到登录页面 也要让登录成功会返回回来
                    location = 'login.html?returnUrl='+location.href;
                }
            }
        })
    });

    // 2. 显示当前用户信息
    // 1. 调用查询用户信息的API获取用户信息的数据
    $.ajax({
        // 直接根据当前登录的用户去获取信息 不需要传参
        url: '/user/queryUserMessage',
        success: function (data) {
            //  2. 判断是否失败 如果失败表示未登录 跳转到登录页面去登录
            if (data.error) {
                // 2.1 请求用户数据失败的时候 跳转到登录页面 告诉登录页面 你登录成功应该返回个人中心页面
                // ?returnUrl=user.html 这是一个参数 参数名叫returnUrl 参数的值 user.html
                location = 'login.html?returnUrl='+location.href;
            } else {
                console.log(data);
                // 3. 成功就把用户信息渲染出来
                $('.username').html(data.username);
                $('.mobile').html(data.mobile);
            }
        }
    })
})