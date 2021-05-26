import Layout from '@/layout';
import LayoutFollow from '@/layout/LayoutFollow';
import router from '@/router';
import _ from 'lodash';

const _import = require('@/router/_import_' + process.env.NODE_ENV)

export function setToken(token) {
  localStorage.token = token;
}
export function getToken() {
  return localStorage.token;
}
export function removeToken() {
  delete localStorage.token;
}

export function setUserInfo(userInfo) {
  localStorage.userInfo = JSON.stringify(userInfo);
}
export function getUserInfo() {
  return localStorage.userInfo ? JSON.parse(localStorage.userInfo) : "";
}
export function removeUserInfo() {
  delete localStorage.userInfo;
}

export function routerMenuFilter(routerData,operation) { //遍历后台传来的路由字符串，转换为组件对象
  console.log("菜单", routerData);
  let full_routes = [];
  var accessedRouters = routerData.filter(route => {
    
    route.meta = {
      title: route.title,
      icon: route.icon,
      keep_alive: route.keep_alive == 1 ? true : false,
      affix: !route.affix ? false : true
    }
    if (route.component) {
      switch (route.component) {
        case 'Layout':
          route.component = resolve => require(["@/layout"], resolve);
          break;
        case 'LayoutFollow':
          route.component = resolve => require(["@/layout/LayoutFollow"], resolve);
          break;
        // case 'LayoutFollowFollow':
        //   route.component = resolve => require(["@/layout/LayoutFollowFollow"],resolve);
        //   break;
        default:
          route.component = _import(route.component);
      }
    }

    full_routes.push(route);
    if(route.children && route.children.length && !operation){//生成路由
      flatAsyncRoutes(route.children,[{
        path: route.path,
        title: route.meta.title
      }])
    }


    if (!route.redirect) {
      delete route.redirect
    }
    if (route.children && route.children.length) {
      route.children = routerMenuFilter(route.children,'menu')
    }
    delete route.title
    delete route.icon
    delete route.keep_alive
    delete route.module_id
    delete route._id
    delete route.affix
    return true
  })

  setTimeout(() => {
    console.log('full_routes',full_routes)
  }, 4000);
  

  return accessedRouters
}



// 将多层嵌套路由处理成平级
function flatAsyncRoutes(routes, breadcrumb, baseUrl = '') {
  console.log('routes++++',routes)
  let res = []
  routes.forEach(route => {
    console.log('routes------',route)
    const tmp = { ...route }

    tmp.meta = {}

    console.log('routes+++====',tmp)
    if (tmp.children) {
      console.log('routes+++====breadcrumb',breadcrumb)
      let childrenBaseUrl = '';
      if (!baseUrl) {
        childrenBaseUrl = tmp.path;
      } else if (tmp.path) {
        childrenBaseUrl = `${baseUrl}/${tmp.path}`
      }
      let childrenBreadcrumb = _.cloneDeep(breadcrumb)
      console.log('routes+++====tmp888',childrenBreadcrumb)
      if (route.meta.breadcrumb) {
        childrenBreadcrumb.push({
          path: childrenBaseUrl,
          title: route.meta.title
        })
      }
      
      let tmpRoute = _.cloneDeep(route)
      tmpRoute.path = childrenBaseUrl
      tmpRoute.meta.breadcrumbNeste = childrenBreadcrumb
      delete tmpRoute.children
      res.push(tmpRoute)
      let childrenRoutes = flatAsyncRoutes(tmp.children, childrenBreadcrumb, childrenBaseUrl)
      childrenRoutes.map(item => {
        // 如果 path 一样则覆盖，因为子路由的 path 可能设置为空，导致和父路由一样，直接注册会提示路由重复
        if (res.some(v => v.path == item.path)) {
          res.forEach((v, i) => {
            if (v.path == item.path) {
              res[i] = item
            }
          })
        } else {
          res.push(item)
        }
      })
      
    } else {
      if (baseUrl != '') {
        if (tmp.path != '') {
          tmp.path = `${baseUrl}/${tmp.path}`
        } else {
          tmp.path = baseUrl
        }
      }
      // 处理面包屑导航
      let tmpBreadcrumb = _.cloneDeep(breadcrumb)
      if (tmp.meta.breadcrumb !== false) {
        tmpBreadcrumb.push({
          path: tmp.path,
          title: tmp.meta.title
        })
      }
      tmp.meta.breadcrumbNeste = tmpBreadcrumb
      res.push(tmp)
    }
  })
  return res
}













export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}