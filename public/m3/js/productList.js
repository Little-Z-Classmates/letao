$(function () {

  // 获取url查询的字符串
  var search = GetQueryString('search');


  // 商品列表头部注册点击时间->是的商品列表有排序
  $('.title a').on('tap', function () {
    var type = $(this).data('sort-type');
    var sort = $(this).data('sort');
    // 获取当前商品数量
    var pageSize = $('.product-list .content .mui-row .product').length;
    var obj = {
      page: 1,
      pageSize: pageSize,
      proName: search
    }
    obj[type] = sort;
    sort = sort == 1 ? 2 : 1;
    $('.title a').removeClass('active');
    $(this).data('sort', sort).addClass('active');
    if (sort == 1) {
      $(this).find('i')[0].className = 'fa fa-angle-up';
    } else if (sort == 2) {
      $(this).find('i')[0].className = 'fa fa-angle-down';
    }

    $.ajax({
      url: '/product/queryProduct',
      data: obj,
      success: function (res) {
        console.log(res);
        var html = template('productListTpl', res);
        $('.product-list .content .mui-row').html(html);
      }
    })
  })
  queryProduct();

  $('.product-list .content .mui-row').on('tap', '.btn-buy', function () {
    // var id = $(this).data('id')
    // location = `details.html?id=${id}`
    location = `details.html?id=${$(this).data('id')}`
    // location = 'details.html';

  })

  function queryProduct() {
    $.ajax({
      url: '/product/queryProduct',
      data: {
        page: 1,
        pageSize: 2,
        proName: search

      },
      success: function (res) {
        console.log(res);
        var html = template('productListTpl', res);
        $('.product-list .content .mui-row').html(html);
      }
    })

  }
  // 实现上拉加载下拉刷新
  mui.init({
    pullRefresh: {
      container: '#pullrefresh',
     
      down: {
        contentdown : "继续下拉可以刷新哦",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        contentover : "松手即可刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        contentrefresh : "正在拼命加在中...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        callback: pulldownRefresh
      },
      up: {
        height:0,
        contentrefresh: '正在加载...',
        contentrefresh : "正在玩命加在中...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
      contentnomore:'抱歉,没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
        callback: pullupRefresh
      }
    }
  });
  /**
   * 下拉刷新具体业务实现
   */
  function pulldownRefresh() {
    setTimeout(function () {
      $.ajax({
        url: '/product/queryProduct',
        data: {
          page: 1,
          pageSize: 2,
          proName: search
        },
        success: function (res) {
          console.log(res);
          var html = template('productListTpl', res);
          $('.product-list .content .mui-row').html(html);
        }
      })
      mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
      mui('#pullrefresh').pullRefresh().refresh(true);
      page = 1;
    }, 500);
  }
  var page = 1;
  /**
   * 上拉加载具体业务实现
   */
  function pullupRefresh() {
    setTimeout(function () {

      $.ajax({
        url: '/product/queryProduct',
        data: {
          page: ++page,
          pageSize: 2,
          proName: search

        },
        success: function (res) {
          console.log(res);

          if (res.data.length > 0) {
            var html = template('productListTpl', res);
            $('.product-list .content .mui-row').append(html);
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(); //参数为true代表没有更多数据了。

          } else {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);

          }
        }
      })


    }, 500);
  }



 

})