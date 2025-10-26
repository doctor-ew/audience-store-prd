import useSWR from "swr";
import type { TransitVehicle } from "@/lib/types";

export class FetchError extends Error {
  info?: any;
  status?: number;
}

interface UseMartaDataReturn {
  vehicles: TransitVehicle[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: FetchError | undefined;
}

const fetcher = async (url: string): Promise<{ vehicles: TransitVehicle[] }> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new FetchError("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export function useMartaData(): UseMartaDataReturn {
  const { data, error, isLoading } = useSWR<
    { vehicles: TransitVehicle[] },
    FetchError
  >("/api/marta", fetcher, {
    refreshInterval: 3000, // Refresh every 10 seconds for smoother real-time updates
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    errorRetryCount: 3,
  });

  return {
    vehicles: data?.vehicles,
    isLoading,
    isError: !!error,
    error,
  };
}
