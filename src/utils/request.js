// import axios from 'axios'
import { Message,Loading } from 'element-ui'
import router from '@/router/index';
import { getToken,removeToken } from '@/common/tools';
import store from '@/store';

import qs from 'qs';


// axios.defaults.withCredentials=true;//携带cookies 
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000*200, //1m request timeout
  headers:{
    platform:'private',
    // credentials: true//允许携带cookie 解决后端不同api session失效的问题
    // withCredentials: true,
  },
  // withCredentials: true,
  crossDomain:true
});
export default service
service.interceptors.request.use(async (config) =>{
  

  config.headers['token'] = getToken();

  // if (config.method === 'get') {
  //   config.paramsSerializer = function(params) {
  //     return qs.stringify(params, { arrayFormat: 'repeat' })
  //   }
  // }
  // console.log('config',config)

  return config
}, error => {
  Promise.reject(error)
});


service.interceptors.response.use(
  response => {
    if(response.data.error==403){
      console.log("403",response)
      removeToken();
      router.currentRoute.path!='/login'?router.replace({path:"/login",query:{redirect:router.currentRoute.fullPath}}):null;//去登录; 
      store.dispatch('accessMenu/reSetStatus');//重置获取菜单状态
      response.data.data={};
      return response;
    }else{
        return response;
    }    
  },
  error => {
    return Promise.reject(error)
  }
)

let loadingState
export function post(url,data,text){
  return new Promise((resolve,reject)=>{
    text? loadingState = Loading.service({text:text}):"";
    service({
      url:url,
      method:'POST',
      data:data,
      headers:{}
    }).then((res)=>{
      resolve(res.data);
      loadingState && loadingState.close();
    }).catch(err=>{
      reject(err);
      Message.warning(err.message);
    })
  })
}

export function get(url,requestParams,text){
  return new Promise((resolve,reject)=>{
    text? loadingState = Loading.service({text:text}):"";
    service({
      url:url,
      method:'GET',
      params:requestParams,
      headers:{}      
    }).then((res)=>{
      resolve(res.data);
      loadingState && loadingState.close();
    }).catch(err=>{
      reject(err);
      Message.warning(err.message);
    })  
  })
}
