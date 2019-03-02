 //匹配url查询字符串 支持中文
 function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = decodeURIComponent(window.location.search).substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return -1;
}

