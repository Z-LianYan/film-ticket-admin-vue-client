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
    return new Promise((resolve, reject) => {
      requstTools.get(aipUrl.GET_ADMIN_DEPARTMENT_LSIT, requestParams).then(res => {
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
  getById({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.get(aipUrl.GET_ADMIN_DEPARTMENT_DETAIL, requestParams).then(res => {
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
  
  //添加部门
  add({ commit, state }, requestParams) {
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.ADD_ADMIN_DEPARTMENT, requestParams).then(res => {
        
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
  
  //编辑部门
  edit({ commit, state }, requestParams){
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.EDIT_ADMIN_DEPARTMENT, requestParams).then(res => {
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
  //删除部门
  del({ commit, state }, requestParams){
    return new Promise((resolve, reject) => {
      requstTools.post(aipUrl.DEL_ADMIN_DEPARTMENT, requestParams).then(res => {
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

