import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import QRCode from "react-native-qrcode-svg";
import { auth } from "../config";
import { back } from "react-native/Libraries/Animated/Easing";

const QRCodeScreen = () => {
	return (
		<View>
			<Text>MY QR Code</Text>
			<View
				style={{
					padding: 10,
					// backgroundColor: "red",
					margin: 10,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<QRCode value={auth.currentUser.email} />
			</View>
		</View>
	);
};

export default QRCodeScreen;

const styles = StyleSheet.create({});
