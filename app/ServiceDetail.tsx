import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCalendar } from "./contexts/CalendarContext";
import { Action, ChallengeData, Customer } from "./models/ChallengeData";
import { getMonthName } from "@/hooks/useTransformedCalendarData";
import usePostNewServiceName, {
  usePostNewServiceNameResult,
} from "@/hooks/usePostNewServiceName";

type ActionDetail = {
  action: Action;
  month: number;
  year: number;
  customer: Customer;
};

const ServiceDetail = () => {
  const params = useLocalSearchParams();
  const {
    data: newData,
    loading: postLoading,
    error: postError,
    postData,
  }: usePostNewServiceNameResult = usePostNewServiceName();
  const { data, loading, error, setData } = useCalendar();
  const [actionDetails, setActionDetails] = useState<ActionDetail | null>();
  const [newName, setNewName] = useState<string>(
    actionDetails?.action.name ?? ""
  );
  const [showSavedChanges, setShowSavedChanges] = useState<boolean>(false);

  const saveChanges = async () => {
    if (!actionDetails || !data) return;

    const updatedData: ChallengeData = JSON.parse(JSON.stringify(data));
    for (const calendar of updatedData.calendar) {
      for (const action of calendar.actions) {
        if (action.id === actionDetails.action.id) {
          action.name = newName;
        }
      }
    }

    try {
      await postData(updatedData);
      findActionById(params.id, updatedData);
      setData(updatedData);
    } catch (err) {
      console.log(error);
    } finally {
      setShowSavedChanges(true);
    }
  };

  const findActionById = (
    actionId: string | string[] | undefined,
    updatedData?: ChallengeData
  ) => {
    if (data != null)
      for (const calendar of updatedData
        ? updatedData.calendar
        : data.calendar) {
        for (const action of calendar.actions) {
          if (action.id === actionId) {
            setActionDetails({
              action,
              month: calendar.month,
              year: calendar.year,
              customer: updatedData ? updatedData.customer : data.customer,
            });
            return { action, month: calendar.month, year: calendar.year };
          }
        }
      }
    return null;
  };

  useEffect(() => {
    findActionById(params.id);
  }, []);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitle: "Back",
      headerTitle: "Details",
    });
  }, []);

  if (loading || postLoading) {
    return (
      <View style={[styles.loadingContainer]}>
        <Text style={[styles.loadingText]}>Loading...</Text>
        <ActivityIndicator></ActivityIndicator>
      </View>
    );
  }

  if (error || postError) {
    return (
      <View style={[styles.errorContainer]}>
        {error ? (
          <Text>There was an error in the request</Text>
        ) : (
          <Text>There was an error changing the name</Text>
        )}
      </View>
    );
  }

  if (actionDetails?.action.status === undefined)
    return (
      <ScrollView>
        <View style={styles.noMaintenanceContainer}>
          <Text style={styles.noMaintenanceText}>No maintenance scheduled</Text>
        </View>
      </ScrollView>
    );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dateStatusContainer}>
        {actionDetails?.action.scheduledDate ? (
          <Text style={styles.textsTitle}>
            {`${getMonthName(actionDetails.month)} ${new Date(
              actionDetails?.action.scheduledDate as string
            ).getDate()}, ${actionDetails.year}`}
          </Text>
        ) : (
          <Text style={styles.textsTitle}>TBD</Text>
        )}
        <Text style={styles.textsTitle}>{actionDetails?.action.status}</Text>
      </View>
      <Text style={styles.textsTitle}>Service Name</Text>
      <TextInput
        defaultValue={
          Array.isArray(actionDetails?.action.name)
            ? actionDetails?.action.name.join(", ")
            : actionDetails?.action.name
        }
        style={styles.input}
        onChangeText={(text) => setNewName(text)}
      />

      {actionDetails?.action.vendor?.vendorName ? (
        <>
          <Text style={styles.textsTitle}>Provided by</Text>
          <Text style={styles.texts}>
            {actionDetails?.action.vendor?.vendorName}
          </Text>
          <Text style={styles.phone}>
            {actionDetails?.action.vendor.phoneNumber}
          </Text>
        </>
      ) : null}
      <Text style={styles.textsTitle}>Address</Text>
      <Text
        style={styles.texts}
      >{`${actionDetails.customer?.street} ${actionDetails.customer?.state}, ${actionDetails.customer?.zip}`}</Text>
      <TouchableOpacity style={styles.button} onPress={saveChanges}>
        <Text style={styles.buttonText}>SAVE CHANGES</Text>
      </TouchableOpacity>
      <Modal
        visible={showSavedChanges}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Changes were successfully saved!
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowSavedChanges(false)}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  dateStatusContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  texts: {
    fontSize: 15,
    backgroundColor: "#f4f4f4",
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  textsTitle: {
    fontSize: 15,
    fontWeight: "bold",
    backgroundColor: "#f4f4f4",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  noMaintenanceContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  noMaintenanceText: {
    fontSize: 15,
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  phone: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#00B47D",
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 7,
    marginBottom: 7,
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
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#00B47D",
    borderRadius: 40,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default ServiceDetail;
