import { useState, useEffect } from "react";
import axios from "axios";
import { ChallengeData } from "@/app/models/ChallengeData";

export type UseCalendarInfoResult = {
  data: ChallengeData | null;
  loading: boolean;
  error: Error | null;
};

const useCalendarInfo = (): UseCalendarInfoResult => {
  const [data, setData] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ChallengeData>(
          "https://xjvq5wtiye.execute-api.us-east-1.amazonaws.com/interview/api/v1/challenge"
        );
        setData(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useCalendarInfo;
