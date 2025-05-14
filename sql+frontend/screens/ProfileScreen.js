// import { View, Text, FlatList } from 'react-native';
// const ProgressScreen = ({ navigation }) => {
//     return (
//     <Text>
//         Todo
//     </Text>);
// }
// export default ProgressScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getScoreHistory, getLatestScoreHistory } from '../db/scoreHistory';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('Username');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [battery, setBattery] = useState(100);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    (async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) setUsername(storedUsername);

      const latest = await getLatestScoreHistory();
      const history = await getScoreHistory();

      if (latest) {
        setScore(latest.score);
        setBattery(latest.batteryLevel ?? 100);
      }

      if (history && history.length > 0) {
        const best = Math.max(...history.map(h => h.score));
        setBestScore(best);
        setStreak(calculateStreak(history));
      }
    })();
  }, []);

  const calculateStreak = (history) => {
    const days = history
      .map(item => new Date(item.timestamp).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b) - new Date(a));

    let count = 1;
    for (let i = 0; i < days.length - 1; i++) {
      const current = new Date(days[i]);
      const prev = new Date(days[i + 1]);
      if ((current - prev) / (1000 * 60 * 60 * 24) === 1) {
        count++;
      } else {
        break;
      }
    }
    return count;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture */}
      <View style={styles.profileImage}>
        <Ionicons name="image-outline" size={50} color="#6B7280" />
      </View>

      {/* Username */}
      <Text style={styles.username}>{username}</Text>

      {/* Score Summary */}
      <Text style={styles.score}>GravityFit Score : {score}</Text>
      <Text style={styles.summaryTitle}>Summary</Text>
      <Text style={styles.summary}>Best Score: {bestScore}</Text>
      <Text style={styles.summary}>Streak: {streak} days</Text>

      {/* Battery Gauge */}
      <View style={styles.gaugeContainer}>
        <AnimatedCircularProgress
          size={180}
          width={20}
          fill={battery}
          tintColor="#FFA726"
          backgroundColor="#FFE0B2"
          arcSweepAngle={180}
          rotation={270}
          lineCap="round"
        >
          {() => (
            <Ionicons name="battery-half" size={32} color="#FF5722" />
          )}
        </AnimatedCircularProgress>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  profileImage: {
    backgroundColor: '#CBD5E1',
    borderRadius: 100,
    width: 100,
    height: 100,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  score: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FACC15',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summary: {
    textAlign: 'center',
    color: '#E2E8F0',
    fontSize: 14,
    marginBottom: 2,
  },
  gaugeContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
});

export default ProfileScreen;
