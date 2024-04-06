import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { auth } from "../../bus-app/config";

const MyBookings = () => {
	const db = getDatabase();
	const [myBookings, setMyBookings] = useState([]);

	const getMyBookings = () => {
		const details = ref(
			db,
			"userRole/" + auth.currentUser.email.split("@")[0] + "/myBooking"
		);
		onValue(details, (snapshot) => {
			const data = snapshot.val();
			console.log("mybookings", data);
			setMyBookings(data);
		});
	};

	useEffect(() => {
		getMyBookings();
	}, []);

	return (
		<View>
			<Text>MyBookings</Text>
			{myBookings.map((booking, index) => (
				<View style={styles.tile} key={index}>
					<Text style={styles.tileText}>From: {booking.from}</Text>
					<Text style={styles.tileText}>To: {booking.to}</Text>
					<Text style={styles.tileText}>Amount: {booking.amount}</Text>
				</View>
			))}
		</View>
	);
};

export default MyBookings;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	tile: {
		backgroundColor: "gray",
		padding: 10,
		marginBottom: 10,
		borderRadius: 5,
		margin: 20,
	},
	tileText: {
		fontSize: 16,
		marginBottom: 5,
	},
});
