import ApiService from "src/service/api.service";

const RegionService = {

  list() {
    return ApiService.get(`/region/list`);
  },
  listByParent(id: any) {
    return ApiService.get(`/region/listByParent?parentId=${id}`);
  },
  save(data: any, create: boolean) {
    if (create)
      return ApiService.post(`/region/create`, data);
    else
      return ApiService.put(`/region/update`, data);
  },
  delete(id: any) {
    return ApiService.delete(`/region/delete/${id}`);
  }

}

export default RegionService
