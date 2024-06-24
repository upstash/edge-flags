import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { notification } from "antd"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: handleError,
  }),
  mutationCache: new MutationCache({
    onError: handleError,
  }),
})

function handleError(error: Error) {
  notification.error({
    message: "Error",
    description: error.message,
    placement: "bottomRight",
  })

  console.error(error)
}
