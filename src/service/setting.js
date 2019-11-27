import Req from '@/api/request';
import store from '@/store';
import SettingStorage from '@/storage/setting';

export default class SettingService {
  /**
   * 獲取域名配置
   * @returns {Promise<{*} | never>}
   */
  static getDomainSetting = () => Req.getDomainSetting().then((res) => {
    store.commit('SET_DOMAIN_SETTING', res);
    SettingStorage.setDomain(res);
  })

  /**
   * 獲取全局配置
   */
  static getGlobalConfig() {
    Req.getGlobalConfig()
      .then(({ result }) => {
        store.commit('SET_GLOBAL_CONFIG', result);
        SettingStorage.setGlobalConfig(result);
      });
  }
}
