import { CapacitorHttp, type HttpOptions, type HttpResponse } from '@capacitor/core';
import { isPlatform, alertController } from '@ionic/vue';
import { baseUrl } from './config';
import { useUserStoreWithOut } from '@/stores/modules/user';
import router from '@/router';
import { removeCookie } from './cookie';

const BaseUrl = isPlatform('hybrid') ? baseUrl : '';

function request(options: HttpOptions): Promise<HttpResponse> {
  // console.log(options.url);
  return new Promise((resolve, reject) => {
    // const op = { ...options };
    const op = JSON.parse(JSON.stringify(options));
    op.url = BaseUrl + op.url;
    CapacitorHttp.request(op)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.message) {
            if (response.data.message === 'unauthenticated') {
              useUserStoreWithOut().removeUserInfo();
              removeCookie();
              alertController
                .create({
                  header: '提示',
                  message: '登录已过期，请重新登录',
                  buttons: [
                    {
                      text: '取消',
                      role: 'cancel',
                    },
                    {
                      text: '去登录',
                      role: 'confirm',
                      handler: () => {
                        router.push({ name: 'Login' });
                      },
                    },
                  ],
                })
                .then((alert) => {
                  alert.present();
                });
            }
          }
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default request;
