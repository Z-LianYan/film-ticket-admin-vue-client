import * as requstTools from "@/utils/request";
import * as aipUrl from "@/common/api";
import { setToken, getToken, removeToken } from "@/common/tools";
import { Message, Loading } from 'element-ui';

const state = {
}

const mutations = {
}

const actions = {
  getList({ commit, state }, requestParams) {
    const loadingTxt = requestParams.loadingTxt;
    delete requestParams.loadingTxt;
    return new Promise((resolve, reject) => {
      requstTools.get(aipUrl.GET_APP_VERSIONS_LIST, requestParams,loadingTxt).then(res => {
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
  
  //添加
  create({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.CREATE_APP_VERSIONS, requestParams).then(res => {
        if (res.error == 0) {
          Message.success(res.message);
          resolve();
        }else{
          Message.error(res.message);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  //编辑
  update({ commit, state }, requestParams){
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.UPDATE_APP_VERSIONS, requestParams).then(res => {
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
  //删除
  del({ commit, state }, requestParams){
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.DEL_APP_VERSIONS, requestParams).then(res => {
        if (res.error == 0) {
          resolve();
          Message.success(res.message);
        }else{
          Message.error(res.message);
        }
      }).catch(error => {
        reject(error)
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

