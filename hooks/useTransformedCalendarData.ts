import { useMemo } from "react";
import { useCalendar } from "@/app/contexts/CalendarContext";

export const monthNames = [
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

export const getMonthName = (monthNumber: number): string =>
  monthNames[monthNumber] || "Invalid month";

const transformData = (calendar) =>
  calendar.map((calendarItem) => ({
    title: `${getMonthName(calendarItem.month)} ${calendarItem.year}`,
    data: calendarItem.actions.length === 0 ? [{}] : calendarItem.actions,
  }));

const useTransformedCalendarData = () => {
  const { data, loading, error } = useCalendar();

  const transformedData = useMemo(
    () => (data?.calendar ? transformData(data.calendar) : []),
    [data]
  );

  return {
    data: transformedData,
    loading,
    error,
    customer: data?.customer,
  };
};

export default useTransformedCalendarData;
