import { SectionList, Text, StyleSheet, ViewToken } from "react-native";
import useCalendarInfo from "../../hooks/useCalendarInfo";
import CalendarItem from "@/components/CalendarItem";
import { useSharedValue } from "react-native-reanimated";
import React from "react";

const getMonthName = (monthNumber: number): string => {
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
  return monthNames[monthNumber] || "Invalid month";
};

const transformData = (calendar) => {
  return calendar.map((calendarItem) => ({
    title: `${getMonthName(calendarItem.month)} ${calendarItem.year}`,
    data: calendarItem.actions.length === 0 ? [{}] : calendarItem.actions,
  }));
};

export default function Calendar() {
  const { data, loading, error } = useCalendarInfo();
  const viewableItems = useSharedValue<ViewToken[]>([]);

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
        <CalendarItem
          viewableItems={viewableItems}
          item={item}
          customer={data?.customer}
        />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
      contentContainerStyle={styles.container}
      stickySectionHeadersEnabled={false}
      onViewableItemsChanged={({ viewableItems: vItems }) => {
        viewableItems.value = vItems;
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    backgroundColor: "#f4f4f4",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 10,
    marginBottom: 8,
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
