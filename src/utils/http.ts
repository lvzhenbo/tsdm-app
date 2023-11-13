import { CapacitorHttp, type HttpOptions, type HttpResponse } from '@capacitor/core';
import { isPlatform } from '@ionic/vue';

const baseUrl = isPlatform('hybrid') ? 'https://www.tsdm39.com' : '';

function request(options: HttpOptions): Promise<HttpResponse> {
  // console.log(options.url);
  return new Promise((resolve, reject) => {
    // const op = { ...options };
    const op = JSON.parse(JSON.stringify(options));
    op.url = baseUrl + op.url;
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
