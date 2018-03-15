/**
 * 通用工具JS
 * @param name
 */
'use strict';
// 通用的时间戳转日期  示例：2017 1-11 2：30：20
exports.formatDate = function(a,b,row){
   var now=new Date(row);
   var year=now.getFullYear();
   var month=now.getMonth()+1;
   var date=now.getDate();
   var hour=now.getHours();
   var minute=now.getMinutes();
   var second=now.getSeconds();
   month =  month >= 10 ? month : '0'+month;
   date =  date >= 10 ? date : '0'+date;
   hour =  hour >= 10 ? hour : '0'+hour;
   minute =  minute >= 10 ? minute : '0'+minute;
   second =  second >= 10 ? second : '0'+second;
   return row == null ? '' : year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
 };

/*   后台给的时间格式转----------------- 2017 1-11 2：30：20.0 */
exports.dateFormatter = function(row, column, cellValue){
  return cellValue == ''  ||　cellValue == null ? '': cellValue.substring(0,cellValue.length -2 );
};

 //通用日间转日期带中文  示例：2017年2月11日
exports.reserverDate = function(row){
   var now=new Date(row);
   var year=now.getFullYear();
   var month=now.getMonth()+1;
   var date=now.getDate();
   return row == null ? '' : year+"年"+month+"月"+date+"日";
 };

 //产生一个20位的数字编号,格式是YYYYMMDDHHMMSSsss+3位随机数 示例：20170811123012212222
exports.getRandomNumber = function(){
   var now=new Date();
   var year=now.getFullYear();
   var month=now.getMonth()+1;
   var date=now.getDate();
   var hour = now.getHours();       //获取当前小时数(0-23)
   var minutes = now.getMinutes();     //获取当前分钟数(0-59)
   var seconds = now.getSeconds();     //获取当前秒数(0-59)
   var millise = now.getMilliseconds();    //获取当前毫秒数(0-999)
   month =  month >= 10 ? month : '0'+month;
   date =  date >= 10 ? date : '0'+date;
   hour =  hour >= 10 ? hour : '0'+hour;
   minutes =  minutes >= 10 ? minutes : '0'+minutes;
   seconds =  seconds >= 10 ? seconds : '0'+seconds;
   millise =  millise >= 100 ? millise : millise < 10 ? '00'+millise : 100 > millise > 10 ? '0'+ millise :'';
   var rand = "";
   for(var i = 0; i < 3; i++){
     var r = Math.floor(Math.random() * 10);
     rand += r;
   }
   return year+month+date+hour+minutes+seconds+millise+rand;
 };


/*---------------------数组去重-0------------------------------------*/
exports.arrUnique = function(arr){
  var res = [];
  var json = {};
  for(var i = 0; i < arr.length; i++){
    if(!json[arr[i]]){
      res.push(arr[i]);
      json[arr[i]] = 1;
    }
  }
  return res;
}/*---------------------跳转新页面------------------------------------*/
exports.goToPage = function(path){
  // path 为跳转的页面路径
  //var url = 'http://'+window.location.host+window.location.pathname+'#/'+path;
  var url = '#/'+path;
  window.open(url);
},
/**s
 * 清空对象中所有的值--即重置表单
 * @@param  obj ---- 对象名
 */
exports.clearObjValue = function(obj){

  for(var item in obj){
    // alert(Object.prototype.toString.call(obj[item]))
    if(Object.prototype.toString.call(obj[item])==='[object Array]'){
      obj[item] = [];
    }else if(Object.prototype.toString.call(obj[item])==='[object Object]'){
      // obj[item][item] = '';
    } else{
      obj[item] = '';
    }
  }
  return obj;
}

/*转换数组对象中的key---------*/
exports.replaceObjKey = function(arr,id,name){
  var newArr = [],obj={};
    arr.forEach(function(item){
      obj = {label:item[name],value:item[id]};
      newArr.push(obj);
    });
  return newArr;
};

/**
 * 获取url中的参数
 * @@param  params ---- 需要获取的参数key值
 */
exports.requestParams = (params) => {
  var url = !!location.search ? location.search : location.hash;
  var Request = {};
  if (url.indexOf("?") != -1) {
    var str = url.substr(url.indexOf("?") + 1),
      //去掉?号
      strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      Request[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
    }
  }
  return Request[params];
};
/**
 * 添加左右切换按钮
 */
exports.addElemntLarge = () => {
  var imgElement = document.getElementsByClassName('ImgEnlarge');
  var imgElementChild = imgElement[0].firstChild;
  var newdiv = document.createElement("div");
  var newdiv2 = document.createElement("div");
  imgElementChild.insertBefore(newdiv,imgElementChild.childNodes[0]);
  imgElementChild.appendChild(newdiv2);
  var lastChildd = imgElementChild.lastChild;
  var firstChildd = imgElementChild.firstChild;
  firstChildd.setAttribute('id','imgLeft');
  lastChildd.setAttribute('id','imgRight');
},
/**
 * 金额以千位符显示
 */
exports.formatMoney = (val) => {
  var reg=/\d{1,3}(?=(\d{3})+$)/g;
  return (val + '').replace(reg, '$&,')+'.00';
},
/**
 * 获取当前页面的按钮权限
 * @@param  currentUrl ----  当前页面url
 */
exports.getBtnPermissions = (currentUrl) => {
  var allPermissions = JSON.parse(sessionStorage.getItem('leftMenusArr'));
  var currentPath = {};
  allPermissions.forEach(function(item){
    var dataItem = item.groupMenuList.map(itemm =>itemm);
    dataItem.forEach(function(itemmmm){
      if(itemmmm.menuUrl == currentUrl){
         currentPath =  itemmmm.cmdRightMap;
      }
    })
  })
  return currentPath;
},
  /**
   * 以post的方式打开新窗口
   * @@param  url ----
   * @@param  data ----
   * @@param  name ----
   */
exports.openPostWindow = function(url, data, name) {
  var openWindow = function (namee) {
    window.open('about:blank',namee,'height=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes');
  }
  var setParams = function(dataa){   // 循环设置参数
    if(dataa.length>0){
      alert(dataa)
      for(key in dataa){
        var params = 'hideInput'+key;
        params = document.createElement("input");
        params.type = "hidden";
        params.name=key; //后台要接受这个参数来取值
        params.value = dataa[key]; //后台实际取到的值
        tempForm.appendChild(params);
      }
    }
  }
  var tempForm = document.createElement("form");
  tempForm.id = "tempForm1";
  tempForm.method = "post";
  tempForm.action = url;
  tempForm.target="_blank"; //打开新页面
  //setParams(data); // 设置参数
  var params = document.createElement("input");
  params.type = "hidden";
  params.name='addressId'; //后台要接受这个参数来取值
  params.value = 111; //后台实际取到的值
  tempForm.appendChild(params);
  if(document.all){
    tempForm.attachEvent("onsubmit",function(){openWindow(name)});        //IE
  }else{
    var subObj = tempForm.addEventListener("submit",function(){openWindow(name)},false);    //firefox
  }
  document.body.appendChild(tempForm);
  if(document.all){
    tempForm.fireEvent("onsubmit");
  }else{
    tempForm.dispatchEvent(new Event("submit"));
  }
  tempForm.submit();
  document.body.removeChild(tempForm);
}
