import axios from 'axios';
import store from '../store';
import UserService from '@/service/user';
import ChatService from '@/service/chat';
import { showToast, hideLoading, getRunningDomain } from '@/service/helper';
import {
  ApiUrl, ChatApiUrl, FHJHApiUrl, SettingApiUrl,
} from '@/api/url';
import UserStorage from '../storage/user';

class HttpRequest {
  static getInsideConfig() {
    return {
      headers: {
        //
      },
    };
  }

  static interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use((config) => {
      const newConfig = { ...config };
      const { domainSetting } = store.state;
      const { api_domain, api_domain_signalr } = domainSetting;

      const domain = {
        fhApi: api_domain,
        signalrApi: api_domain_signalr,
        fhjhApi: 'https://www.51fhjh.com',
        chatApi: getRunningDomain(),
        settingApi: getRunningDomain(),
      };

      if (Object.values(ApiUrl).includes(url.split('?')[0])) {
        newConfig.url = `${domain.fhApi}${url}`;
      }
      if (Object.values(ChatApiUrl)
        .includes(url)) {
        newConfig.url = `${domain.chatApi}${url}`;
      }
      if (Object.values(FHJHApiUrl)
        .includes(url)) {
        newConfig.url = `${domain.fhjhApi}${url}`;
      }
      if (SettingApiUrl.includes(url)) {
        newConfig.url = `${domain.settingApi}${url}`;
      }

      return newConfig;
    }, error => Promise.reject(error));
    // 响应拦截
    instance.interceptors.response.use((res) => {
      hideLoading();
      let bool = false;
      const { domainSetting } = store.state;
      const excludeUrl = [
        getRunningDomain(),
        domainSetting.api_domain_signalr,
        'https://www.51fhjh.com',
      ];

      for (let index = 0; index < excludeUrl.length; index++) {
        const element = excludeUrl[index];
        if (!url.includes(element)) {
          bool = true;
        }
      }

      if (bool) {
        const { status, result, error } = res.data;

        if (status && result) {
          return res;
        }
        if (!status && !result && (error === '登录超时，请重新登录' || error === '您已经退出系统，请重新登录！')) {
          showToast(error);
          UserStorage.clean(() => {
            window.location.reload();
            ChatService.disconnect();
            UserService.forceLogout();
          });
          return res;
        }
      }
      return res;
    }, error => Promise.reject(error));
  }

  static get(url, data = { params: {} }) {
    return this.request({
      url,
      method: 'get',
      params: data.params,
    });
  }

  static post(url, data) {
    return this.request({
      url,
      method: 'post',
      data,
      timeout: 8000,
    });
  }

  static request(options) {
    const instance = axios.create();
    instance.defaults.timeout = 10000;
    const newOptions = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, newOptions.url);
    return instance(newOptions);
  }
}

export default HttpRequest;
