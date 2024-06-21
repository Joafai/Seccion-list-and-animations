import { SectionList, Text, StyleSheet } from "react-native";
import useCalendarInfo from "../../hooks/useCalendarInfo";
import CalendarItem from "@/components/CalendarItem";

export default function Calendar() {
  const { data, loading, error } = useCalendarInfo();

  const getMonthName = (monthNumber: number): string => {
    switch (monthNumber) {
      case 1:
        return "January";
      case 2:
        return "February";
      case 3:
        return "March";
      case 4:
        return "April";
      case 5:
        return "May";
      case 6:
        return "June";
      case 7:
        return "July";
      case 8:
        return "August";
      case 9:
        return "September";
      case 10:
        return "October";
      case 11:
        return "November";
      case 12:
        return "December";
      default:
        return "Invalid month";
    }
  };

  const transformData = (calendar) => {
    return calendar.map((calendarItem) => ({
      title: `${getMonthName(calendarItem.month)} ${calendarItem.year}`,
      data: calendarItem.actions.length === 0 ? [{}] : calendarItem.actions,
    }));
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  const sections = data ? transformData(data.calendar) : [];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CalendarItem item={item} customer={data?.customer} />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
      contentContainerStyle={styles.container}
      stickySectionHeadersEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#f4f4f4",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  item: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
  },
});
