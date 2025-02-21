import { BaseApiService } from "@/app/api/baseApiApps4x"

class Apps4xService extends BaseApiService {
  constructor() {
    super('api/v1/')
  }

  async getApi(url:string,params: {
    page?: number
    size?: number
  } = {}) {
    return this.get<responseModel<any[]>>(url,  params)
  }

  async createApi(url:string,clientData: any) {
    return this.post<any>(url, clientData)
  }

  async updateApi(url:string,id: string, clientData: any) {
    return this.put<any>(url+id, clientData)
  }

  async deleteApi(url:string,id: string) {
   return this.delete<void>(url+id)
  }
}

export const apps4xService = new Apps4xService();


export interface responseModel<T> {
    isSuccess: boolean,
    message:string,
    Data:T|any,	
    page:number,
	size:number,
	totalCount:number	
}