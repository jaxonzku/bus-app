import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { auth } from "../config";
import * as SecureStore from "expo-secure-store";

const ScanBus = ({ navigation }) => {
	const [hasPermission, setHasPermission] = useState(null);
	const [scanned, setScanned] = useState(false);
	const [scannedID, setScannedID] = useState("");
	const db = getDatabase();

	async function setSessionData(key, value) {
		try {
			await SecureStore.setItemAsync(key, value);
			console.log("Data stored successfully!");
		} catch (error) {
			console.error("Error storing data:", error);
		}
	}
	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	const markEntered = (busID) => {
		const busBookings = ref(db, `/userRole/${busID.split("@")[0]}/myBooking`);
		let busBookingsList;
		onValue(busBookings, (snapshot) => {
			busBookingsList = snapshot.val();
		});
		console.log("list of book", busBookingsList);
		for (let i = 0; i < busBookingsList?.length; i++) {
			// Check if the busid matches the idToCheck
			if (
				busBookingsList[i].busid === busID &&
				busBookingsList[i].userID == auth.currentUser.email
			) {
				// If matched, add a new property userEntered with value true
				busBookingsList[i].userEntered = true;
				update(ref(db, `/userRole/${busID.split("@")[0]}/myBooking`), {
					...busBookingsList,
				});
				alert(`U have entered the bus`);
				setSessionData("cBus", busID);
				navigation.navigate("Home");
			} else {
				console.log("none match");
			}
		}
	};

	function isBusIdPresent(idToCheck, myBooking) {
		for (let i = 0; i < myBooking.length; i++) {
			if (myBooking[i].busid === idToCheck) {
				console.log("found ");
				markEntered(idToCheck);
				return true; // Found the id
			}
		}

		return false;
	}

	const checkentry = (ID) => {
		const oldBookingsUser = ref(
			db,
			`/userRole/${auth.currentUser.email.split("@")[0]}/myBooking`
		);
		let olddatauser;
		onValue(oldBookingsUser, (snapshot) => {
			olddatauser = snapshot.val();
		});
		isBusIdPresent("c1@g.com", olddatauser);

		console.log("olddatauser", olddatauser);
	};

	useEffect(() => {
		checkentry();
	}, []);

	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true);
		setScannedID(data);
	};

	const renderCamera = () => {
		return (
			<View style={styles.cameraContainer}>
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
					style={styles.camera}
				/>
			</View>
		);
	};

	if (hasPermission === null) {
		return <View />;
	}

	if (hasPermission === false) {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Camera permission not granted</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome to the Barcode Scanner App!</Text>
			<Text style={styles.paragraph}>Scan a barcode to start your job.</Text>
			{renderCamera()}
			<TouchableOpacity
				style={styles.button}
				onPress={() => setScanned(false)}
				disabled={scanned}
			>
				<Text style={styles.buttonText}>Scan QR to Start your job</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	paragraph: {
		fontSize: 16,
		marginBottom: 40,
	},
	cameraContainer: {
		width: "80%",
		aspectRatio: 1,
		overflow: "hidden",
		borderRadius: 10,
		marginBottom: 40,
	},
	camera: {
		flex: 1,
	},
	button: {
		backgroundColor: "blue",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 5,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default ScanBus;
