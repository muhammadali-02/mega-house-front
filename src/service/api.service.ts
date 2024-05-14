import axios from "axios";
import {useRouter} from "vue-router";
import StorageService from "src/service/storage.service";
import AuthService from "src/service/auth.service";

const router = useRouter()

const ApiService = {
  _401interceptor: null,
  i: 0,

  init(baseURL: string) {
    axios.defaults.baseURL = baseURL;
  },
  getFile(resource: string) {
    return axios.get(resource, {responseType: "blob"});
  },
  setHeader() {
    axios.defaults.headers.common["Authorization"] = `Bearer ${StorageService.getToken()}`;
    axios.defaults.headers.common["Accept-Language"] = `en`;
  },
  formData(resource: string, data: object) {
    return axios.post(resource, data, {headers: {"Content-Type": "multipart/form-data",},});
  },
  removeHeader() {
    axios.defaults.headers.common = {};
  },
  get(resource: string, config = {}) {
    return axios.get(`${resource}`, config);
  },
  post(resource: string, data: object) {
    return axios.post(`${resource}`, data);
  },
  customPost(resource: string, data: object) {
    return axios.post(resource, data, {headers: {"Content-Type": "application/xml"}});
  },
  put(resource: string, data: object) {
    return axios.put(resource, data);
  },
  delete(resource: string) {
    return axios.delete(resource);
  },
  customRequest(data: object) {
    return axios(data);
  },
  mount401Interceptor() {
    this._401interceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        this.i++;
        if (this.i == 1) {
          if (error.response.status === 403 ||error.response.status === 417 || error.response.status === 401) {
            AuthService.logout()
            window.location.reload()
            throw error;
          } else {
            if (error.response.statusCode != 200 && error.response.statusCode != 417) {
              // $toast.error(error.response?.data?.message || 'Tizimda xatolik!')
              throw error;
            }
          }
        }
        this.i = 0;
        // If error was not 401 just reject as is
        throw error;
      }
    ) as any
  },
  unmount401Interceptor() {
    // Eject the interceptor
    axios.interceptors.response.eject(this._401interceptor as any);
  },
}

export default ApiService;
