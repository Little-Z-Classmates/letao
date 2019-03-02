$(function () {
    /* 1. 实现商品搜索功能
      1. 获取当前url中搜索关键字的参数的值(鞋)
      2. 使用location对象的search属性去获取整个url参数
      3. 再从整个url参数的中去找到这个搜索关键字的值
      4. 根据当前搜索关键字请求 拿到当前的商品列表数据
      5. 使用模板引擎渲染商品列表 */

    // search=鞋&time=1549938370025&time=1549938370025
    // 1. 根据url参数名search取值 拿到当前要搜索的关键字    
    var search = getQueryString('search');
    // 2. 根据搜索的关键字去请求商品列表的数据 调用封装好的请求函数
    queryProduct();
    // 封装一个发送商品列表请求刷新数据的函数
    function queryProduct() {
        $.ajax({
            url: '/product/queryProduct',
            /* proName就是搜索关键字的参数 值就是当前search变量 
            page分页 请求第几页
            pageSize 每页大小 每页返回多少条数据 */
            data: {
                page: 1,
                pageSize: 4,
                proName: search
            },
            success: function (res) {
                // data对象里面有一个data数组
                console.log(res);
                console.log(res.data);
                // 3. 调用模板生成商品列表的html
                var html = template('productListTpl', res);
                // 4. 吧商品列表的模板放到商品列表的内容的mui-row里面
                $('.product-list .content .mui-row').html(html);
            }
        });
    }

    /* 2. 实现商品的排序功能
        1. 点击排序按钮的时候实现排序功能
        2. 暂时后台只支持价格和数量的排序
        3. 对价格进行排序 传递一个价格排序的参数price参数 传递一个参数的值传1是升序 2是降序
        4. 获取排序后的数据渲染页面 */


    // 1. 给所有排序按钮添加点击事件 tap事件    
    $('.title a').on('tap', function () {
        // 2. 获取当前点击的a排序类型 因为排序类型存在data-sort-type属性 上面的
        var sortType = $(this).data('sort-type');
        console.log(sortType);
        // 3. 获取当前的排序的顺序 (如果是1升序变成2降序 如果是2降序变成1升序)
        var sort = $(this).data('sort');
        console.log(sort);
        // 4. 3元运算符 判断sort是否等于1  如果等于1 返回2  如果不等于1 返回1
        sort = sort == 1 ? 2 : 1;
        // 5. 把修改了之后的排序顺序设置到页面上
        $(this).data('sort', sort);
        // 6. 调用API实现排序
        // 7. 定义一个参数对象obj
        var obj = {
            page: 1,
            pageSize: 4,
            proName: search
        }
        // 8. 给obj对象动态添加一个属性  属性是一个变量 注意只能使用[]方式添加
        obj[sortType] = sort;
        console.log(obj);
        // 9. 根据搜索的关键字去请求商品列表的数据
        $.ajax({
            url: '/product/queryProduct',
            // 使用准备好的参数对象 里面可能进行价格或者数量排序
            data: obj,
            success: function (res) {
                // data对象里面有一个data数组
                console.log(res);
                console.log(res.data);
                // 3. 调用模板生成商品列表的html
                var html = template('productListTpl', res);
                // 4. 吧商品列表的模板放到商品列表的内容的mui-row里面
                $('.product-list .content .mui-row').html(html);
            }
        });
    });

    /*  1. 写一个下拉刷新和上拉加载的结构
     2. 初始化下拉刷新和上拉加载更多 传人下拉刷新 父容器
     3. 传人down 表示初始化下拉刷新和 up 初始化下拉刷新和上拉加载更多
     4. down和up都有1 个回调函数 (当触发下拉 或者 上拉就会执行回调函数)
     5. 下拉刷新的回调函数 请求数据 刷新数据 结束下拉加载更多 重置上拉加载 重置page
     6. 上拉加载更多 请求下一页++page 追加数据append 
     有可能没有数据了 判断 数组没有长度 结束并且提示没有数据了
     7. 如果需要改变提示文字可以查看官网文档根据属性修改
     8. 但是注意官网文档 结束下拉和上拉的函数有问题(使用demo文档里面)  */

    // 1. 初始化下拉刷新和上拉加载更多
    // 2. 使用JS初始化下拉刷新
    mui.init({
        pullRefresh: {
            // 指定一个下拉刷新的容器 也是就是区域滚动的父容器
            container: '#pullrefresh',
            // down表示初始化下拉刷新
            down: {
                height: 50,
                contentdown: "你正在往下拉请继续拉", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "可以松手了", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在拼命加载中...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                // callback指的是下拉刷新的回调函数
                callback: pulldownRefresh
            },
            // up表示初始化上拉加载更多
            up: {
                contentrefresh: '正在拼命加载更多数据...',
                contentnomore: '在下实在给不了更多了!',
                callback: pullupRefresh
            }
        }
    });
    /**
     * 下拉刷新回调函数
     */
    function pulldownRefresh() {
        console.log('触发了一次下拉');
        // 回调给你用来刷新数据的  写ajax请求刷新数据 因为本地请求还是很快加一个定时器延迟一下
        setTimeout(function () {
            // 这些代码就相当于在刷新数据
            // 1. 发送ajax请求刷新数据 调用请求刷新数据的函数
            queryProduct();
            // 结束下拉刷新的函数 当数据请求完毕了之后要结束下拉刷新转圈圈的效果 如果不调用结束就会一直转
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            // 注意官网文档结束下拉刷新的函数是旧版本的 新版本已经换成endPulldownToRefresh 注意使用demo文档里面的代码
            // mui('#pullrefresh').pullRefresh().endPulldown();
            // 而且特殊强调 重置代码一定要等到下拉刷新结束了之后才能重置 不然重置不了
            // 当下拉刷新完成后去重置上拉加载更多(因为如果上拉到底了就再也拉不了了 )
            mui('#pullrefresh').pullRefresh().refresh(true);
            // 还要把我们业务page重置为1  
            page = 1;

        }, 1500);
    }
    var page = 1;
    /**
     * 上拉加载的回调函数
     */
    function pullupRefresh() {
        console.log('你触发了 上拉');
        // 定时器为了模拟延迟 
        setTimeout(function () {
            // 1. 上拉加载是要加载更多数据 使用append追加
            // 2. 上拉加载更多数据 就是下一页数据
            $.ajax({
                url: '/product/queryProduct',
                /* proName就是搜索关键字的参数 值就是当前search变量 
                page分页 请求第几页
                pageSize 每页大小 每页返回多少条数据 */
                data: {
                    page: ++page,
                    pageSize: 4,
                    proName: search
                },
                success: function (res) {
                    // 3. 判断当前返回数据是否有数据
                    // 判断返回数据的长度是否大于0 大于0表示有数据
                    if (res.data.length > 0) {
                        // 5. 调用模板生成商品列表的html
                        var html = template('productListTpl', res);
                        // 6. 把商品列表的模板追加商品列表的内容的mui-row里面
                        $('.product-list .content .mui-row').append(html);
                        // 7endPullupToRefresh 结束上拉加载更多  只结束转圈圈 但是可能还是有数据
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                    } else {
                        // 4. 如果数据返回的没有长度 表示没有数据了 结束上拉加载并且提示没有数据
                        // 调用结束上拉加载更多的函数 传递一个true就表示结束并且没有数据了
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    }

                }
            });

        }, 1500);
    }



    // 1. 点击立即购买跳转到商品详情并且传递当前的商品id过去
    // 1. 把商品id绑定到按钮的自定义属性上
    // 2. 添加点击事件获取当前id
    // 3. 使用location跳转页面 并且传递id参数
    // 因为按钮动态添加的元素使用委托方式添加
    $('.product-list').on('tap','.btn-buy',function (){
        var id = $(this).data('id');
        // console.log(id);
        location = 'detail.html?id='+id;
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






    // 根据url参数名 取值 自己写的
    // function getQueryString(name) {
    //     // substr(从第几个下标开始截,截多少字符串 不写截取到末尾)
    //     var search = location.search.substr(1);
    //     console.log(search);
    //     //  使用split函数进行分割 以&分割 分割多个参数
    //     var arr = search.split('&');
    //     // console.log(arr);
    //     for(var i = 0 ; i < arr.length ; i++){
    //         // console.log(arr[i]);
    //         // arr[i]是单个参数 search=鞋  使用=号分割 =号前面的就是参数名 =  号后面的就是参数的值
    //         // 判断=号前面的参数名是否和传递过来的一直
    //         if(arr[i].split('=')[0] == name){
    //             // 如果参数名一致就返回=号后面的参数的值
    //             // 而且也要对中文进行解码
    //             return decodeURI(arr[i].split('=')[1]);
    //         }
    //     }
    // }

})