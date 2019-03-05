$(function () {
    // $.ajax({
    //     type: 'get',
    //     url: 'http://localhost:3000/category/queryTopCategory',
    //     dataType:'json',
    //     success:function( results ){
    //          console.log( results );
    //     },
    //     error:function(err){
    //        console.log(err+'错误...');
    //     }
    // })
    var liList = document.querySelectorAll('.mui-table-view-cell')
    getlistInfo(1)
    $('.mui-table-view').on('click', 'li', function () {
        var liId =  this.dataset.id
        liId =  parseInt(liId)
        getlistInfo(liId)
    })

    function getlistInfo (liId){
        $.ajax({
            url: '/category/querySecondCategory',
            data: { id:  liId },
            success: function (data) {
                console.log(data);
                var categotyListInfo = data.rows
                var tplRightHtml = template('tpl-right', { list: categotyListInfo })
                $('.category-right>.mui-row').html(tplRightHtml)
            },
            type: 'get',
            dataType: 'json'
        })
    }

    $.ajax({
        // 因为已经在localhost:3000域名下打开页面
        url: '/category/queryTopCategory',
        success: function (data) {
            console.log(data);
            var categotyNames = data.rows
            var tplLeftHtml = template('tpl-left', { list: categotyNames })
            $('.mui-table-view').html(tplLeftHtml)
        },
        type: 'get',
        dataType: 'json'
    })



    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条 如果不想要滚动条把这个参数的值改成false
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    })


})