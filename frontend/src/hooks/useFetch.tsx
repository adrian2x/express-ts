import React, { useEffect, useState } from 'react'
import superagent from 'superagent'

interface FetchOptions {
  method?: string
  headers?: any
  query?: any
  data?: any
  type?: any
  onProgress?: (event: superagent.ProgressEvent) => any
}

export default function useFetch<T>(
  url: string,
  options = {
    method: 'get',
    headers: {},
    query: {},
    data: {},
    type: 'json',
    onProgress: (event: superagent.ProgressEvent) => {},
  } as FetchOptions
) {
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState<T | undefined>(undefined)
  const [error, setError] = useState<any>(undefined)

  const {
    method = 'get',
    type = 'json',
    headers = {},
    query = {},
    data,
    onProgress,
  } = options

  useEffect(() => {
    async function fetchData() {
      try {
        // @ts-ignore
        let req = superagent[method](url)
        if (onProgress) req.on('progress', onProgress)
        req.type(type)
        req.set(headers)
        req.query(query)
        if (data) {
          req.send(data)
        }
        let response = await req.then()
        setResponse(response.body)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  return { loading, response, error }
}
