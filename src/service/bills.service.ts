import ApiService from "src/service/api.service";

const BillsService = {

  list(homeId: any, code: any, payload: any) {
    return ApiService.post(`/bills/list-by-home/${code}/${homeId}`, payload);
  },
  getById(id: any) {
    return ApiService.get(`/bills/get-by-id/${id}`);
  },
  delete(id: any) {
    return ApiService.delete(`/bills/delete/${id}`);
  },
  save(data :any, create: boolean) {
    if (create)
      return ApiService.post(`/bills/create`, data);
    else
      return ApiService.post(`/bills/update`, data);
  }

}

export default BillsService
