import { useToast } from '@/hooks/use-toast'
import axios, { 
    AxiosInstance, 
    AxiosResponse,  
    InternalAxiosRequestConfig 
  } from 'axios'
  
  export class BaseApiService {
    protected axiosInstance: AxiosInstance

    constructor(baseURL: string) {
      this.axiosInstance = axios.create({
        baseURL:'https://apps4x-framework.azurewebsites.net/'+baseURL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      this.initializeInterceptors()
    }
  
    private initializeInterceptors() {
      // Request Interceptor
      this.axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
          const token = localStorage.getItem('Apps4xtoken')
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
          }
          config.headers['access-control-allow-origin'] = '*'
          return config
        },
        (error) => Promise.reject(error)
      )
    }
  
    protected async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
      try {
        const response: AxiosResponse<T> = await this.axiosInstance.get(url, { params })
        return response.data
      } catch (error) {
        this.handleError(error)
        throw error
      }
    }
  
    protected async post<T, D = unknown>(url: string, data: D): Promise<T> {
      try {
        const response: AxiosResponse<T> = await this.axiosInstance.post(url, data)
        return response.data
      } catch (error) {
        this.handleError(error)
        throw error
      }
    }
    protected async put<T, D = unknown>(url: string, data: D): Promise<T> {
      try {
        const response: AxiosResponse<T> = await this.axiosInstance.put(url, data)
        return response.data
      } catch (error) {
        this.handleError(error)
        throw error
      }
    }
    protected async delete<T>(url: string): Promise<T> {
      try {
        const response: AxiosResponse<T> = await this.axiosInstance.delete(url)
        return response.data
      } catch (error) {
        this.handleError(error)
        
        throw error
      }
    }
  
    private handleError(error: unknown) {
      if (axios.isAxiosError(error)) {
        if(error.status === 401){
        //   localStorage.clear();
        useToast().toast({
          title: 'Unauthorized',
          description: 'You are not authorized to perform this action.',
          duration: 2000,
          variant: 'destructive'
        });
        }
        console.error('API Error:', error.response?.data || error.message)
      }
    }
  }
  export const CompanyId = 'LGE0000002'
  export const OrgId = 'ORG0000002'
  export const EnvId = 'ENV0000002'
  export const AppId = 'APP0000007'
