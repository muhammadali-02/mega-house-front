import ApiService from "src/service/api.service";

const CommunalTypeService = {

  list() {
    return ApiService.get(`/communal-type/list`);
  },
  codes() {
    return ApiService.get(`/communal-type/codes`);
  },
  deleteForm(id: any) {
    return ApiService.delete(`/communal-type/delete/${id}`);
  },
  save(data: any, create: boolean) {
    if (create)
      return ApiService.post(`/communal-type/create`, data);
    else
      return ApiService.put(`/communal-type/update`, data);
  }

}

export default CommunalTypeService
