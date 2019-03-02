$(function () {
    /* 1. 注册功能
      1. 点击注册的时候 对输入表单进行非空验证
      2. 获取所有表单 遍历 如果哪个为空 获取输入框旁边的label的文字的内容 把这个文字内容跟上一个不允许为空  提示用户
      3. 如果表单验证通过 获取所有注册表单数据 用户名 密码 手机号 确认密码 验证码等
      4. 判断2次密码是否一致
      5. 判断验证码是否一致
      6. 调用注册API实现注册功能 */
    // 1. 给注册按钮添加点击事件
    $('.btn-register').on('tap', function () {
        // 2.6 在循环外面添加一个变量 flag 默认为true 表示表单都已经输入了
        var flag = true;
        // 2. 进行表单的非空验证
        // 2.1 获取所有输入表单
        $('.mui-input-group input').each(function (index, value) {
            //  2.2 获取当前每个输入框的值去空格
            var val = $(value).val().trim();
            // 2.3 判断当前val值是否为空 为空提示当前输入框不允许为空
            if (!val) {
                // 2.4 当当前输入框的值为空的时候才要获取当前输入框的上一个兄弟元素label里面的值 里面的文本值
                // console.log($(value).prev().data('text'));
                // 2.5 把当前提示内容弹框显示出来
                mui.alert($(value).prev().data('text') + "不允许为空");
                // 2.7 如果有一个表单为空 把flag变成false 表示有未输入的表单
                flag = false;
                // return只是后面的代码不执行了 只是退出了当前函数 但是后续循环还会执行后续函数还会执行
                // return;
                // return false 不仅后面的代码不执行 不仅退出当前函数 还会阻止默认行为 默认循环也会被退出 后面的函数也不会执行了
                // zepto 或者 jquery return false 可以阻止这个each遍历的默认行为
                return false;
            }
        });
        // var arr = [1, 2, 3, 4];
        // forEach也叫遍历不是循环
        // arr.forEach(function (value, index) {
        //     if (value == 2) {
        //         return false;
        //     }
        //     console.log(value);
        // })
        // for (var i = 0; i < 10; i++) {
        //     if (i == 5) {
        //         break 和 continue只能在循环里面使用  for while do while 这些才能使用break 和 continue
        //         循环和遍历是不一样的 for 和 each 遍历虽然都能循环都能遍历 但是for != each
        //         // break是退出整个循环 当循环到5退出了后 后面的代码就不会再执行了
        //         // break;
        //         // continue是退出一次循环
        //         continue;
        //     }
        //     console.log(i);
        // }
        // return 和 return false都是有作用域 只是在当前这个函数有用 
        // 只能return终止上面循环遍历的函数但是点击事件的函数的代码还是会继续执行
        // 2.8 判断当前flag是否还为true  为true表示表单都已经输入了
        if (flag) {
            // 表单非空验证就通过了
            // 1. 获取手机号 进行手机号合法验证 使用正则
            var mobile = $('.mobile').val().trim();
            if (!(/^1[3456789]\d{9}$/.test(mobile))) {
                mui.toast('请输入合法的手机号', {
                    duration: 'short',
                    type: 'div'
                })
                return false;
            }
            // 2. 获取用户名 验证 6位以上
            var username = $('.username').val().trim();
            if (username.length < 6 || username.length > 20) {
                mui.toast('请输入合法的用户名6-20位之间', {
                    duration: 'short',
                    type: 'div'
                })
                return false;
            }
            // 3. 获取密码判断2次密码是否一致
            var password1 = $('.password1').val().trim();
            var password2 = $('.password2').val().trim();
            if (password1 != password2) {
                mui.toast('两次输入的密码不一致', {
                    duration: 'short',
                    type: 'div'
                })
                return false;
            }

            // 4. 获取当前用户输入的验证码
            var nowvCode = $('.vcode').val().trim();
            // 4.1 用当前用户输入的验证码和全局变量的验证码进行判断
            if (nowvCode != vCode) {
                mui.toast('验证码输入错误!', {
                    duration: 'short',
                    type: 'div'
                })
                return false;
            }

            // 5. 调用注册的API实现注册功能
            $.ajax({
                url: '/user/register',
                type: 'post',
                data: {
                    mobile: mobile,
                    username: username,
                    password: password1,
                    vCode: vCode
                },
                success: function (data) {
                    console.log(data);
                    // 6. 判断是否注册成功 成功就跳转到某个页面 如果失败提示用户失败的原因
                    if (data.error) {
                        mui.toast(data.message, {
                            duration: 'short',
                            type: 'div'
                        });
                    }else{
                        // 7.如果注册成功 跳转个人中心
                        location = 'user.html';
                    }
                }
            });
        }

        // var check = true;
        // mui(".mui-input-group input").each(function () {
        //     //若当前input为空，则alert提醒 
        //     if (!this.value || this.value.trim() == "") {
        //         var label = this.previousElementSibling;
        //         mui.alert(label.innerText + "不允许为空");
        //         check = false;
        //         return false;
        //     }
        // }); //校验通过，继续执行业务逻辑 
        // if (check) {
        //     mui.alert('验证通过!')
        // }
    });
    var vCode = '';
    /* 2. 获取验证码
        1. 给获取验证码按钮添加点击事件
        2. 调用获取验证码的API获取验证码
        3. 把获取的验证码保存到全局变量里面 */
    $('.btn-get-vcode').on('tap', function () {
        // 2. 调用获取验证码的API获取验证码
        $.ajax({
            url: '/user/vCode',
            success: function (data) {
                console.log(data.vCode);
                // 给全局变的vCode赋值
                vCode = data.vCode;
            }
        })
    });
})