$(function () {

      // 为局部滑动进行初始化
      mui('.mui-scroll-wrapper').scroll({
        // indicators: false, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
      });

      // 为返回箭头注册点击事件
      $('#header .left').on('tap', function () {
        // console.log(111);
        history.back();
      })

      // 发送ajax请求,main左侧根据后端数据渲染出来
      // 发送1级分类请求
      $.ajax({
        url: '/category/queryTopCategory',
        beforeSend:function () {
          $('.mask').show();
        },
        complete: function () {
          $('.mask').hide();
        },
        success: function (data) {
          console.log(data);
          var html = template('categoryLeftTpl', data);
          // console.log(html);
          $('#main .left .mui-table-view').html(html);
        }
      })

      // 给左侧的li元素一级分类注册点击事件->点击发送请求渲染右边显示出2级分类
      $('#main .left .mui-table-view').on('tap', 'li', function () {
        var id = $(this).data('id');
        $(this).addClass('mui-badge-primary').siblings().removeClass('mui-badge-primary');

        // 调用2级分类请求,并且渲染页面
        querySecondCategory (id)
       
      })

      // 已进入分类页面则发送请求,并且渲染页面
      querySecondCategory (1);

      // 二级分类请求,并渲染页面封装起来
      function querySecondCategory (id) {
        $.ajax({
          url: '/category/querySecondCategory',
          data: {
            id: id
          },
          beforeSend:function () {
            $('.mask').show();
          },
          complete: function () {
            $('.mask').hide();
          },
          success: function (data) {
            console.log(data);
            var html = template('categoryRightTpl', data);
            // console.log(html);
            $('#main .right .mui-row').html(html);
          }
        })
      }
})