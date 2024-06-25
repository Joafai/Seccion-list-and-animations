import {
  SectionList,
  Text,
  StyleSheet,
  ViewToken,
  View,
  ActivityIndicator,
} from "react-native";
import CalendarItem from "@/components/CalendarItem";
import { useSharedValue } from "react-native-reanimated";
import React from "react";
import useTransformedCalendarData from "@/hooks/useTransformedCalendarData";

export default function Calendar() {
  const { data, loading, error } = useTransformedCalendarData();
  const viewableItems = useSharedValue<ViewToken[]>([]);

  if (!loading) {
    return (
      <View style={[styles.loadingContainer]}>
        <Text style={[styles.loadingText]}>Loading...</Text>
        <ActivityIndicator></ActivityIndicator>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorConotainer]}>
        <Text>Error: {error.message}</Text>;
      </View>
    );
  }

  return (
    <SectionList
      sections={data}
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
  loadingText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#00B47D",
  },
  errorConotainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
