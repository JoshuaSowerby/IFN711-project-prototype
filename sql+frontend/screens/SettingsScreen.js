import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { insertScoreHistory } from '../db/scoreHistory';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleBatteryReset = async () => {
    await insertScoreHistory(0, 100); // Reset battery to 100%
    Alert.alert('Battery Reset', 'Battery level has been reset to 100%');
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('JWT');
    await SecureStore.deleteItemAsync('username');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Settings</Text>

      {/* Notifications Toggle */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Workout Reminders</Text>
        <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
      </View>

      {/* Battery Reset */}
      <TouchableOpacity style={styles.button} onPress={handleBatteryReset}>
        <Text style={styles.buttonText}>Reset Battery to 100%</Text>
      </TouchableOpacity>

      {/* Feedback */}
      <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Feedback", "Feature coming soon!")}>
        <Text style={styles.buttonText}>Send Feedback</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={[styles.button, { backgroundColor: '#E74C3C' }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 20,
    paddingTop: 50,
  },
  sectionTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    alignItems: 'center',
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#334155',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
