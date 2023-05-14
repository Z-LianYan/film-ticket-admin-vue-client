import * as requstTools from "@/utils/request";
import * as aipUrl from "@/common/api";
import { setToken, getToken, removeToken } from "@/common/tools";
import { Message, Loading } from 'element-ui';

const state = {
}

const mutations = {
}

const actions = {
  getAuditConfigDetail({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.GET_AUDIT_CONFIG_DETAIL, requestParams).then(res => {
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
  applyAudit({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.APPLY_AUDIT, requestParams).then(res => {
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

  checkAudit({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.CHECK_AUDIT, requestParams).then(res => {
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

  enforceAudit({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.ENFORCE_AUDIT, requestParams).then(res => {
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

