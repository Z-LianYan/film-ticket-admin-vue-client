import * as requstTools from "@/utils/request";
import * as aipUrl from "@/common/api";
import { setToken, getToken, removeToken } from "@/common/tools";
import { Message, Loading } from 'element-ui';

const state = {
}

const mutations = {
}

const actions = {
  getConfiglist({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.get(aipUrl.GET_AUDIT_LIST, requestParams).then(res => {
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
  //获取角色列表
  getConfigDetail({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.get(aipUrl.GET_AUDIT_DETAIL, requestParams).then(res => {
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
  
  delConfig({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.DEL_AUDIT_CONFIG, requestParams).then(res => {
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


  getQingjiaType({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.GET_QINGJIA_TYPE, requestParams).then(res => {
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
  getLizhiTypeList({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.GET_LIZHI_TYPE_LIST, requestParams).then(res => {
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

