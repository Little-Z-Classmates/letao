$(function () {
    // 使用框架式编程 定义函数和调用函数
    addHistory();
    queryHistory();
    $('.input-search').on('input',queryHistory)
    $('.input-search').on('blur',queryHistory)
    // deleteHistory();
    // clearHistory();

    // 1. 添加 搜索数据到 localStorage 中
    //  1.1 点击搜索按钮后 ， 两端去空格, 如果搜索内容为空, 出现提示框
    //  1.2 拿到页面数据，拿到 localStorage 数据，如果是第一个拿取,手动放置一个数组,遍历localStorage , 如果有重复的 ， 去重 后 加入添加到数组的第一个 
    //  1.3 添加好后 ， 再次添加到 localStorage 
    //  1.4 清空 search 框的内容

    // 2. 查询 数据
    //  2.1 input 搜索文本框中 , 添加 每次 input值改变事件 ： oninput 事件, ( 补充: onchange 事件是失去焦点才发生的事件 ) 
    //      把匹配得到的值放入页面上,记得把 localStorage 数组里面的 id 传入 进去 , 为删除做准备
    //  2.2 search 有焦点 , 搜索历史 才显示 , 否则隐藏

    // 3. 清除 数据
    //  3.1 点击清除按钮 localStorage 全部清除 , 清空页面上的 历史记录DOM 就行 ( 使用 tap )

    // 4. 删除 数据
    //  4.1 点击删除按钮 ,拿到id, 删除这个在 DOM 上的元素 , 根据id 删除 localStorage  
    function addHistory() {
        $('.btn-search').on('tap', function () {
            var inputInfo = {
                id: Date.now(),
                info: $('.input-search').val().trim()
            }
            if (inputInfo.info == '') {
                mui.toast('请输入正确的格式', {
                    duration: 1000,
                    type: 'div'
                })
                return false;
            }
            var HistoryInfoList = localStorage.getItem('HistoryInfoList') || '[]'
            HistoryInfoList = JSON.parse(HistoryInfoList)
            //    console.log( HistoryInfoList );
            HistoryInfoList = HistoryInfoList.filter(function (element) {
                return (element.info != inputInfo.info)
            })
            HistoryInfoList.unshift(inputInfo)
            localStorage.setItem('HistoryInfoList', JSON.stringify(HistoryInfoList))
            location.href = 'http://localhost:3000/m/productlist.html?search='+inputInfo.info +'&time=' + new Date().getTime()
            $('.input-search').val('')
        })
    }

    function queryHistory () {
        var HistoryInfoList = JSON.parse(localStorage.getItem('HistoryInfoList') || '[]')
        var searchInfo = $('.input-search').val().trim()
        HistoryInfoList = HistoryInfoList.filter(function (element) {
            return (element.info.startsWith(searchInfo))
        })
        var infoListHtml = template('tpl_hisinfo', {
            list: HistoryInfoList
        })
        $('.mui-table-view').html(infoListHtml)
    }
   

})