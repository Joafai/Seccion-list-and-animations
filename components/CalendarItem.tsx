import {
  View,
  Text,
  StyleSheet,
  ViewToken,
  TouchableOpacity,
} from "react-native";
import { MapPinIcon, CheckCircleIcon } from "react-native-heroicons/solid";
import { ClockIcon } from "react-native-heroicons/outline";
import { Action, Customer } from "@/app/models/ChallengeData";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import React from "react";
import { Link } from "expo-router";

export type CalendarItemProps = {
  item?: Action;
  customer?: Customer;
  viewableItems?: SharedValue<ViewToken[]>;
};

const CalendarItems: React.FC<CalendarItemProps> = React.memo((props) => {
  const { item, customer, viewableItems } = props;

  const animatedStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems?.value
        .filter((item) => item.isViewable)
        .find((viewableItem) => viewableItem.item.id === item?.id)
    );

    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.6),
        },
      ],
    };
  }, []);
  const getBackgroundColor = (status) => {
    switch (status) {
      case "Completed":
        return "#00B47D";
      case "Scheduled":
        return "#006A4B";
      case undefined:
        return "#7e889e";
      default:
        return "#011638";
    }
  };

  const getScheduleMessage = (status) => {
    switch (status) {
      case "Completed":
        return <Text style={[styles.lightText]}>Completed</Text>;
      case "Scheduled":
        return (
          <Text style={[styles.lightText]}>
            Scheduled {item?.arrivalStartWindow} - {item?.arrivalEndWindow}
          </Text>
        );
      default:
        return (
          <Text style={[styles.lightText]}>Schedule date & tiime TBD</Text>
        );
    }
  };

  function getDayAbbreviation(dateStr: string): string {
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const dateObj = new Date(dateStr);
    const dayIndex = dateObj.getDay();
    const dayName = dayNames[dayIndex];

    return dayName;
  }

  return (
    <Link
      asChild
      href={
        item?.status !== undefined
          ? {
              pathname: "/ServiceDetail",
              params: {
                id: item?.id,
              },
            }
          : { pathname: "" }
      }
    >
      <TouchableOpacity>
        <Animated.View style={[animatedStyle]}>
          {item?.status === undefined ? (
            <View style={[styles.dateContainer]}></View>
          ) : null}
          <View key={item?.id} style={[styles.rowContainer]}>
            {item?.status === "Unscheduled" && (
              <View style={[styles.dateContainer]}>
                <Text style={styles.dayName}>TBD</Text>
              </View>
            )}
            {item?.status !== "Unscheduled" && item?.scheduledDate && (
              <View style={[styles.dateContainer]}>
                <Text style={styles.dayName}>
                  {getDayAbbreviation(item?.scheduledDate)}
                </Text>
                <Text style={[styles.dayNumber]}>
                  {new Date(item?.scheduledDate).getDate()}
                </Text>
                {item?.status === "Completed" && (
                  <CheckCircleIcon color={"#00B47D"} />
                )}
                {item?.status === "Scheduled" && (
                  <ClockIcon color={"#00B47D"} />
                )}
              </View>
            )}
            <View
              style={[
                item?.status === undefined
                  ? styles.noMaintenanceContainer
                  : styles.container,
                { backgroundColor: getBackgroundColor(item?.status) },
              ]}
            >
              <Text style={[styles.title]}>{item?.name}</Text>
              {item?.vendor?.vendorName && (
                <Text style={[styles.lightText]}>
                  {item?.vendor?.vendorName}
                </Text>
              )}
              {item?.vendor?.phoneNumber && (
                <Text style={[styles.phoneText]}>
                  {item?.vendor?.phoneNumber}
                </Text>
              )}
              {!item?.status ? (
                <View style={[styles.noMaintenanceContainer]}>
                  <Text style={[styles.noMaintenanceText]}>
                    No Maintenance Scheduled
                  </Text>
                </View>
              ) : (
                <View style={[styles.addressContainer]}>
                  <MapPinIcon color={"#fff"} size={16} />
                  <Text style={[styles.lightText]}>{customer?.street}</Text>
                </View>
              )}
              {!item?.status ? null : getScheduleMessage(item?.status)}
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
});

export default CalendarItems;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: "#00B47D",
    borderRadius: 4,
    paddingTop: 9,
    paddingBottom: 14,
    paddingHorizontal: 16,
    marginBottom: 5,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 1,
  },
  lightText: {
    color: "#fff",
    fontSize: 12,
  },
  phoneText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 10,
  },
  noMaintenanceContainer: {
    borderRadius: 4,
    paddingTop: 1,
    paddingBottom: 5,
    paddingHorizontal: 3,
    marginBottom: 5,
    marginLeft: 40,
    flex: 1,
  },
  noMaintenanceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 10,
  },
  dateContainer: {
    alignItems: "center",
    gap: 10,
    width: "8%",
  },
  dayName: {
    fontSize: 8,
    fontWeight: "black",
    opacity: 0.6,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "bold",
    opacity: 0.8,
  },
});
