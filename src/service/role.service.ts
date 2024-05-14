import ApiService from "src/service/api.service";

const RoleService = {

  list() {
    return ApiService.post(`/role/list`, {page: 0, limit: 100});
  },
  delete(id: any) {
    return ApiService.delete(`/role/delete/${id}`);
  },
  save(data: any, create: boolean) {
    if (create)
      return ApiService.post(`/role/create`, data);
    else
      return ApiService.post(`/role/update`, data);
  }

}

export default RoleService
