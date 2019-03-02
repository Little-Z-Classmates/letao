$(function () {
    /* 1. 实现商品搜索功能
      1. 获取当前url中搜索关键字的参数的值(鞋)
      2. 使用location对象的search属性去获取整个url参数
      3. 再从整个url参数的中去找到这个搜索关键字的值
      4. 根据当前搜索关键字请求 拿到当前的商品列表数据
      5. 使用模板引擎渲染商品列表 */

    // search=鞋&time=1549938370025&time=1549938370025
    // 1. 根据url参数名search取值 拿到当前要搜索的关键字    
    var search = getQueryString('time');
    // 2. 根据搜索的关键字去请求商品列表的数据
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
        if (sortType == 'price') {
            // 2. 根据搜索的关键字去请求商品列表的数据
            $.ajax({
                url: '/product/queryProduct',
                /* proName就是搜索关键字的参数 值就是当前search变量 
                page分页 请求第几页
                pageSize 每页大小 每页返回多少条数据 */
                data: {
                    page: 1,
                    pageSize: 4,
                    proName: search,
                    price: sort
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
        } else if (sortType == 'num') {
            // 2. 根据搜索的关键字去请求商品列表的数据
            $.ajax({
                url: '/product/queryProduct',
                /* proName就是搜索关键字的参数 值就是当前search变量 
                page分页 请求第几页
                pageSize 每页大小 每页返回多少条数据 */
                data: {
                    page: 1,
                    pageSize: 4,
                    proName: search,
                    num: sort
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

    });







    // 使用网上封装好的正则的方式完成url参数的值的获取
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + "search" + '=([^&]*)(&|$)', 'i');
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