$(function () {

  // ajax的响应体
  var queryObj = {
    page: 1,
    pageSize: 4
  }

  // 发送ajax请求渲染购物车整个页面
  queryCartPaging()



  // 实现上拉加载,下拉刷新
  mui.init({
    pullRefresh: {
      container: '#pullrefresh',
      down: {
        // auto: true,
        callback: function () {
          setTimeout(function () {
            queryObj.page = 1;
            queryCartPaging();
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            mui('#pullrefresh').pullRefresh().refresh(true);
          }, 500);
        }
      },
      up: {
        contentrefresh: '正在加载...',
        callback: function () {
          setTimeout(function () {
            queryObj.page++;

            $.ajax({
              url: '/cart/queryCartPaging',
              data: queryObj,
              success: function (res) {
                console.log(res);
                var html = template('cart-list-tpl', res);
                $('.cart-list').append(html);
                if (res instanceof Array) {
                  mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                } else {
                  mui('#pullrefresh').pullRefresh().endPullupToRefresh(); //参数为true代表没有更多数据了。
                }
              }
            });

          }, 500);
        }
      }
    }
  });

  // 删除注册委托事件
  $('.cart-list').on('tap', '.btn-delete', function () {
    var $that = $(this);
    var $li = $that.parent().parent();
    console.log($li);
    console.log($li[0]);
    // 获取当前被点击的的id
    var id = $that.data('id');

    mui.confirm('确定删除此商品吗?', '提示', ['确定',
      '取消'
    ], function (e) {
      console.log(e);
      if (e.index == 0) {
        // 调用API实现删除购物车的商品
        $.ajax({
          url: '/cart/deleteCart',
          data: {
            id: id
          },
          success: function (res) {
            console.log(res);
            if (res.success) {
              $li.remove();
              // queryCartPaging()
            }
          }
        });
      } else {
        mui.swipeoutClose($li[0]);
      }
    })

  })

  // 编辑按钮委托事件
  $('.cart-list').on('tap', '.btn-compile', function () {
    // 获取到当前按钮元素
    var elem = this;
    // 获取当前元素的父级的父级
    var li = elem.parentNode.parentNode;
    // 获取尺码和数量信息
    var productInfo = $(this).data('product-info');
    var sizeAll = productInfo.productSize;
    // 把所有尺码转为数组
    var sizeStart = sizeAll.split('-')[0] - 0;
    var sizeEnd = sizeAll.split('-')[1] - 0;
    var arr = [];
    for (var i = sizeStart; i <= sizeEnd; i++) {
      arr.push(i);
    }
    productInfo.productSize = arr;
    console.log(productInfo);

    // 获取模版
    var html = template('productInfo', productInfo);
    // 去掉回车换行
    html = html.replace(/[\r\n]/g, '');
    // 渲染到弹窗中
    mui.confirm(html, '修改商品窗口', ['确定', '取消'], function (e) {
      if (e.index == 1) {
        mui.swipeoutClose(li);
      } else {
        // 确定用户需要修改
        var id = productInfo.id;
        var size = $('.mui-btn.mui-btn-warning').data('size');
        var num = mui('.mui-numbox').numbox().getValue();
        // 发送ajax请求修改信息
        $.ajax({
          type: 'post',
          url: '/cart/updateCart',
          data: {
            id: id,
            size: size,
            num: num
          },
          success: function (data) {
            // 重新渲染页面
            console.log(data);
            queryObj.page = 1;

            queryCartPaging();
          }
        })
      }


    })

    // 初始化尺码
    $('.mui-popup-in').on('tap', '.btn-size', function () {
      $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
    })

    // 初始化购买数量的数字按钮
    mui('.mui-numbox').numbox();
    mui('.mui-numbox').numbox().setValue(productInfo.num)








  });

  // 计算订单总额
  // 事件委托,商品的多选框值改变就触发
  $('.cart-list').on('change', '.cart-checkbox', function () {
    var sum = 0;
    $('.cart-checkbox:checked').each(function (index, ele) {
      console.log($(this).data('price'), $(this).data('num'));
      sum += $(this).data('price') * $(this).data('num');
    })
    sum = sum.toFixed(2)
    $('.order-sum span').html(sum);
  });

  // 封装ajax请求->渲染购物车整个页面
  function queryCartPaging() {
    $.ajax({
      url: '/cart/queryCartPaging',
      data: queryObj,
      success: function (res) {
        console.log(res);
        var html = template('cart-list-tpl', res);
        $('.cart-list').html(html);
      }
    });
  }

});