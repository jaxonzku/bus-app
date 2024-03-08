import { React, useEffect, useState } from "react";
import { View, Alert, StyleSheet, Button, Text, TextInput } from "react-native";

import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { auth } from "../../config";
import { SelectList } from "react-native-dropdown-select-list";

const SetRoute = () => {
  const convertToArrayOfObjects = (array) => {
    return array.map((item, index) => ({
      key: (index + 1).toString(),
      value: item.charAt(0).toUpperCase() + item.slice(1),
    }));
  };
  const [routes, setRoutes] = useState(null);
  const [From, setFrom] = useState(null);
  const [To, setTo] = useState(null);
  const dataListee = convertToArrayOfObjects(routes ?? []);
  const [seatNumber, setSeatNumber] = useState(0);
  const db = getDatabase();
  const setMyRoute = () => {
    const seatsObject = {};
    for (let i = 0; i <= seatNumber; i++) {
      seatsObject[i] = false;
    }
    console.log("calling");
    update(ref(db, `/busOperators/${auth.currentUser.email.split("@")[0]}`), {
      from: From ?? "",
      to: To ?? "",
      id: auth.currentUser.email,
      seats: seatsObject,
    })
      .then((e) => {
        Alert.alert(
          "Success",
          "Your Route set succesfully",
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
              style: "default",
            },
          ],
          { cancelable: false }
        );
      })
      .catch((e) => {
        console.log("err", e);
      });
  };
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

  useEffect(() => {
    getRoutes();
  }, []);
  const getRoutes = () => {
    const detailsr = ref(db, "/routes/");
    onValue(detailsr, (snapshot) => {
      const routesrs = snapshot.val();
      setRoutes(routesrs);
      console.log("data", routesrs);
    });
  };

  const handleChange = (value) => {
    // Ensure that only numeric characters are entered
    const regex = /^[0-9]*$/;
    if (regex.test(value) || value === "") {
      setSeatNumber(value);
    }
  };

  return (
    <View>
      <Text>SetRoute</Text>
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
        <View>
          <TextInput
            style={styles.input}
            value={seatNumber}
            onChangeText={handleChange}
            placeholder="Enter available seat count"
            keyboardType="numeric"
          />
        </View>

        <View style={{ paddingBottom: 10 }}></View>

        <Button
          title="Set MY Route"
          style={{ paddingTop: 10 }}
          onPress={() => {
            setMyRoute();
          }}
        />
      </View>
    </View>
  );
};

export default SetRoute;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
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
