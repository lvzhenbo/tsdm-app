import { CapacitorHttp, type HttpOptions, type HttpResponse } from '@capacitor/core';
import { isPlatform } from '@ionic/vue';
import { baseUrl } from './config';

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
