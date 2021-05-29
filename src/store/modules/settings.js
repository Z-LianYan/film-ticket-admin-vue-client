import variables from '@/styles/element-variables.scss'
// import jsCookie from "js-cookie";

const state = {
  theme: variables.theme,
  showSettings: true,
  fixedHeader: false,
  sidebarLogo: true,
  needTagsView: true
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // console.log("key",key,'value',value);
    if (state.hasOwnProperty(key)) {
      state[key] = value;
      // jsCookie.set("theme",value);
      localStorage.setItem("theme",value);
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

