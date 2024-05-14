import ApiService from "src/service/api.service";

const PersonService = {

  list(homeId: any) {
    return ApiService.get(`/person/list-by-home/${homeId}`);
  },
  getById(id: any) {
    return ApiService.get(`/person/get-by-id/${id}`);
  },
  delete(id: any) {
    return ApiService.delete(`/person/delete/${id}`);
  },
  save(data :any, create: boolean) {
    if (create)
      return ApiService.post(`/person/create`, data);
    else
      return ApiService.post(`/person/update`, data);
  }

}

export default PersonService
