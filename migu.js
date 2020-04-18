/*
hostname=gw.aikan.miguvideo.com

^https:\/\/gw\.aikan\.miguvideo\.com\/ygw\/api\/dispatch\/migu-sign\/signInfo url script-request-header migu.js

0 0 * * * migu.js
cookie获取
需要在咪咕爱看app内获得
点击"我的",然后点击"福利"即可
@nobyda
@chavy
感谢两位大佬

*/

var appName = '咪咕'
var migu = init()
var URL = migu.getdata("UrlMG")
var KEY = migu.getdata("CookieMG")

let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
   getcookie()
} else {
   sign()
}

function getcookie() {
  var url = $request.url;
  if (url) {
     var UrlKeyMG = "UrlMG";
     var UrlValueMG = url;
     if (migu.getdata(UrlKeyMG) != (undefined || null)) {
        if (migu.getdata(UrlKeyMG) != UrlValueMG) {
           var url = migu.setdata(UrlValueMG, UrlKeyMG);
           if (!url) {
              migu.msg("更新" + appName + "Url失败‼️", "", "");
              } else {
              migu.msg("更新" + appName + "Url成功🎉", "", "");
              }
           } else {
           migu.msg(appName + "Url未变化❗️", "", "");
           }
        } else {
        var url = migu.setdata(UrlValueMG, UrlKeyMG);
        if (!url) {
           migu.msg("首次写入" + appName + "Url失败‼️", "", "");
           } else {
           migu.msg("首次写入" + appName + "Url成功🎉", "", "");
           }
        }
     } else {
     migu.msg("写入" + appName + "Url失败‼️", "", "配置错误, 无法读取URL, ");
     }
  if ($request.headers) {
     var CookieKeyMG = "CookieMG";
     var CookieValueMG = JSON.stringify($request.headers);
     if (migu.getdata(CookieKeyMG) != (undefined || null)) {
        if (migu.getdata(CookieKeyMG) != CookieValueMG) {
           var cookie = migu.setdata(CookieValueMG, CookieKeyMG);
           if (!cookie) {
              migu.msg("更新" + appName + "Cookie失败‼️", "", "");
              } else {
              migu.msg("更新" + appName + "Cookie成功🎉", "", "");
              }
           } else {
           migu.msg(appName + "Cookie未变化❗️", "", "");
           }
        } else {
        var cookie = migu.setdata(CookieValueMG, CookieKeyMG);
        if (!cookie) {
           migu.msg("首次写入" + appName + "Cookie失败‼️", "", "");
           } else {
           migu.msg("首次写入" + appName + "Cookie成功🎉", "", "");
           }
        }
     } else {
     migu.msg("写入" + appName + "Cookie失败‼️", "", "配置错误, 无法读取请求头, ");
     }
  migu.done()
}
   
function sign() {
  //ctime = Math.round(new Date().getTime()/1000)
  //URL = URL.replace(/time=\d*/g,"time=" + ctime)
//migu.log(URL)
  const url = { url: 'https://gw.aikan.miguvideo.com/ygw/api/dispatch/migu-sign/sign', headers: JSON.parse(KEY) }
migu.post(url, (error, response, data) => {
    migu.log(`${appName}, data: ${data}`)
    const title = `${appName}`
    let subTitle = ''
    let detail = ''
    let obj = JSON.parse(data)
    if (obj.success == 1) {
     subTitle = `签到结果: 成功🎉`
     detail = `说明: 已连续签到${obj.value.days}天，获得流量${obj.value.amount}MB`
    } else if (obj.error.code == 501) {
     subTitle = `签到结果: 成功(重复)`
     detail = `说明: ${obj.error.name}`
    } else {
     subTitle = `签到结果: 失败`
     detail = `说明: ${obj.msg}`
    }
     migu.msg(title, subTitle, detail)
  })
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  put = (url, cb) => {
    if (isSurge()) {
      $httpClient.put(url, cb)
    }
    if (isQuanX()) {
      url.method = 'PUT'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, put, done }
}
