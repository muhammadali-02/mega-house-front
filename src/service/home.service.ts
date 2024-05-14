import StorageService from "src/service/storage.service";
import ApiService from "src/service/api.service";

const HomeService = {

  list() {
    return ApiService.get(`/home/listAllDto`);
  },
  getById(id: any) {
    return ApiService.get(`/home/get-by-id/${id}`);
  },
  deleteHome(id: any) {
    return ApiService.delete(`/home/delete/${id}`)
  },
  save(data :any, create: boolean) {
    if (create)
      return ApiService.post(`/home/create`, data);
    else
      return ApiService.put(`/home/update`, data);
  }

}

export default HomeService
