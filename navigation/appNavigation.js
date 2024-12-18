import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, Settings, Text, View } from 'react-native';
import HomeScreen from "../src/screens/HomeScreen";
import SettingsScreen from "../src/screens/SettingsScreen";
import { ThemeProvider } from "../src/context/ThemeContext";
import { TemperatureProvider  } from "../src/context/TemperatureContext";
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default function AppNavigation() {
    return (
        <TemperatureProvider>
            <ThemeProvider>
                <NavigationContainer>
                    <Stack.Navigator>
                        {/* Home Screen */}
                        <Stack.Screen 
                        name="Home"
                        options={{headerShown: false}}
                        component={HomeScreen} />
                        {/* Settings Screen */}
                        <Stack.Screen
                        name="Settings"
                        options={{title: "Settings", headerStyle: {backgroundColor: '#1f1f1f'}, headerTintColor: '#fff'}} 
                        component={SettingsScreen} />

                    </Stack.Navigator>
                </NavigationContainer>
            </ThemeProvider>
        </TemperatureProvider>
    )
}