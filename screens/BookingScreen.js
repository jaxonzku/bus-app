import { StyleSheet, Text, View, Button } from "react-native";
import { React, useEffect, useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { TouchableOpacity } from "react-native-gesture-handler";

const BookingScreen = ({ navigation }) => {
  const [bookFrom, setbookFrom] = useState(null);
  const [bookTo, setbookTo] = useState(null);
  const [availOpers, setavailOpers] = useState(null);
  const [routes, setRoutes] = useState(null);
  const [suitable, setsuitable] = useState(null);

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
    getBusOperators();
  }, []);

  const db = getDatabase();
  const convertToArrayOfObjects = (array) => {
    return array.map((item, index) => ({
      key: (index + 1).toString(),
      value: item.charAt(0).toUpperCase() + item.slice(1),
    }));
  };

  const dataListee = convertToArrayOfObjects(routes ?? []);

  const getBusOperators = () => {
    const opers = ref(db, "/busOperators/");
    onValue(opers, (snapshot) => {
      const routesrs = snapshot.val();
      setavailOpers(convertObjectToBusOperators(routesrs));
      console.log("routesrs", routesrs);
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
  const availableBusOperators = (from, to, busOperators, costPerStop) => {
    // const availableOperators = [];
    // for (const operator of busOperators) {
    //   if (
    //     routes.indexOf(operator.from) <= routes.indexOf(from) &&
    //     routes.indexOf(operator.to) >= routes.indexOf(to)
    //   ) {
    //     availableOperators.push(operator);
    //   }
    // }
    // return availableOperators;
    const availableOperators = [];

    for (const operator of busOperators) {
      const startIndex = routes.indexOf(from);
      const endIndex = routes.indexOf(to);

      if (startIndex !== -1 && endIndex !== -1) {
        const stops = Math.abs(endIndex - startIndex); // Calculate the number of stops

        const cost = stops * costPerStop; // Calculate the total cost

        const operatorWithCost = { ...operator, cost }; // Add the cost to the operator object
        availableOperators.push(operatorWithCost);
      }
    }

    return availableOperators;
  };

  return (
    <View>
      <Text>BookingScreen</Text>
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
                availableBusOperators(bookFrom, bookTo, [...availOpers], 5)
              );
            }}
          />

          <View style={styles.container}>
            <View style={styles.container2}>
              {suitable &&
                suitable.map((busOperator, index) => (
                  <TouchableOpacity
                    style={styles.tile}
                    key={index}
                    onPress={() => {
                      navigation.navigate("DetBook", {
                        busID: busOperator.id,
                        from: busOperator.from,
                        to: busOperator.to,
                        rs: busOperator.cost,
                      });
                    }}
                  >
                    <Text
                      style={styles.busId}
                    >{`Bus ID: ${busOperator.id}`}</Text>
                    <Text
                      style={styles.busInfo}
                    >{`From: ${busOperator.from}`}</Text>
                    <Text
                      style={styles.busInfo}
                    >{`To: ${busOperator.to}`}</Text>
                    <Text
                      style={styles.busInfo}
                    >{`Amount: ${busOperator.cost} rs`}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
    overflow: "scroll",
    height: 350,
    // backgroundColor:"red"
  },
  container2: {},
  tile: {
    backgroundColor: "#f0f0f0",
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
