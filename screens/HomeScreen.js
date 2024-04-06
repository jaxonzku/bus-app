import { React, useEffect, useState } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { signOut } from "firebase/auth";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { auth } from "../config";
import { SelectList } from "react-native-dropdown-select-list";
import * as SecureStore from "expo-secure-store";
import { string } from "yup";

export const HomeScreen = ({ navigation }) => {
	const [alerting, setalerting] = useState(false);
	async function getSessionData(key) {
		try {
			const data = await SecureStore.getItemAsync(key);
			if (data !== null) {
				console.log("Retrieved data:", data);
				return data;
			} else {
				console.log("No data found");
				return null;
			}
		} catch (error) {
			console.error("Error retrieving data:", error);
			return null;
		}
	}
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
	const [balance, setBalance] = useState(0);

	const getAmount = () => {
		const currBalance = ref(
			db,
			"userRole/" + auth.currentUser.email.split("@")[0] + "/balance"
		);

		onValue(currBalance, (snapshot) => {
			const data = snapshot.val();
			setBalance(data);
		});
	};

	const getAlert = () => {
		const alertinfo = ref(
			db,
			"busOperators/" + auth.currentUser.email.split("@")[0] + "/alert"
		);

		onValue(alertinfo, (snapshot) => {
			const data = snapshot.val();
			setalerting(data);
		});
	};

	useEffect(() => {
		getUserDetails();
		getAmount();
		getAlert();
	}, []);

	useEffect(() => {
		console.log("alering", alerting);
		if (alerting) {
			alert(`somebody is in trouble,please stop the bus`);
		}
	}, [alerting]);

	const [alerts, setalert] = useState(false);

	return (
		<View style={styles.container}>
			<Text>{`you are a ${role?.userRole}`}</Text>
			{role?.userRole && role?.userRole == "customer" && (
				<Text>{`Your Balance : ${balance}`}</Text>
			)}
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
			{role?.userRole && role?.userRole == "customer" && (
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
			<View style={{ padding: 20 }}>
				<Button
					title="My Bookings"
					style={{ paddingTop: 10, padding: 10, backgroundColor: "green" }}
					onPress={() => {
						navigation.navigate("MyBookings");
					}}
				/>
			</View>
			<View style={{ padding: 20 }}>
				<Button
					title="Top up"
					style={{ paddingTop: 10, padding: 10, backgroundColor: "green" }}
					onPress={() => {
						navigation.navigate("Topup");
					}}
				/>
			</View>
			{role?.userRole && role?.userRole == "customer" && (
				<View style={{ padding: 20 }}>
					<Button
						title="Enter Bus"
						style={{ paddingTop: 10, padding: 10, backgroundColor: "green" }}
						onPress={() => {
							navigation.navigate("ScanBus");
						}}
					/>
				</View>
			)}
			{role?.userRole && role?.userRole == "busoperator" && (
				<View style={{ padding: 20 }}>
					<Button
						title="My QR Code"
						style={{ paddingTop: 10, padding: 10, backgroundColor: "green" }}
						onPress={() => {
							navigation.navigate("QRCODE");
						}}
					/>
				</View>
			)}

			{role?.userRole && role?.userRole == "customer" && (
				<View style={{ padding: 20 }}>
					<Button
						title={alerts ? "Turn Alert ON" : "Turn Alert Off"}
						style={{ paddingTop: 10, padding: 10, backgroundColor: "green" }}
						onPress={async () => {
							let cBus = await getSessionData("cBus");
							console.log("cBus", cBus);
							if (cBus != null) {
								const busOperdetails = ref(
									db,
									`/busOperators/${cBus.split("@")[0]}`
								);
								let busoperatorAlert;
								onValue(busOperdetails, (snapshot) => {
									busoperatorAlert = snapshot.val();
								});
								console.log("list of book", busoperatorAlert);
								update(ref(db, `/busOperators/${cBus.split("@")[0]}/`), {
									...busoperatorAlert,
									alert: alerts,
								});
								setalert((prev) => !prev);
							}
						}}
					/>
				</View>
			)}

			<Button
				title="Sign Out"
				style={{ paddingTop: 30 }}
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
