import { useState, useCallback } from "react";
import { makeRequest } from "../Service/api";
import { DEFAULT_API_ERROR_MSG } from "../Constants/responses";

export const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = useCallback(
    async (
      method: string,
      endpoint: string,
      body = {},
      customHeaders = { "ngrok-skip-browser-warning": "69420" }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const responseData = await makeRequest(
          method,
          endpoint,
          body,
          customHeaders
        );
        setLoading(false);
        setData(responseData);
        return { data: responseData, error: null };
      } catch (error) {
        setError((error as Error)?.message || DEFAULT_API_ERROR_MSG);
        setLoading(false);
        setData(null);
        return {
          data: null,
          error: (error as Error)?.message || DEFAULT_API_ERROR_MSG,
        };
        // throw error;
      }
    },
    []
  );

  return { sendRequest, loading, error, data };
};
