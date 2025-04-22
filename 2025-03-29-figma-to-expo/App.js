import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DifficultyScreen from './screens/DifficultyScreen';
import ProgressScreen from './screens/ProgressScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import ExerciseListScreen from './screens/ExerciseListScreen';
import { initDB } from './db/initDB.js';
import ExerciseDetailsScreen from './screens/ExerciseDetailsScreen';
import ExerciseScreen from './screens/ExerciseScreen.js'
import SQLConsole from './components/SQLConsole.js';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="HomeMain" component={HomeScreen}/>
      <Stack.Screen name="Difficulty" component={DifficultyScreen}/>
      <Stack.Screen name="ExerciseList" component={ExerciseListScreen}/>
      <Stack.Screen name="ExerciseDetails" component={ExerciseDetailsScreen}/>
      <Stack.Screen name="Exercise" component={ExerciseScreen}/>
    </Stack.Navigator>
  );
}
/**
 * login not yet implemented, alot of things arent
 */
export default function App() {
  //why https://devtrium.com/posts/async-functions-useeffect
  //essentially it will only await if you wrap it even though initDB has awiats in it.
  const [isDbReady, setIsDBReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // init DB
        await initDB();
        setIsDBReady(true);
      } catch (error) {
        console.error('Error during initDB:', error);
      }
    })(); // envoke async
  }, []);

  if (!isDbReady) {
    return <Text>Loading...</Text>;
  }
  
  return (
    <NavigationContainer>
      <SQLConsole/>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') iconName = 'home-outline';
            else if (route.name === 'Progress') iconName = 'bar-chart-outline';
            else if (route.name === 'Leaderboard') iconName = 'trophy-outline';
            else if (route.name === 'Settings') iconName = 'settings-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
