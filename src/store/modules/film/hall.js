import * as requstTools from "@/utils/request";
import * as aipUrl from "@/common/api";
import { Message, Loading } from 'element-ui';

import store from '@/store';
import { getToken, getUserInfo, routerMenuFilter } from '@/common/tools';
import router from '@/router'

const state = {
}

const mutations = {
  
}

const actions = {
  list({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.get(aipUrl.GET_HALL_LIST, requestParams).then(res => {
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
  add({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.ADD_HALL, requestParams, '正在提交...').then(res => {
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
  update({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.UPDATE_HALL, requestParams, '正在提交...').then(res => {
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
  del({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.DEL_HALL, requestParams, '正在删除...').then(res => {
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

  arrangeSeat({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.FILM_HALL_SEAT_ARRANGE, requestParams, '加载中...').then(res => {
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

