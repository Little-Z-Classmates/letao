$(function () {
    // 使用框架式编程 定义函数和调用函数
    addHistory();
    queryHistory();
    deleteHistory();
    clearHistory();


    /* 1. 添加记录函数 */
    function addHistory() {
        /* 添加记录的思路
            1. 点击搜索添加记录 添加事件
            2. 获取当前输入内容 搜索的内容
            3. 判断如果没有输入内容 提示输入
            4. 把记录添加到本地存储中
            5. 因为连续添加记录应该把数据放到一个数组中 把数组整个加入到本地存储中
            6. 而且还得获取之前的数组之前有数组 使用之前的数组往这个里面添加 新的搜索的值
            7. 而且如果搜索内容重复还要对数组去重（把旧的删掉 在添加新的） 新的内容往数组最前面加
            8. 加完后把数组保存到本地存储中（转成json字符串） */
        // 1. 获取按钮添加点击事件 使用zepto都使用tap事件
        $('.btn-search').on('tap', function () {
            // 2. 获取当前输入内容 搜索的内容 把空格去掉 而且把首尾两端空格去掉
            var search = $('.input-search').val().trim();
            console.log(search);
            // 3. 判断如果没有输入内容 提示输入
            if (search == '') {
                // 提示请输入要搜索 商品 使用MUI的消息框 自动消失消息框
                mui.toast('请输入合法搜索内容!', {
                    duration: 'long',
                    type: 'div'
                });
                // 后面的代码也不执行了 所有使用return
                // return;
                // return false 不仅仅可以终止当前函数 还可以终止后面还要做的事情 比如表单提交等
                return false;
            }
            // 4. 把当前记录加入到一个数组中 这个数组要看之前有没有数据有就使用之前数组去加 如果没有值就使用新的空数组加
            var searchHistory = localStorage.getItem('searchHistory');
            // 5. 判断之前数组有没有值
            if(searchHistory){
                // 得把之前的值 转成一个数组
                searchHistory = JSON.parse(searchHistory);
            }else{
                // 否则没有值就是空 使用空数组
                searchHistory = [];
            }
            console.log(searchHistory);
        });

       
    }
    /* 2. 查询记录函数 */
    function queryHistory() {

    }

    /* 3. 删除记录函数 */
    function deleteHistory() {

    }

    /* 4. 清空记录函数 */
    function clearHistory() {

    }
})