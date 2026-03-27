import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * Custom React hook for fetching data from Appwrite with internal state management.
 * Provides loading states, error handling, and manual refetch capabilities.
 *
 * @template T - The expected return type of the data from the Appwrite function.
 * @template P - The parameters type passed to the fetching function.
 */
interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  /** The async function that fetches data from Appwrite */
  fn: (params: P) => Promise<T>;
  /** Optional default parameters to pass to the function */
  params?: P;
  /** Pass true to prevent the hook from fetching data immediately on mount */
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;          // The fetched data
  loading: boolean;        // True when currently fetching
  error: string | null;    // Error message if fetch failed
  refetch: (newParams?: P) => Promise<void>; // Manually trigger a new fetch
}

export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
        async (fetchParams: P) => {
            setLoading(true);
            setError(null);

            try {
                const result = await fn({ ...fetchParams });
                setData(result);
            } catch (err: unknown) {
                const errorMessage =
                    err instanceof Error ? err.message : "An unknown error occurred";
                setError(errorMessage);
                Alert.alert("Error", errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [fn]
    );

    useEffect(() => {
        if (!skip) {
            fetchData(params);
        }
    }, []);

    const refetch = async (newParams?: P) => await fetchData(newParams!);

    return { data, loading, error, refetch };
};

export default useAppwrite;