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

export function routerMenuFilter(router_Data, operation) { //遍历后台传来的路由字符串，转换为组件对象
  try {

    console.log("菜单", router_Data);
    let routerData = [];
    for (let route of router_Data) {

      route.meta = {
        title: route.title,
        icon: route.icon,
        keep_alive: route.keep_alive == 1 ? true : false,
        affix: !route.affix ? false : true
      }
      
      delete route.title;
      delete route.icon;
      delete route.keep_alive;
      delete route.module_id;
      delete route._id;
      delete route.affix;
      delete route.is_create_router;

      if (route.component) {
        route.component = handleComponent(route.component)
      }
      if(!operation){
        let _route = _.cloneDeep(route);
        console.log('我复制了一个路由',_route);
        routerData.push(_route);
        if (_route.children && _route.children.length) {
          flatAsyncRoutes(_route, [{//二级以上路由转一二级路由
            path: _route.path,
            title: _route.meta.title,
            // redirect: _route.redirect,
          }], _route.path)

          // delete _route.redirect
        }
      }
      
      if (route.children && route.children.length) {
        routerMenuFilter(route.children, 'menu')
      }
      // return true
    }
    console.log('77777777', routerData, router_Data)
    return {
      routerList:routerData,
      menuList:router_Data,
    };
  } catch (err) {
    console.error(err.message);
  }

}

function handleComponent(component) {
  switch (component) {
    case 'Layout':
      return resolve => require(["@/layout"], resolve);
    // break;
    case 'LayoutFollow':
      return resolve => require(["@/layout/LayoutFollow"], resolve);
    // break;
    // case 'LayoutFollowFollow':
    //   route.component = resolve => require(["@/layout/LayoutFollowFollow"],resolve);
    //   break;
    default:
      console.log('component',component);
      return _import(component);
  }
}

function recursionChilden(routes, breadcrumb = [], baseUrl, operation, child_breadcrumb = []) {
  let result = [];
  if (operation) {
    result = operation;
  }
  for (let item of routes) {
    let base_url = (operation?(baseUrl + '/'):'') + item.path;
    // console.log('base_url',base_url);
    if (!operation || !child_breadcrumb.length) {//处理面包屑
      let cur_breadcrumb = _.cloneDeep(breadcrumb[0]);
      child_breadcrumb = [];
      child_breadcrumb.push(cur_breadcrumb);
    }
    child_breadcrumb.push({
      path: baseUrl + '/' + item.path,
      title: item.title,
      redirect: item.redirect,
    })
    item.path = base_url;
    

    if (item.children && item.children.length) {
      recursionChilden(item.children, breadcrumb, base_url, result, child_breadcrumb)
    } else {

      item.component = handleComponent(item.component);

      let tem_child_breadcrumb = _.cloneDeep(child_breadcrumb);
      child_breadcrumb.splice(child_breadcrumb.length - 1, 1);

      item.meta = {
        title: item.title,
        icon: item.icon,
        keep_alive: item.keep_alive == 1 ? true : false,
        affix: !item.affix ? false : true,
        breadcrumb: tem_child_breadcrumb
      }

      delete item.title;
      delete item.icon;
      delete item.keep_alive;
      delete item.module_id;
      delete item._id;
      delete item.affix;
      delete item.is_create_router;

      result.push(item);
    }

  }
  return result;
}

// 将多层嵌套路由处理成平级
function flatAsyncRoutes(routes, breadcrumb = [], baseUrl) {
  console.log('routes++++哈哈哈😄', routes);
  try {
    routes.children = recursionChilden(routes.children, breadcrumb, baseUrl);
    // console.log('result----childen',result);
  } catch (err) {
    // console.log('catch----err',err.message);
    console.error(err.message)
  }
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