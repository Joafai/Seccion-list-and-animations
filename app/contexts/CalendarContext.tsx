import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import { ChallengeData, Customer } from "../models/ChallengeData";
import axios from "axios";

interface CalendarContextProps {
  data: ChallengeData | null;
  loading: boolean;
  error: Error | null;
  customer?: Customer;
  setData: Dispatch<SetStateAction<ChallengeData | null>>;
}

const CalendarContext = createContext<CalendarContextProps | undefined>(
  undefined
);

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
}) => {
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

  return (
    <CalendarContext.Provider value={{ data, loading, error, setData }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
