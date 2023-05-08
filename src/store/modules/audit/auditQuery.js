import * as requstTools from "@/utils/request";
import * as aipUrl from "@/common/api";
import { setToken, getToken, removeToken } from "@/common/tools";
import { Message, Loading } from 'element-ui';

const state = {
}

const mutations = {
}

const actions = {
  getMineAuditList({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.GET_MINE_AUDIT_LIST, requestParams).then(res => {
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
  getAuditDetail({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.GET_MINE_AUDIT_DETAIL, requestParams).then(res => {
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

