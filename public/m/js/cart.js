$(function () {
    /* 1. 实现购物车的动态渲染
      1. 请求购物车的列表的API
      2. 调用API必须传入分页
      3. 创建模板生成渲染页面 */
    // 页面刚加载的时候调用查询购物车列表
    queryCart();
    // 查询购物车列表的代码需要重复使用封装一个函数
    function queryCart() {
        // 1. 请求购物车的列表的API
        $.ajax({
            url: "/cart/queryCartPaging",
            data: {
                page: 1,
                pageSize: 4
            },
            success: function (data) {
                // 2. 判断返回是否有报错有报错表示未登录 跳转到登录页面
                if (data.error) {
                    // 3. 跳转到登录页面 并且登录 成功 应该跳转回到当前购物车页面
                    // 跳转到登录页面 并且传递一个参数returnUrl 值是当前页面的url地址 等登录成功后 就会跳转回到这个地址
                    location = 'login.html?returnUrl=' + location.href;
                } else {
                    // 4. 没有失败就有数据 调用模板渲染购物车列表
                    console.log(data);
                    // 4.1 有可能数据 是空的 是一个空数组 模板引擎只能传对象
                    if (data instanceof Array) {
                        // 由于data是一个空数组 模板引擎要求是对象把数组包装在对象里面的data数组上
                        var html = template('cartListTpl', {
                            data: []
                        });
                    } else {
                        var html = template('cartListTpl', data);
                    }

                    // 5. 把html放到购物车列表里面
                    $('.cart-list').html(html);
                }
            }
        });
    }

    /* 2. 下拉刷新的使用
        1. 写结构
        2. 初始化 
        3. 写2个回调函数
        4. 下拉刷新回调函数  刷新数据 结束下拉 重置上拉 重置page
        5. 上拉请求更多数据 追加数据 结束上拉 可能没有数据 提示没有数据了 */
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            down: {
                callback: pulldownRefresh
            },
            up: {
                contentrefresh: '正在加载...',
                callback: pullupRefresh
            }
        }
    });
    /**
     * 下拉刷新具体业务实现
     */
    function pulldownRefresh() {
        setTimeout(function () {
            // 1. 下拉刷新的时候也要调用查询查询购物车列表
            queryCart();
            // 2. 结束下拉刷新的效果 不然会一直转圈圈
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            // 3. 重置上拉加载的效果
            mui('#pullrefresh').pullRefresh().refresh(true);
            // 4. 当前页码数也要重置为1
            page = 1;
        }, 1500);
    }
    // 当前页码数
    var page = 1;
    /**
     * 上拉加载具体业务实现
     */
    function pullupRefresh() {
        setTimeout(function () {
            // 1. 上拉加载更多数据
            // 1. 请求购物车的列表的API
            $.ajax({
                url: "/cart/queryCartPaging",
                data: {
                    page: ++page,
                    pageSize: 4
                },
                success: function (data) {
                    // 2. 判断返回是否有报错有报错表示未登录 跳转到登录页面
                    if (data.error) {
                        // 3. 跳转到登录页面 并且登录 成功 应该跳转回到当前购物车页面
                        // 跳转到登录页面 并且传递一个参数returnUrl 值是当前页面的url地址 等登录成功后 就会跳转回到这个地址
                        location = 'login.html?returnUrl=' + location.href;
                    } else {
                        // 4. 判断当前返回回来的数据是否是一个数组 
                        // 如果是一个数组就表示没有数据 如果不是一个数组是对象就表示有数据
                        // 数组是复杂类型的数据 不能使用 typeof 去判断类型
                        if (data instanceof Array) {
                            // 判断如果返回数据是一个数组 空数组不是对象表示没有数据了
                            // 5. 当没有数据的结束上拉加载并且提示没有数据了 传入一个true
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                        } else {
                            // 6. 有数据 调用模板追加渲染购物车列表
                            console.log(data);
                            var html = template('cartListTpl', data);
                            // 7. 上拉加载加载更多追加页面 使用append
                            $('.cart-list').append(html);
                            // 8. 追加完成后要结束上拉加载的效果
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        }

                    }
                }
            });

        }, 1500);
    }


    /* 1. 购物车的删除
        1. 点击删除按钮的时候 弹出一个确认框
        2. 获取用户点击了确定 还是 取消
        3. 如果点击了取消不删 滑动回去
        4. 点击了确定 获取当前要删除id删除当前这个商品 */
    // 1. 给删除按钮添加事件 由于按钮动态的使用委托添加
    $('.cart-list').on('tap', '.btn-delete', function name(params) {
        // 获取要滑动的li元素 千万注意要求是dom对象不是zepto
        var li = this.parentNode.parentNode;
        // console.log(this.dataset['id']);
        // 获取当前要删除的商品id 
        var id = $(this).data('id');
        console.log(id);
        //   2. 弹出确认框问用户是否删除
        mui.confirm('您真的要删除我吗？', '温馨提示', ['确定', '取消'], function (e) {
            console.log(this); // 确认框改变this指向是window
            // 3. 这个回调函数就是点击了确定 或者 取消会触发的回调函数
            console.log(e);
            // 4. 判断如果点击了取消
            if (e.index == 1) {
                // 5. 取消就要滑动回去
                // 5.1 手动设置样式 让位移还原
                // 5.2 使用官方的API滑回去        
                // 这个函数是mui的函数 不是zepto的函数
                // $.swipeoutClose(li); $不是zepto是mui li是dom元素不zepto元素
                mui.swipeoutClose(li);
            } else {
                // 6. 点击了是就获取当前要删除的id去删除这个商品
                // 获取当前要删除的商品id 不能放到确认框里面写 确认框改变this指向已经不是按钮了
                // var id = $(this).data('id');
                // 7. 调用API 传人当前要删除的id去删除商品
                $.ajax({
                    url: '/cart/deleteCart',
                    data: {
                        id: id
                    },
                    success: function (data) {
                        console.log(data);
                        // 8. 删除成功可以移除掉这个元素 可以调用查询重新刷新页面
                        // 找到li的爸爸 删除自己
                        // li.parentNode.removeChild(li);
                        // 调用查询函数
                        queryCart();
                    }
                })
            }
        })
    });


    /* 1. 购物车的编辑
        1. 点击编辑按钮 
        2. 弹出一个确认框
        3. 准备一个编辑的模板 （编辑尺码 和 数量）
        4. 准备好了之后把编辑的模板html标签 放到确认框的内容里面
        5. 对尺码 和 数量 初始化 让尺码能够点击 让数量能够点击
        6. 点击了确认框的确定 获取最新用户选择的尺码和数量 调用API实现编辑功能 */
    // 1. 给编辑按钮添加点击事件 动态元素也要委托
    $('.cart-list').on('tap', '.btn-edit', function () {
        // 获取要滑动的li元素 千万注意要求是dom对象不是zepto
        var li = this.parentNode.parentNode;
        // 3. 准备好要编辑html模板 要放到确认框里面
        // 3.1 通过自身自定义属性product获取整个商品对象
        // 存的时候是字符串但是 data函数会把字符串转成一个对象 推荐使用data函数 除了取值还会自动做类型转换
        var product = $(this).data('product');
        console.log(product);
        // 3.2 注意这里所有尺码属性的productSize不是size  size是当前选择的尺码 获取40-50按照-分割第一个就是40 把字符串一来就转出数字
        var start = product.productSize.split('-')[0] - 0;
        // 第二个是50
        var end = product.productSize.split('-')[1];
        // 3.3 创建一个新的空数组
        var size = [];
        // 3.4 循环从40开始到 50结束
        for (var i = start; i <= end; i++) {
            size.push(i);
        }
        console.log(size);
        // 3.5 替换data数据里面的size 赋值为我们处理好的size数组
        product.productSize = size;
        console.log(product);
        // 3.6 调用模板生成编辑的结构
        var html = template('editCartTpl', product);
        // console.log(html);  
        // /正则 匹配里面所有\r 回车 \n表示换行 /  /g 表示全局 替换空字符串 
        html = html.replace(/[\r\n]/g, "");
        // console.log(html);
        // 3.7 因为html模板标签中有很多回车换行符 到确认框里面编译成br标签 把模板中的回车换行去掉
        // 2. 弹出确认框  4. 把准备好的模板放到确认框里面  确认框除了放文字还可以放标签
        mui.confirm(html, '编辑商品', ['确定', '取消'], function (e) {
            // 5. 完成编辑功能
            // 5.1 判断用户点击确定还是取消
            if (e.index == 1) {
                // 5.1 点击了取消 滑动回去
                mui.swipeoutClose(li);
            } else {
                // 5.2 如果点击了确定 获取当前最新点击的尺码和数量 当同事有2个类名表示被选中了
                var size = $('.btn-size.mui-btn-warning').data('size');
                // 5.3 获取数字框 使用MUi官方提供的函数获取
                var num = mui('.mui-numbox').numbox().getValue();
                // 5.4 调用编辑的API传入 最新尺码数量和商品id
                $.ajax({
                    url: '/cart/updateCart',
                    type: 'post',
                    // id就是当前商品id 当前整个商品在product对象里面
                    data: {
                        id: product.id,
                        size: size,
                        num: num
                    },
                    success: function (data) {
                        // 5.5 判断如果编辑成功 调用查询刷新页面
                        if (data.success) {
                            queryCart();
                        }
                    }
                })
            }
        });
        // 4. 对 尺码和 数量进行初始化 等标签渲染出来之后才能调用初始化 确认框执行了之后就渲染出来了
        // 4.1 数字框也是动态添加的也要手动初始化 使用数字框的容器选择器
        mui('.mui-numbox').numbox();
        // 4.2 尺码按钮的点击初始化 给所有尺码按钮添加点击事件 因为尺码按钮已经出来了就不需要委托了
        $('.btn-size').on('tap', function () {
            // 4.3 给当前点击按钮添加类名 其他兄弟删掉这个类名
            $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning')
        });
    });


    /* 1. 计算总金额
        1. 复选框选择发生改变的时候所有选中的复选框
        2. 遍历所有选中复选框
        3. 获取遍历每个商品的单价 价格*数量
        4. 把每个商品的累加起来 商品总价
        5. 把总金额显示到页面 */
    // 1. 给复选框添加一个change事件 change复选框的值发生改变就会触发的事件
    $('.cart-list').on('change', '.checkbox-product', function () {
        // 2. 获取当前所有被选中的复选框 :checked 伪类 选中所有选中的复选框
        var checkeds = $('.checkbox-product:checked');
        console.log(checkeds);
        // 定义一个总价 默认为0
        var sum = 0;
        // 3. 遍历所有选中的复选框
        checkeds.each(function (index, value) {
            //  4. 通过复选框的属性获取商品价格和 数量
            // var price = $(value).data('price');
            // console.log(price);
            // var num = $(value).data('num');
            // console.log(num);
            // var singlePrice = price * num;
            // // 把每个单价累加到总价上
            // sum += singlePrice;
            // 4. 获取复选框属性的价格和数量相乘 然后 累加到商品的总价
            sum += $(value).data('price') * $(value).data('num');
        });
        // console.log(sum);        
        // 由于JS计算小数的时候会产生很多小数 保留2位小数后面的去掉
        // sum = parseInt(sum * 100) / 100;
        // toFixed函数 保留2位小数 使用四舍五入的方式  函数里面写几就保留几位
        sum = sum.toFixed(2);
        console.log(sum);
        // 5. 把总金额放到页面上
        $('.order-count span').html(sum);
    })
})