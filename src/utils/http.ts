import { CapacitorHttp, type HttpOptions, type HttpResponse } from '@capacitor/core';
import { isPlatform } from '@ionic/vue';
import { getCookie } from './cookie';

const baseUrl = isPlatform('hybrid') ? 'https://www.tsdm39.com' : '';

function request(options: HttpOptions): Promise<HttpResponse> {
  // console.log(options.url);
  return new Promise((resolve, reject) => {
    getCookie().then((cookie) => {
      // const op = { ...options };
      const op = JSON.parse(JSON.stringify(options));
      op.url = baseUrl + op.url;
      if (cookie) {
        op.headers = {
          ...op.headers,
          Cookie: cookie,
        };
      }
      CapacitorHttp.request(op)
        .then((response) => {
          if (response.status === 200) {
            resolve(response);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
}

export default request;
