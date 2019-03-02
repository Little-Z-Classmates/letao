$(function () {

    /*  1. 渲染商品详情数据
         1. 根据当前url中的id参数的值 请求商品详情数据
         2. 动态渲染当前详情页面
         3. 使用模板去渲染 */
    // 1. 根据当前url中的id参数的值
    var id = getQueryString('id');
    console.log(id);
    // 2. 发送ajax请求传递当前id参数
    $.ajax({
        url: '/product/queryProductDetail',
        // 参数是API要求的参数的商品id  后面id我们变量id
        data: {
            id: id
        },
        success: function (data) {
            // 3.1 尺码数据返回的时候是一个字符串 但是模板只有数组才能遍历
            // 把40-50字符串 转出 [40,41..50]数组
            // 3.2 获取40-50按照-分割第一个就是40 把字符串一来就转出数字
            var start = data.size.split('-')[0] - 0;
            // 第二个是50
            var end = data.size.split('-')[1];
            // 3.3 创建一个新的空数组
            var size = [];
            // 3.4 循环从40开始到 50结束
            for (var i = start; i <= end; i++) {
                size.push(i);
            }
            console.log(size);
            // 3.5 替换data数据里面的size 赋值为我们处理好的size数组
            data.size = size;
            console.log(data);
            // 3. 调用模板生成html
            var html = template('productDetailTpl', data);
            $('.product-detail').html(html);
            // 4. 所有使用动态添加的内容 插件都需要进行手动初始化
            // 等到轮播图结构出来了之后再 初始化轮播图 因为当前轮播图是动态添加的
            // 5. 手动初始化轮播图
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
            });
            // 6. 初始化区域滚动 等动态添加的内容出来了之后再初始化区域滚动
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });
            // 6. 数字框也是动态添加的也要手动初始化 使用数字框的容器选择器
            mui('.mui-numbox').numbox();
            // 7. 尺码按钮的点击初始化
            // 7.1 给所有尺码按钮添加点击事件 因为尺码按钮已经出来了就不需要委托了
            $('.btn-size').on('tap', function () {
                // 7.2 给当前点击按钮添加类名 其他兄弟删掉这个类名
                $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning')
            });
        }
    });

    /* 2. 完成加入购物车功能
        1. 得给加入购物车按钮添加点击事件
        2. 验证当前是否选择了尺码或者数量
        3. 如果没有选择尺码或者数量 提示用户选择尺码和数量
        4. 如果选择了就获取当前商品id和 选择的尺码 和 数量 调用加入购物车的API加入购物车 */

    // 1. 给加入购物车按钮添加点击事件
    $('.btn-add-cart').on('tap', function () {
        // 2. 获取当前用户选择的尺码和数量 交集选择器 同所有2个类名表示按钮倍选中了
        var size = $('.btn-size.mui-btn-warning').data('size');
        console.log(size);
        // 3. 获取当前选择的数量
        var num = mui('.mui-numbox').numbox().getValue();
        console.log(num);
        // 4. 调用加入购物的API实现加入购物车
        $.ajax({
            url: '/cart/addCart',
            // post一定要写的
            type: 'post',
            // productId 接口定义的商品的id参数名 id 当前全局变量的id是一个id的值
            data: {
                productId: id,
                size: size,
                num: num
            },
            success: function (data) {
                console.log(data);
                // 5. 有可能会加入失败 加入失败的原因就是未登录 跳转到登录页面去登录
                if (data.error) {
                    // 6. 只要是error就表示未登录
                    // 跳转到登录页面去登录 不仅仅要跳转到登录页 还要告诉登录页面 你登录成功要回到当前详情页面
                    location = 'login.html?returnUrl='+location.href;
                } else {
                    // 7. 如果没有报错就加入成功 提示用户是否去购物车查看
                    /* Mui的确认框 第一个参数是提示内容 第二提示标题
                    第三个是提示按钮文字是数组 有2个文字
                    第四个是回调函数 里面可以写一个参数 参数是一个对象 e.index == 0 表示点击了左边的 e.index==1 表示点击了右边的 */
                    mui.confirm('加入成功是否去购物车查看？', '温馨提示', ['是', '否'], function (e) {
                        if (e.index == 0) {
                            // 表示单击了左边的是 跳转到购物车
                            location = 'cart.html';
                        } else {
                            // 点击了否 提示叫他继续添加
                            mui.toast('请继续添加', {
                                duration: 'long',
                                type: 'div'
                            })
                        }
                    });
                }
            }
        })
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

});