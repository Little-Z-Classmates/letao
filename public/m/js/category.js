$(function () {
    // 如果考虑性能优先使用tap 的js方式调整
    //   1. 先获取返回上一页的元素 移动端推荐使用tap事件 不会延迟  zepto里面封装好了tap事件
    $('#header .left').on('tap', function () {
        // 2. 当点击的时候调用 历史记录返回上一页
        history.back();
    });

    // 由于区域滚动默认也是没有初始化需要手动初始化
    mui('.mui-scroll-wrapper').scroll({
        indicators: true, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    /* 1. 实现分类左侧的数据渲染
        1. 请求一级分类的接口  localhost:3000/category/queryTopCategory
        2. 创建模板 传人后台返回的数据
        3. 渲染模板 */
    // 1. 使用zepto$.ajax发送请求
    $.ajax({
        // type:'get', 默认是get可以省略
        // url:'http://localhost:3000/category/queryTopCategory',
        url: '/category/queryTopCategory', // 因为当前页面的根目录就是localhost:3000 可以省略直接写一个/    
        // 不写/表示默认./ 写了/ 表示根目录
        // data:{} 如果有参数可以写参数 没有可以省略
        // dataType:'json' 如果默认返回json数据 也可以省略
        beforeSend: function () { // 比success 快 请求发送之前马上调用
            console.log('请求前');
            // 显示遮罩层
            $('.mask').show();
        },
        complete: function () { // 比success还慢 请求完成渲染完成后才调用
            console.log('请求后')
            // 隐藏遮罩层
            $('.mask').hide();
        },
        success: function (data) { // ajax请求成功的回调函数 不能省略
            console.log(data); // data是一个对象    {list:data.rows}  如果单独创建对象也是对象  
            // 模板引擎要求传入对象 必须传入的一个对象  但是模板里面遍历的不是对象 是对象里面的数组
            // 2. 调用模板传入数据 template函数就生成模板的函数 第一个参数是模板id 第二个是数据对象
            var html = template('categoryLeftTpl', data);
            console.log(html);
            // 3. 把生成的模板渲染到左侧分类的ul里面
            $('.category-left ul').html(html);
        }
    });
    $.get('/category/queryTopCategory',function (){
      
    })


    /* 2. 实现点击左侧分类显示对应的右侧分类
        1. 给左侧分类添加点击事件 
        2. 请求二级分类的数据（他需要左侧分类点击的id） 获取当前点击的id传递到APi参数里面
        3. 创建右侧分类模板
        4. 渲染模板 */
    // 1. 给分类左侧添加点击事件 由于li是动态添加的不能直接添加事件 要使用事件委托
    // 如果使用事件委托 第一个参数是事件名 第二个是委托元素 第三个是回调函数
    $('.category-left ul').on('tap', 'li', function () {
        // 2. 获取当前点击li的id 通过原生Js获取自定义属性的值的方式获取li身上的id属性 的值 dataset对象.属性名 或者 dataset['id']
        // console.log(this.dataset.id);this.dataset['id'] 
        // console.log(this.getAttribute('data-id'));
        // console.log($(this).data('id'))
        // console.log($(this).attr('data-id'))
        // 有4种方式读取自定义属性的值 2种原生  2种的jquery和zpeto的   
        // dataset和data函数是一样的  都不需要带data- 只要写data-后面的  dataset和data函数都专门读取自定义属性 不考虑其他属性 效率高
        // getAttribute和attr是一样的 都需要带data-写属性的全称  把标签所有属性都找一遍找到你要的属性 效率低
        var id = $(this).data('id');
        // 3. 在点击事件里面调用函数 传入当前点击的id
        querySecondCategory(id);
        // 4. 给点击li添加一个 .mui-badge-primary 类名 其他兄弟删除这个类名
        $(this).addClass('mui-badge-success').siblings().removeClass('mui-badge-success');
    });
    // 默认调用传人id为1
    querySecondCategory(1);
    // 6. 由于默认需要显示id为1的二级分类 让ajax默认请求一次以id为1方式请求 在单击事件外面也发送请求
    // 由于请求写2次 代码重复的就封装成函数 哪里需要哪里调用
    // 创建一个获取二级分类的函数 需要传人一个id
    function querySecondCategory(id) {
        $.ajax({
            url: '/category/querySecondCategory',
            //{id:id} 前面的id表示APi的参数名 后面的id表示当前变量名
            data: {
                id: id
            },
            beforeSend: function () { // 比success 快 请求发送之前马上调用
                console.log('请求前');
                // 显示遮罩层
                $('.mask').show();
            },
            complete: function () { // 比success还慢 请求完成渲染完成后才调用
                console.log('请求后')
                // 隐藏遮罩层
                $('.mask').hide();
            },
            success: function (data) {
                console.log(data);
                // 4. 调用模板生成html
                var html = template('categoryRightTpl', data);
                // 5. 把生成html放到右侧的mui-row里面
                $('.category-right .mui-row').html(html);
            }
        });
    }


    // 3. 加载中动画的使用
    //     1. 页面请求发送之前让加载动画显示
    //     2. 请求完毕让加载动画隐藏
})