import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import DifficultyScreen from './screens/DifficultyScreen';
import ExerciseListScreen from './screens/ExerciseListScreen';
import ExerciseDetailsScreen from './screens/ExerciseDetailsScreen';
import ExerciseScreen from './screens/ExerciseScreen';

// import ProgressScreen from './screens/ProfileScreen';
import ProgressScreen from './screens/ProgressScreen';
import ProfileScreen  from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';

import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { initDB } from './db/initDB';

import { useDailyDecay } from './utils/decay';
import { isTokenExpired } from './utils/jwt';


export default function App() {
  const [isDBReady, setIsDBReady]= useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);//replace with auth check


  useEffect(()=>{
    (async () =>{
      try {
        //check token, shouldnt init if expired...
        // const expired=await isTokenExpired();
        console.log(111);
        //init db
        await initDB();
        setIsDBReady(true);
      } catch (error) {
        console.error(error);
      }
    })();//evoke unamed func
  },[]);

  useDailyDecay(isDBReady);
  
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function AuthStack() {
    return (
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} />
          )}
        </Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
      </Stack.Navigator>
    )
  }
  function HomeStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Difficulty" component={DifficultyScreen}/>
        <Stack.Screen name="ExerciseList" component={ExerciseListScreen}/>
        <Stack.Screen name="ExerciseDetails" component={ExerciseDetailsScreen}/>
        <Stack.Screen name="Exercise" component={ExerciseScreen}/>
      </Stack.Navigator>
    );
  }
  
  if (!isDBReady){
    return(<Text>Loading...</Text>);
  }
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Home') iconName = 'home-outline';
              else if (route.name === 'Progress') iconName = 'bar-chart-outline';
              else if (route.name === 'Leaderboard') iconName = 'trophy-outline';
              else if (route.name === 'Progile') iconName = 'person-outline';
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
          <Tab.Screen name="Profile" component={ProfileScreen}
            options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person-outline" size={size} color={color} />
                          ),}}/>          
        <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
