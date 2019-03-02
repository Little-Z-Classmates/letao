$(function () {

    /*  1. 实现添加搜索记录的功能
       1. 点击搜索按钮实现添加记录
       2. 获取当前输入的搜索的内容
       3. 保存到本地存储里面 */
    // 1. 给搜索按钮添加点击事件 注意是tap事件 不会延迟
    $('.btn-search').on('tap', function () {
        // 2. 获取当前输入的内容 因为用户可能会输入空格之类的字符进行去空格和判断非空 
        // trim函数可以去除字符串2端的空格
        var search = $('.input-search').val().trim();
        console.log(search);
        // 3. 对输入内容进行非空判断 如果不为空才能添加记录
        if (search == '') {
            mui.toast('请输入要搜索的商品', {
                duration: 2000,
                type: 'div'
            })
            // 4. return 让后面的的代码不在执行
            return;
        }
        // 定义一个数组  数组用来存储之前本地存储已经存储的记录 （如果记录就为空）
        // 5.1 先查询本地存储的记录 看看有没有值 有值就直接使用里面的值 没有值就空数组        
        var str = localStorage.getItem('searchHistory');
        // 5.2 由于取出来也是一个字符串 （因为存进去是字符串 ） 取出来之后要转成真正的数组
        var arr = JSON.parse(str) || []; // 把取出来的字符串srt 转成一个数组 如果转换失败 就使用空数组
        // var arr = [];
        // 5.3 把用户输入的搜索记录存起来 把搜索记录存储到本地存储中
        // 5.4 往数组中加值之前要先看看有没有重复的值 有重复的值就把旧的删掉重新添加新的
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].key == search) {
                // 只要当重复就把之前数组的这个值删掉 把当前arr[i]的值删掉 删1个
                arr.splice(i, 1);
                // 如果要完善一些使用i-- 数组的值少了一个 索引就要减少一个
                i--;
            }
        }
        console.log(arr);
        // 5.5 去除了重复的值之后再添加  如果你要最新的在最前面使用 unshift把值往数组的前面加
        arr.unshift({
            key: search
        });
        // 往后加就使用push
        // arr.push({
        //     key: search
        // });
        // 本地存储存储值的只能存储字符串 对象数组都会调用其toString方法转出字符串
        // {key:'鞋'}  [object,object]
        // 需要把对象或者数组转出json格式的字符串  JSON.stringfy({key:'鞋'})   变成JSON字符串 {"key":"方式发送到"}
        // 6. 把准备好的数组存储到本地存储中 存储的时候也要转出字符串存储
        localStorage.setItem('searchHistory', JSON.stringify(arr));
        // 7 添加完成后查询一次
        qeuryHistory();
        // 8. 添加完成后清空输入框
        $('.input-search').val('');

        // 9. 点击了商品搜索添加完成历史记录后还要跳转到商品列表页面 而且我还要把当前搜索的内容作为参数传递到下一个页面
        // 除了需要传递搜索的内容还需要跟一个时间差 为了让url地址发生变化 浏览器就会重新发送请求而不会使用缓存
         
        location = 'productlist.html?search='+search+'&time='+new Date().getTime();
        // js是在html文件里面的执行的所以JS里面的路径都是相对html文件的距离
        // document.body.style.backgroundImage = 'url(./images/active1.png)';
    });


    // 2. 搜索记录的查询功能
    //     1. 获取本地存储的数据来查询
    //     2. 创建一个模板传入这些获取到数据
    //     3. 但是由于数据存的时候不是对象而是一个数组  调用模板的时候应该包装成一个对象 {rows:arr};
    //     4. 渲染模板即可
    // 刚加载查询一次
    qeuryHistory()
    // 由于刚加载需要查询 添加完成了也要查询  包括删除 清空也要查询 封装成一个函数方便到处使用
    function qeuryHistory() {
        // 2.1 先查询本地存储的记录 看看有没有值 有值就直接使用里面的值 没有值就空数组        
        var str = localStorage.getItem('searchHistory');
        // 2.2 由于取出来也是一个字符串 （因为存进去是字符串 ） 取出来之后要转成真正的数组
        var arr = JSON.parse(str) || []; // 把取出来的字符串srt 转成一个数组 如果转换失败 就使用空数组
        // 2.3 调用模板生成HTML
        var html = template('searchHistoryTpl', {
            rows: arr
        });
        console.log(html);
        // 2.4 把html添加到ul里面
        $('.history-list').html(html);
    }


    /* 3. 删除搜索记录
        1. 点击删除按钮删除一个记录
        2. 获取当前点击x的索引  在查询的时候先把当前元素的索引绑定到删除按钮上
        3. JS获取当前x的data-index属性的值就是删除的索引
        4. 获取本地存储的数组把这个索引的值删掉
        5. 等删除完成要重新调用查询刷新数据*/
    // 1. 给所有的删除按钮添加点击事件 因为删除按钮是动态添加的使用委托方式添加事件
    $('.history-list').on('tap', '.btn-delete', function () {
        // 2. 获取当前删除元素的 data-index属性的值
        var index = $(this).data('index');
        // 3. 获取本地存储 数组
        // 4. 先查询本地存储的记录 看看有没有值 有值就直接使用里面的值 没有值就空数组        
        var str = localStorage.getItem('searchHistory');
        // 5 由于取出来也是一个字符串 （因为存进去是字符串 ） 取出来之后要转成真正的数组
        var arr = JSON.parse(str) || []; // 把取出来的字符串srt 转成一个数组 如果转换失败 就使用空数组
        // 6. 调用数组的arr.splice(index,1);
        arr.splice(index, 1);
        // 7. 删除完成后要重新存储到本地存储中 也要转成字符串保存
        localStorage.setItem('searchHistory', JSON.stringify(arr));
        // 8. 删除完成后调用查询刷新页面
        qeuryHistory();
    });

    /* 4. 清空记录
        1. 获取本地存储把键删掉即可   或者直接clear  但是不推荐 推荐使用removeItem()
        2. 清空完成后重新查询刷新页面 */
    // 1. 给清空按钮添加点击事件
    $('.btn-clear').on('tap', function () {
        // 2. 删除当前searchHistory键
        localStorage.removeItem('searchHistory');
        // 3. 重新查询
        qeuryHistory();
    });

   
})