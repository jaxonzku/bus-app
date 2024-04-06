import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { React, useState, useEffect } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { auth } from "../../config";

const DetailedBooking = ({ route }) => {
	const db = getDatabase();
	const { busID, to, from, rs, bookTo, bookFrom } = route.params;
	const [availableSeats, setavailableSeats] = useState(null);
	const [seat, setseat] = useState(null);
	const convertToObjects = (array) => {
		const result = [];
		array.forEach((value, index) => {
			result.push({
				key: (index + 1).toString(),
				value: value ? "Booked" : index,
				disabled: value,
			});
		});
		return result;
	};

	const getSeats = () => {
		const detailsr = ref(db, `/busOperators/${busID.split("@")[0]}`);
		onValue(detailsr, (snapshot) => {
			const routesrs = snapshot.val();
			setavailableSeats(convertToObjects(routesrs.seats));
			console.log("data", convertToObjects(routesrs.seats));
		});
	};
	useEffect(() => {
		getSeats();
	}, []);

	const bookSeat = () => {
		const detailsr = ref(db, `/busOperators/${busID.split("@")[0]}/seats`);
		let fetchSeats;
		onValue(detailsr, (snapshot) => {
			fetchSeats = snapshot.val();
			// console.log("seatss666666", fetchSeats);
		});
		update(ref(db, `/busOperators/${busID.split("@")[0]}/`), {
			seats: { ...fetchSeats, [seat]: true },
		});
		const oldBookings = ref(db, `/userRole/${busID.split("@")[0]}/myBooking`);
		let olddata;
		onValue(oldBookings, (snapshot) => {
			olddata = snapshot.val();
		});
		console.log("olddata", olddata);
		if (olddata == null) {
			update(ref(db, `/userRole/${busID.split("@")[0]}`), {
				myBooking: [{ from: bookFrom, to: bookTo, amount: rs }],
			}).then((r) => {
				Alert.alert(
					"Success",
					"Your booking succesfully",
					[
						{
							text: "OK",
							onPress: () => console.log("OK Pressed"),
							style: "default",
						},
					],
					{ cancelable: false }
				);
			});
			update(ref(db, `/userRole/${auth.currentUser.email.split("@")[0]}`), {
				myBooking: [{ from: bookFrom, to: bookTo, amount: rs }],
			}).then((r) => {
				Alert.alert(
					"Success",
					"Your booking succesfully",
					[
						{
							text: "OK",
							onPress: () => console.log("OK Pressed"),
							style: "default",
						},
					],
					{ cancelable: false }
				);
			});
		} else {
			update(ref(db, `/userRole/${busID.split("@")[0]}`), {
				myBooking: [...olddata, { from: bookFrom, to: bookTo, amount: rs }],
			}).then((r) => {
				Alert.alert(
					"Success",
					"Your booking succesfully",
					[
						{
							text: "OK",
							onPress: () => console.log("OK Pressed"),
							style: "default",
						},
					],
					{ cancelable: false }
				);
			});
			update(ref(db, `/userRole/${auth.currentUser.email.split("@")[0]}`), {
				myBooking: [{ from: bookFrom, to: bookTo, amount: rs }],
			}).then((r) => {
				Alert.alert(
					"Success",
					"Your booking succesfully",
					[
						{
							text: "OK",
							onPress: () => console.log("OK Pressed"),
							style: "default",
						},
					],
					{ cancelable: false }
				);
			});
		}
	};

	return (
		<View style={{ margin: 10 }}>
			<Text>DetailedBooking</Text>
			<View style={styles.tile}>
				<Text style={styles.busId}>{`Bus ID: ${busID}`}</Text>
				<Text style={styles.busInfo}>{`From: ${from}`}</Text>
				<Text style={styles.busInfo}>{`To: ${to}`}</Text>
				<Text style={styles.busInfo}>{`Amount: ${rs}`}</Text>
			</View>
			<Text>Select seat</Text>
			<SelectList
				setSelected={(val) => setseat(val)}
				data={availableSeats ?? []}
				save="value"
			/>
			<View style={{ paddingBottom: 10 }}></View>

			<Button
				title="Pay and Book"
				style={{ paddingTop: 10, margin: 10 }}
				onPress={() => {
					bookSeat();
				}}
			/>
		</View>
	);
};

export default DetailedBooking;

const styles = StyleSheet.create({
	busId: {
		fontWeight: "bold",
		fontSize: 16,
	},
	busInfo: {
		fontSize: 14,
	},
	tile: {
		backgroundColor: "#87e7fa",
		marginBottom: 10,
		padding: 10,
		borderRadius: 5,
		margin: 10,
	},
});
