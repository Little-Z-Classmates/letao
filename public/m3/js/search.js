$(function () {
  // FastClick.attach(document.body);
  // 获取元素
  var input_search = $('.input-search');



  // 给搜索按钮注册点击事件
  $('.btn-search').on('tap', function () {
    // 获取搜索框的内容并且去掉两端的空格
    var searchValue = input_search.val().trim();

    // 非空判断
    if (searchValue == '') {
      // 如果为空则提示用户并且不执行后面的代码
      mui.toast('请输入内容', {
        duration: 2000,
        type: 'div'
      })
      return false;
    }

    // 先获取原先的本地存储里的数据
    var str = localStorage.getItem('key')
    // 如果有数据则获取数据,如果没有则获取空数组
    var arr = JSON.parse(str) || [];
    // 遍历数组,查看当前用户输入的信息是否和本地存储中的有没重复
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].key == searchValue) {
        // 重复则删除重复的元素
        arr.splice(i, 1);
        // 抵消i的自增
        i--
      }
    }
    // 把用户输入的信息存储到数组中
    arr.unshift({
      key: searchValue
    });
    // 把数组转为字符串存储到本地存储
    localStorage.setItem('key', JSON.stringify(arr));
    input_search.val('');
    setHistory();
    location = `./productList.html?search=${searchValue}&time=${new Date().getTime()}`;
    console.log('我是按钮');
  })


  // 输入框按下回车触发搜索功能
  $('.input-search').on('keydown', function (e) {
    // console.log(e.keyCode);
    if (e.keyCode == 13) {
      // $('.btn-search').trigger('tap');
      $('.btn-search').trigger('tap');
      return false;
    }
  });


  // 为搜索记录添加点击跳转事件
  $('.history-list').on('tap', '.search-text', function (e) {
    // e.preventDefault()
    // e.stopPropagation();
    // 获取当前点击的内容
    var searchValue = $(this).text().trim();
    console.log(searchValue);
    // 先获取原先的本地存储里的数据
    var str = localStorage.getItem('key')
    // 如果有数据则获取数据,如果没有则获取空数组
    var arr = JSON.parse(str) || [];
    // 遍历数组,查看当前用户输入的信息是否和本地存储中的有没重复
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].key == searchValue) {
        // 重复则删除重复的元素
        arr.splice(i, 1);
        // 抵消i的自增
        i--
      }
    }
    // 把用户输入的信息存储到数组中
    arr.unshift({
      key: searchValue
    });
    // 把数组转为字符串存储到本地存储
    localStorage.setItem('key', JSON.stringify(arr));
    input_search.val('');
    setHistory();
    location = `./productList.html?search=${searchValue}&time=${new Date().getTime()}`;
  })


  // 一进入此页面则查看是否有本地储存信息并渲染
  setHistory();

  // 给删除按钮注册委托点击事件
  // $('.history-list').on('tap', '.delSpan', function (e) {
    // e.preventDefault()
    // e.stopPropagation();
    // console.log('我是删除按钮');
    // return false;
    // var span = $(this).clone();
    // span.css('z-index','999');
    // $(this).parent().append(span);



    // var div = document.createElement('div');
    // $(div).css({
    //   width: '200px',
    //   height: '200px',
    //   backgroundColor: 'red',
    //   position: 'absolute',
    //   top: '0',
    //   right: '0',
    //   zIndex: '3',
    // })
    // $(this).parent().append(div);

    // $('.history-list .search-text').css('pointer-events','none')
    // $(this).parent().css('pointer-events', 'none');
    // $(this).css('pointer-events', 'none');

    // console.log(1111);
    // $('search-text').data('index','1111')

    // setTimeout(function (){
    //   $('.history-list .search-text').css({
    //     pointerEvents: 'auto'
    //   })
    // },1000)


  
  // });

  // 给清空记录注册点击事件
  $('.btn-remove').on('tap', function () {
    localStorage.removeItem('key');
    setHistory();
  })








  /** 设置搜索记录并渲染
   */
  function setHistory() {
    // 渲染搜索记录
    // 先获取原先的本地存储里的数据
    var str = localStorage.getItem('key')
    // 如果有数据则获取数据,如果没有则获取空数组
    // console.log(str);
    var arr = JSON.parse(str) || [];
    // console.log(arr);

    var html = template('search-content', {
      list: arr
    })
    // console.log(html);
    $('.history-list').html(html);
    $('.delSpan').on('tap', function (e) {
      e.stopPropagation();
      console.log('我是阻止事件冒泡');
      
    var index = $(this).data('index');
    var str = localStorage.getItem('key')
    // 如果有数据则获取数据,如果没有则获取空数组
    var arr = JSON.parse(str);
    arr.splice(index, 1);
    localStorage.setItem('key', JSON.stringify(arr));
    setHistory();
    })
  }



})