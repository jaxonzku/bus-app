import { React, useEffect, useState } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { signOut } from "firebase/auth";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { auth } from "../config";
import { SelectList } from "react-native-dropdown-select-list";

export const HomeScreen = ({ navigation }) => {
  const db = getDatabase();
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  const [role, setRole] = useState(null);

  const getUserDetails = () => {
    const details = ref(db, "userRole/" + auth.currentUser.email.split("@")[0]);
    onValue(details, (snapshot) => {
      const data = snapshot.val();
      console.log("data", data);
      setRole(data);
    });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{`you are a ${role?.userRole}`}</Text>
      {role?.userRole && role?.userRole == "busoperator" && (
        <View style={{ padding: 20 }}>
          <Button
            title="Set Route"
            style={{ paddingTop: 10 }}
            onPress={() => {
              navigation.navigate("SetRoute");
            }}
          />
        </View>
      )}
      {role?.userRole && role?.userRole == "student" && (
        <View style={{ padding: 20 }}>
          <Button
            title="Book Tickets"
            style={{ paddingTop: 10 }}
            onPress={() => {
              navigation.navigate("Book");
            }}
          />
        </View>
      )}

      <Button
        title="Sign Out"
        style={{ paddingTop: 10 }}
        onPress={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 10,
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  select: {
    marginTop: 50,
    marginBottom: 20,
    // backgroundColor: "red",
    padding: 20,
    paddingBottom: 30,
  },
  tile: {
    marginTop: 15,
    backgroundColor: "#d3e6f0",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  busId: {
    fontWeight: "bold",
    fontSize: 16,
  },
  busInfo: {
    fontSize: 14,
  },
});
