"use client";
import { useQuery} from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { UseMeProps } from "../schemas/use-me-schema";

export const useMe = () => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["check user"],
    queryFn: () =>
      apiFetch<UseMeProps>(
        `/auth/me`,
      ),
    retry:false
  });
  return { data, isLoading, isFetching, isError};
};
