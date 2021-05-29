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
    let routerData = [];
    for (let route of router_Data) {
      let breadcrumb = [{
        name:route.name,
        path: route.path,
        title: route.title,
        redirect: route.redirect,
      }];
      route.meta = {
        title: route.title,
        icon: route.icon,
        keep_alive: route.keep_alive == 1 ? true : false,
        affix: !route.affix ? false : true,
        breadcrumb: breadcrumb
      }
      route.hidden = route.hidden==1?true:false;
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
        routerData.push(_route);
        if (_route.children && _route.children.length) {
          flatAsyncRoutes(_route, breadcrumb, _route.path)//一级以上路由转二级路由
        }
      }
      if (route.children && route.children.length) {
        routerMenuFilter(route.children, 'menu')
      }
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
    case 'noComponent':
      return '';
    default:
      return component && _import(component);
  }
}

function recursionChilden(routes, breadcrumb = [], baseUrl,child_base_url, operation, child_breadcrumb = []) {
  let result = operation?operation:[];
  for (let item of routes) {
    let base_url = (baseUrl=='/'?'':baseUrl) + '/' + item.path;
    if (!operation || !child_breadcrumb.length) {//处理面包屑（child_breadcrumb 与router.matched类似）
      let cur_breadcrumb = (breadcrumb && breadcrumb.length)?_.cloneDeep(breadcrumb[0]):null;
      child_breadcrumb = [];
      if(cur_breadcrumb && routes.length!=1){
        child_breadcrumb.push(cur_breadcrumb);
      }
    }
    child_breadcrumb.push({
      name: item.name,
      path: base_url,
      title: item.title,
      redirect: item.redirect,
    })
    let path_url = (operation?(child_base_url + '/'):'') + item.path;
    item.path = path_url;//二级路由路径
    if (item.children && item.children.length) {
      if(item.children.length==1){//如果子路由只有一个的话面包屑不显示上级菜单名称（跟菜单类似）
        child_breadcrumb.splice(child_breadcrumb.length-1,1);
      }
      recursionChilden(item.children, breadcrumb, base_url, path_url, result, child_breadcrumb)
    } else {
      item.component = handleComponent(item.component);
      let tem_child_breadcrumb = _.cloneDeep(child_breadcrumb);
      child_breadcrumb.splice(child_breadcrumb.length - 1, 1);
      item.meta = {
        title: item.title,
        icon: item.icon,
        keep_alive: item.keep_alive == 1 ? true : false,//是否缓存
        affix: !item.affix ? false : true,//默认显示到历史预览菜单，切不可关闭
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

function flatAsyncRoutes(routes, breadcrumb = [], baseUrl) {
  try {
    routes.children = recursionChilden(routes.children, breadcrumb, baseUrl);//一级以上路由转二级路由
  } catch (err) {
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