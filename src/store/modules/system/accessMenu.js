import * as requstTools from "@/utils/request";
import * as aipUrl from "@/common/api";
import { Message, Loading } from 'element-ui';

import store from '@/store';
import { getToken, getUserInfo, routerMenuFilter } from '@/common/tools';
import router from '@/router'
import Vue from 'vue';


const state = {
  routerMenu:[],
  initialize_system:false,
  isLoadingMenu:true//处理登录成功，路由重定向请求两遍菜单
}

const mutations = {
  MENU_ROUTER:(state,data)=>{
    state.routerMenu = data
  },
  RESET_STATUS: (state,data)=>{
    state.routerMenu = [];
    state.initialize_system = false;
    state.isLoadingMenu = true;
  }
}

const actions = {
  reSetStatus({ commit, state }, requestParams){
    commit('RESET_STATUS')
  },
  list({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.get(aipUrl.ACCESS_MENU_LIST, requestParams).then(res => {
        if (res.error == 0) {
          resolve(res.data);
        } else {
          Message.error(res.message);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  doAdd({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.ACCESS_MENU_ADD, requestParams).then(res => {
        if (res.error == 0) {
          Message.success(res.message);
          resolve();
        } else {
          Message.error(res.message);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  doEdit({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.ACCESS_MENU_EDIT, requestParams).then(res => {
        if (res.error == 0) {
          Message.success(res.message);
          resolve();
        } else {
          Message.error(res.message);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  doDel({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.ACCESS_MENU_DEL, requestParams).then(res => {
        if (res.error == 0) {
          Message.success(res.message);
          resolve();
        } else {
          Message.error(res.message);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  
  getAccessMenu({ commit, state },requestParams){
    state.initialize_system = false;
    return new Promise((resolve, reject) => {
      requstTools.get(aipUrl.GET_ACCESS_MENU, requestParams).then(res => {
        if (res.error == 0) {
          resolve(res.data);
          var data = routerMenuFilter(res.data.data);
          var menu_list = router.options.routes.concat(data.menuList);
          var router_list = router.options.routes.concat(data.routerList);
          store.commit("accessMenu/MENU_ROUTER", menu_list);
          var error_404 = { path: '*', redirect: '/404', hidden: true };
          router_list.push(error_404);
          router.selfaddRoutes(router_list);//返回的数据，生成路由
          store.dispatch("siteSetting/getSetData");//获取网站数据
          console.log("路由表",router_list)
          setTimeout(() => {
            state.initialize_system = true;
          },50);
          
        } else {
          Message.error(res.message);
          state.initialize_system = false;
        }
        
      }).catch(error => {
        reject(error);
        state.initialize_system = false;
      })
    })
  }
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

