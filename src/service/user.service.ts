import ApiService from "src/service/api.service";

const UserService = {

  list(data: any) {
    return ApiService.post(`/user/list?search=${data.search}`, {page: data.page-1, limit: data.limit});
  },
  getById(id: any) {
    return ApiService.get(`/user/get-by-id/${id}`);
  },
  updatePassword(data: any) {
    return ApiService.post(`/user/update-password`, data);
  },
  delete(id: any) {
    return ApiService.delete(`/user/delete/${id}`);
  },
  save(data: any, create: boolean) {
    if (create)
      return ApiService.post(`/user/create`, data);
    else
      return ApiService.post(`/user/update`, data);
  }

}

export default UserService
