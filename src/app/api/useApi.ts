import { useState, useCallback } from 'react'

interface ApiError {
  message: string
  status?: number
}

export function useApi<T>(
  apiCall: (...args: any[]) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true)
    setError(null)

    try {
      debugger;
      const result = await apiCall(...args)
      setData(result)
      return result
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.message || 'An unexpected error occurred',
        status: err.response?.status
      }
      if(err.response?.status === 401){
          console.error(500, apiError.message)
      setError(apiError)

      }else{
      setError(apiError)
        throw apiError
      }
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}