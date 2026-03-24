import axios from "axios"

type TokenGetter = () => Promise<string | null>

let getToken: TokenGetter = async () => null

export function setTokenGetter(getter: TokenGetter) {
  getToken = getter
}

const apiClient = axios.create()

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message as string | undefined
      if (message) return Promise.reject(new Error(message))
    }
    return Promise.reject(err)
  },
)

export async function genericAuthRequest<T = unknown>(
  method: "get" | "post" | "patch" | "put" | "delete",
  url: string,
  data?: unknown,
): Promise<T> {
  const res = await apiClient(
    method === "get"
      ? { method, url, params: data }
      : { method, url, data },
  )
  return res.data as T
}
