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
  const [availOpers, setavailOpers] = useState(null);
  const [suitable, setsuitable] = useState(null);

  console.log("suitable", suitable);
  const convertObjectToBusOperators = (obj) => {
    const busOperators = [];
    let id = 1; // Starting ID for the bus operators
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const operator = obj[key];
        busOperators.push({
          id: operator.id,
          from: operator.from,
          to: operator.to,
        });
        id++; // Increment ID for the next bus operator
      }
    }
    return busOperators;
  };
  const getUserDetails = () => {
    const details = ref(db, "userRole/" + auth.currentUser.email.split("@")[0]);
    onValue(details, (snapshot) => {
      const data = snapshot.val();
      console.log("data", data);
      setRole(data);
    });
  };
  const getRoutes = () => {
    const detailsr = ref(db, "/routes/");
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
    console.log("calling");
    update(ref(db, `/busOperators/${auth.currentUser.email.split("@")[0]}`), {
      from: From ?? "",
      to: To ?? "",
      id: auth.currentUser.email,
    }).catch((e) => {
      console.log("err", e);
    });
  };
  const availableBusOperators = (from, to, busOperators) => {
    const availableOperators = [];
    for (const operator of busOperators) {
      if (
        routes.indexOf(operator.from) <= routes.indexOf(from) &&
        routes.indexOf(operator.to) >= routes.indexOf(to)
      ) {
        availableOperators.push(operator);
      }
    }
    return availableOperators;
  };
  const getBusOperators = () => {
    const opers = ref(db, "/busOperators/");
    onValue(opers, (snapshot) => {
      const routesrs = snapshot.val();

      setavailOpers(convertObjectToBusOperators(routesrs));
      console.log("routesrs", routesrs);
    });
  };

  useEffect(() => {
    getUserDetails();
    getRoutes();
    getBusOperators();
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
            onPress={() => {
              setMyRoute();
            }}
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
                setsuitable(
                  availableBusOperators(bookFrom, bookTo, [...availOpers])
                );
              }}
            />
            <View style={styles.container2}>
              {suitable &&
                suitable.map((busOperator, index) => (
                  <View style={styles.tile}>
                    <Text
                      style={styles.busId}
                    >{`Bus ID: ${busOperator.id}`}</Text>
                    <Text
                      style={styles.busInfo}
                    >{`From: ${busOperator.from}`}</Text>
                    <Text
                      style={styles.busInfo}
                    >{`To: ${busOperator.to}`}</Text>
                  </View>
                ))}
            </View>
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
