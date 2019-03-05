$(function () {
    // 页面刚加载调用当前查询商品的函数
    queryProduct(locationQuery().search)
    // 调用当前商品搜索页面的搜索功能
    searchProduct()
    // 调用商品排序功能
    sortProduct();
    // 调用下拉刷新和上拉加载的功能函数
    pullRefresh();

    // 封装一个得到 地址query 参数的函数
    function locationQuery() {
        let queryInfo = decodeURI(location.search)
        queryInfo = queryInfo.substr(1, queryInfo.length).split('&')
        var valueObj = {}
        queryInfo.forEach(item => {
            var arrList = item.split('=')
            valueObj[arrList[0]] = arrList[1]
        })
        return valueObj
    }
    // 初始化 滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });


    // 1. 查询商品列表的函数
    function queryProduct(searchName) {
        $.ajax({
            url: "http://localhost:3000/product/queryProduct",
            data: {
                page: 1,
                pageSize: 5,
                proName: searchName
            },
            dataType: "json",
            success: function (results) {
                console.log(results);
                var contentTplHtml = template('contentTpl', {
                    list: results.data
                })
                $('#contentInfo').html(contentTplHtml)
            }
        })
    }
    // 2. 点击当前商品搜索列表,实现搜索功能
    function searchProduct() {
        // 2.1 获取按钮添加点击事件 使用zepto都使用tap事件
        $('.btn-search').on('tap', function () {
            var search = $('.input-search').val().trim()
            if (!search) {
                mui.toast('请输入合法搜索内容!', {
                    duration: 'long',
                    type: 'div'
                })
                // 后面的代码也不执行了 所有使用return
                // return;
                // return false 不仅仅可以终止当前函数 还可以终止后面还要做的事情 比如表单提交等
                return false;
            }
            var inputInfo = {
                id: Date.now(),
                info: search
            }
            var HistoryInfoList = localStorage.getItem('HistoryInfoList') || '[]'
            HistoryInfoList = JSON.parse(HistoryInfoList)
            HistoryInfoList = HistoryInfoList.filter(function (element) {
                return (element.info != inputInfo.info)
            })
            HistoryInfoList.unshift(inputInfo)
            localStorage.setItem('HistoryInfoList', JSON.stringify(HistoryInfoList))
            queryProduct(search)
        })
    }


    // 商品排序功能函数
    function sortProduct() {
        $('.mui-card-header a').on('tap', function () {
            $(this).addClass('colorActive').siblings().removeClass('colorActive')
            var sort = $(this).data('sort');
            if (sort == 2) {
                sort = 1;
                // 4.1 把图标改成向上 把之前向下图标删掉换成向上
                $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                sort = 2;
                // 4.1 把图标改成向下 把之前向上图标删掉换成向下
                $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
            $(this).data('sort', sort);
            var type = $(this).data('type');
            var proName = locationQuery().search
            var obj = {
                proName: proName,
                page: 1,
                pageSize: 4
            }
            obj[type] = sort;
            $.ajax({
                url: '/product/queryProduct',
                data: obj,
                success: function (results) {
                    console.log(results);
                    var contentTplHtml = template('contentTpl', {
                        list: results.data
                    })
                    $('#contentInfo').html(contentTplHtml)
                }
            })
        })
    }

    function pullRefresh() {
        mui.init({
            pullRefresh: {
                // 指定当前下拉刷新的父容器 建议使用id选择器给区域滚动添加一个 pullrefresh id
                container: '#pullrefresh',
                // 初始化下拉刷新
                down: {
                    // 下拉刷新的回调函数 用真正的刷新数据 发送请求真实刷新数据和页面
                    callback: pulldownRefresh
                },
                // 初始化上拉加载更多
                up: {
                    // 上拉加载的回调函数 用来真正请求更多数据 追加到页面上
                    callback: pullupRefresh
                }
            }
        });
        // 2. 指定下拉刷新的具体业务函数
        function pulldownRefresh() {
            // 如果想要请求慢一点转久一点 加一个定时器延迟请求
            setTimeout(function () {
                // 4. 调用查询函数重新查询刷新页面
                queryProduct(locationQuery().search)
                // 5. 刷新完成要调用结束转圈圈的函数 函数代码一定不要写错 官网文档有错
                // mui('#pullrefresh').pullRefresh().endPulldown();
                // 使用官方demo文档里面新版代码结束转圈圈
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            }, 1000);
        }
        var page = 1;

        function pullupRefresh() {
            var proName = locationQuery().search
            // 如果想要请求慢一点转久一点 加一个定时器延迟请求
            setTimeout(function () {
                //   proName = getQueryString('search')
                // 6. 请求更多数据 请求下一页数据 定义一个page 进行 ++page
                $.ajax({
                    url: '/product/queryProduct',
                    data: {
                        proName: proName,
                        // 定义一个变量page存储了当前页码数 请求下一页让page进行++ 要前自增
                        page: ++page,
                        pageSize: 4
                    },
                    success: function (results) {
                        // 7. 判断如果数据已经没有长度 表示没有数据 不需要调用模板和追加 直接提示没有数据了
                        if (results.data.length > 0) {
                            // 8.1 调用模板生成商品列表结构
                            var contentTplHtml = template('contentTpl', {
                                list: results.data
                            })
                            // 8.2 请求了更多数据下一页 追加到页面 append函数
                            $('.product-list .mui-row').append(contentTplHtml);
                            // 8.3 数据追加完毕要结束转圈圈 注意这个函数是up不是down
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        } else {
                            // 9. 没有数据 结束转圈圈 并且提示没有数据了
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                        }
                    }
                })
            }, 1000)
        }
    }
})