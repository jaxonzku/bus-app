import { React, useEffect, useState } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { signOut } from "firebase/auth";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { auth } from "../config";
import { SelectList } from "react-native-dropdown-select-list";

export const HomeScreen = () => {
  const db = getDatabase();
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  const [role, setRole] = useState(null);
  const [routes, setRoutes] = useState(null);

  const getUserDetails = () => {
    const details = ref(db, "userRole/" + auth.currentUser.email.split("@")[0]);
    onValue(details, (snapshot) => {
      const data = snapshot.val();
      console.log("data", data);
      setRole(data);
    });
  };
  const getRoutes = () => {
    const detailsr = ref(db, "userRole/routes");
    onValue(detailsr, (snapshot) => {
      const routesrs = snapshot.val();
      setRoutes(routesrs);
      console.log("data", routesrs);
    });
  };
  const convertToArrayOfObjects = (array) => {
    return array.map((item, index) => ({
      key: (index + 1).toString(),
      value: item.charAt(0).toUpperCase() + item.slice(1),
    }));
  };
  const dataListee = convertToArrayOfObjects(routes ?? []);
  
  const setMyRoute = () => {
    update(ref(db, `/userRole/${auth.currentUser.email.split("@")[0]}`), {
      myroute: {
        from: From ?? "",
        to: To ?? "",
      },
    }).catch((e) => {
      console.log("err", e);
    });
  };
  const availableBusOperators = (from, to, busOperators) => {
    const availableOperators = [];
    for (const operator of busOperators) {
      if (
        busStops.indexOf(operator.from) <= busStops.indexOf(from) &&
        busStops.indexOf(operator.to) >= busStops.indexOf(to)
      ) {
        availableOperators.push(operator);
      }
    }
    return availableOperators;
  };
  const get

  useEffect(() => {
    getUserDetails();
    getRoutes();
  }, []);

  const [From, setFrom] = useState(null);
  const [To, setTo] = useState(null);
  const [bookFrom, setbookFrom] = useState(null);
  const [bookTo, setbookTo] = useState(null);

  return (
    <View style={styles.container}>
      <Text>{`you are a ${role?.userRole}`}</Text>
      {role?.userRole && role?.userRole == "busoperator" && (
        <View style={styles.select}>
          <Text>From</Text>
          <SelectList
            style={styles.select}
            setSelected={(val) => setFrom(val)}
            data={dataListee ?? []}
            save="value"
          />
          <Text>To</Text>
          <SelectList
            setSelected={(val) => setTo(val)}
            data={dataListee ?? []}
            save="value"
          />
          <View style={{ paddingBottom: 10 }}></View>
          <Button
            title="Set MY Route"
            style={{ paddingTop: 10 }}
            onPress={() => { setMyRoute }}
          />
        </View>
      )}
      {role?.userRole && role?.userRole == "student" && (
        <View>
          <View style={styles.select}>
            <Text>BookBus</Text>
            <Text>From</Text>
            <SelectList
              style={styles.select}
              setSelected={(val) => setbookFrom(val)}
              data={dataListee ?? []}
              save="value"
            />
            <Text>To</Text>
            <SelectList
              setSelected={(val) => setbookTo(val)}
              data={dataListee ?? []}
              save="value"
            />
            <View style={{ paddingBottom: 10 }}></View>
            <Button
              title="Find Bus"
              style={{ paddingTop: 10 }}
              onPress={() => {
                availableBusOperators(bookFrom,bookTo)
              }}
            />
          </View>
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

    // backgroundColor: "red",
    margin: 10,

    // flex: 1,
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
});
