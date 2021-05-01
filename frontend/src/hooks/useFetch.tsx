import React, { useEffect, useState } from 'react'
import superagent from 'superagent'

export default function useFetch<T>(
  url: string,
  options = {
    method: 'get',
    headers: {},
    query: {},
    data: {},
    type: 'json',
    onProgress: (event: superagent.ProgressEvent) => {},
  }
) {
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState<T | undefined>(undefined)
  const [error, setError] = useState<any>(undefined)

  const { method, headers, query, data, type, onProgress } = options

  useEffect(() => {
    async function fetchData() {
      try {
        // @ts-ignore
        let req = superagent[method](url)
        req.on('progress', onProgress)
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
