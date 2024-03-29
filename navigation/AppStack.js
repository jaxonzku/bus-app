import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../screens";
import BookingScreen from "../screens/BookingScreen";
import SetRoute from "../screens/BusOperator/SetRoute";
import DetailedBooking from "../screens/Booking/DetailedBooking";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Book" component={BookingScreen} />
      <Stack.Screen name="SetRoute" component={SetRoute} />
      <Stack.Screen name="DetBook" component={DetailedBooking} />
    </Stack.Navigator>
  );
};
