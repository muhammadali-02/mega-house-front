import ApiService from "src/service/api.service";
import StorageService from "src/service/storage.service";

const AuthService = {

  login(data: any) {
    return ApiService.post(`/auth-payload`, data);
  },
  register(data: any) {
    return ApiService.post(`/user/register`, data);
  },

  logout() {
    ApiService.removeHeader();
    StorageService.removeToken();
    StorageService.removeUsername();
    StorageService.removeRoles();
    StorageService.removePermissions();
    return true;
  }

}

export default AuthService
