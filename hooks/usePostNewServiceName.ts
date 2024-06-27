import { useState } from "react";
import axios from "axios";

export type usePostNewServiceNameResult = {
  data: any | null;
  loading: boolean;
  error: Error | null;
  postData: (body: any) => Promise<void>;
};

const usePostNewServiceName = (): usePostNewServiceNameResult => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const postData = async (body: any) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://xjvq5wtiye.execute-api.us-east-1.amazonaws.com/interview/api/v1/challenge",
        body
      );
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
};

export default usePostNewServiceName;
