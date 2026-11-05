import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerToggleButton,
} from "@react-navigation/drawer";

import { WorkoutProvider } from "./src/context/WorkoutContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/firebaseAuth";
import AuthScreen from "./src/screens/AuthScreen";
import ExercisesScreen from "./src/screens/ExercisesScreen";
import ExerciseDetailsScreen from "./src/screens/ExerciseDetailsScreen";
import MyWorkoutScreen from "./src/screens/MyWorkoutScreen";
import AboutScreen from "./src/screens/AboutScreen";
import ProgressScreen from "./src/screens/ProgressScreen";
import WorkoutGuideScreen from "./src/screens/WorkoutGuideScreen";
import TasksScreen from "./src/screens/TasksScreen";
import PhoneOtpScreen from "./src/screens/PhoneOtpScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: "#FFFFFF" },
  headerTintColor: "#111827",
  headerTitleStyle: { fontWeight: "700" },
};

// Stack: open exercise details and return using the back button.
function ExercisesStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="ExerciseList"
        component={ExercisesScreen}
        options={{
          title: "FitPlan • Exercises",
          headerLeft: () => <DrawerToggleButton tintColor="#15803D" />,
        }}
      />
      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetailsScreen}
        options={{ title: "Exercise Details" }}
      />
    </Stack.Navigator>
  );
}

// Tabs: switch between browsing exercises and the workout list.
function WorkoutTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        ...headerOptions,
        tabBarActiveTintColor: "#15803D",
        tabBarInactiveTintColor: "#6B7280",
        tabBarShowIcon: false,
        tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
        tabBarStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Tab.Screen
        name="Exercises"
        component={ExercisesStack}
        options={{
          // The stack supplies this tab's header.
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="My Workout"
        component={MyWorkoutScreen}
        options={{
          title: "My Workout",
          headerLeft: () => <DrawerToggleButton tintColor="#15803D" />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: "Workout Progress" }}
      />
    </Tab.Navigator>
  );
}

// Drawer: switch between the main app and About.
function AppDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        ...headerOptions,
        drawerActiveTintColor: "#15803D",
        drawerActiveBackgroundColor: "#DCFCE7",
      }}
    >
      <Drawer.Screen
        name="Workout Planner"
        component={WorkoutTabs}
        options={{
          // Tabs and stack supply the main app's headers.
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "About FitPlan" }}
      />
      <Drawer.Screen
        name="Workout Guide"
        component={WorkoutGuideScreen}
        options={{ title: "Workout Guide" }}
      />
      <Drawer.Screen
        name="Firebase Tasks"
        component={TasksScreen}
        options={{ title: "Firebase Task Lab" }}
      />
      <Drawer.Screen
        name="Phone OTP Quiz"
        component={PhoneOtpDrawerScreen}
        options={{ title: "Phone Verification" }}
      />
    </Drawer.Navigator>
  );
}

function PhoneOtpDrawerScreen({ navigation }) {
  return <PhoneOtpScreen onBack={() => navigation.navigate("Workout Planner")} />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(
    () => onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    }),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <WorkoutProvider user={user}>
          <NavigationContainer>
            <StatusBar style="dark" />
            {checkingAuth ? (
              <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#15803D" />
              </View>
            ) : user ? (
              <AppDrawer />
            ) : (
              <AuthScreen />
            )}
          </NavigationContainer>
        </WorkoutProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
