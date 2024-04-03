import { StyleSheet, Text, Button, TextInput, View } from "react-native";
import React, { useState } from "react";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { auth } from "../config";

const TopUP = () => {
	const db = getDatabase();

	const [amount, setAmount] = useState(0);
	const [current, setcurrent] = useState(0);

	const myTopUp = () => {
		const curentTopup = ref(
			db,
			"userRole/" + auth.currentUser.email.split("@")[0] + "/balance"
		);
		onValue(curentTopup, (snapshot) => {
			const data = snapshot.val();
			setcurrent(data);
		});
		update(ref(db, `/userRole/${auth.currentUser.email.split("@")[0]}`), {
			balance: parseInt(amount, 10) + current,
		});
	};

	return (
		<View>
			<View style={{ margin: 20 }}>
				<TextInput
					style={styles.input}
					placeholder="Enter Top Up Amount"
					keyboardType="numeric"
					value={amount}
					onChangeText={(event) => {
						console.log("vv", event);
						setAmount(event);
					}}
				/>
			</View>
			<View style={{ padding: 20 }}>
				<Button
					title="Top Up"
					style={{ paddingTop: 10, padding: 10, backgroundColor: "green" }}
					onPress={() => {
						myTopUp();
					}}
				/>
			</View>
		</View>
	);
};

export default TopUP;

const styles = StyleSheet.create({
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
	},
});
