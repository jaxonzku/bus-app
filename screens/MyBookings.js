import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { getDatabase, ref, set, onValue, update } from "firebase/database";

const MyBookings = () => {
	const db = getDatabase();
	const getMyBookings = () => {
		const details = ref(db, "userRole/" + auth.currentUser.email.split("@")[0]);
		onValue(details, (snapshot) => {
			const data = snapshot.val();
			console.log("mybookings", data);
			setRole(data);
		});
	};

	return (
		<View>
			<Text>MyBookings</Text>
		</View>
	);
};

export default MyBookings;

const styles = StyleSheet.create({});
