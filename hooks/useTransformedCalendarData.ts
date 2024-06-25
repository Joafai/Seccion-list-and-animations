import { useMemo } from "react";
import useCalendarInfo from "../hooks/useCalendarInfo";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getMonthName = (monthNumber: number): string =>
  monthNames[monthNumber] || "Invalid month";

const transformData = (calendar) =>
  calendar.map((calendarItem) => ({
    title: `${getMonthName(calendarItem.month)} ${calendarItem.year}`,
    data: calendarItem.actions.length === 0 ? [{}] : calendarItem.actions,
  }));

const useTransformedCalendarData = () => {
  const { data, loading, error } = useCalendarInfo();

  const transformedData = useMemo(
    () => (data?.calendar ? transformData(data.calendar) : []),
    [data]
  );

  return {
    data: transformedData,
    loading,
    error,
  };
};

export default useTransformedCalendarData;
