import axios, { Axios, AxiosRequestConfig } from 'axios';

export interface MyAxiosPromise<T = any>
  extends Promise<{
    code: number;
    data: T;
    msg: string;
    message?: string;
  }> {}

interface MyAxiosInstance extends Axios {
  // eslint-disable-next-line
  (config: AxiosRequestConfig): MyAxiosPromise;
  // eslint-disable-next-line
  (url: string, config?: AxiosRequestConfig): MyAxiosPromise;
}

class MyAxios {
  // axios 實例
  instance: MyAxiosInstance;

  constructor(config: AxiosRequestConfig) {
    // @ts-ignore
    this.instance = axios.create(config);

    // 請求攔截
    this.instance.interceptors.request.use(
      (cfg) => {
        return cfg;
      },
      (error) => {
        console.log(error);
        return Promise.reject(error);
      }
    );

    // 響應攔截
    this.instance.interceptors.response.use(
      (response) => {
        console.log('response.config.url', response.config.url);
        console.log('response.data', response.data);
        return response.data;
      },
      (error) => {
        console.log('響应拦截到错误', error);
        if (error.message.indexOf('timeout') !== -1) {
          console.error(error.message);
          return;
        }
        const statusCode = error.response.status as number;
        const errorResponseData = error.response.data;
        const whiteList = ['400', '401', '403', '404'];
        if (error.response) {
          if (!whiteList.includes(`${statusCode}`)) {
            if (statusCode === 500) {
              let msg = errorResponseData.message;
              if (errorResponseData?.errorCode) {
                msg = errorResponseData.error;
              }
              console.error(msg);
              return Promise.reject(msg);
            }
            console.error(error.message);
            return Promise.reject(error);
          }
          if (statusCode === 400) {
            console.error(errorResponseData.message);
            return Promise.reject(errorResponseData);
          }
          if (statusCode === 401) {
            console.error(errorResponseData.message);
            return Promise.reject(errorResponseData);
          }
          if (statusCode === 403) {
            console.error(errorResponseData.message);
            return Promise.reject(errorResponseData);
          }
          if (statusCode === 404) {
            console.error(errorResponseData.message);
            return Promise.reject(errorResponseData);
          }
        } else {
          // 請求超時 沒有response
          console.error(error.message);
          return Promise.reject(error.message);
        }
      }
    );
  }

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig<any> | undefined
  ): MyAxiosPromise<T> {
    return this.instance.get(url, config);
  }

  post<T = any>(
    url: string,
    data?: {} | undefined,
    config?: AxiosRequestConfig
  ): MyAxiosPromise<T> {
    return this.instance.post(url, data, config);
  }
}

export default new MyAxios({
  // baseURL:'/'
  timeout: 1000 * 5,
});
