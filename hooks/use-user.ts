"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useUser() {
  const { data, error, mutate, isLoading } = useSWR("/api/auth/me", fetcher)

  const user = data?.user || null
  const finished = !isLoading

  return {
    user,
    isLoading: !finished,
    error,
    mutate,
  }
}
