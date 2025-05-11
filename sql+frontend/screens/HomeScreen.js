// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Ionicons } from '@expo/vector-icons';
import { getLatestScoreHistory } from '../db/scoreHistory';
import { useFocusEffect } from '@react-navigation/native';

const leaderboardData = [
  { name: 'Yonten', score: 89, medal: '🥇' },
  { name: 'Mohul', score: 77, medal: '🥈' },
  { name: 'Joshua', score: 66, medal: '🥉' },
];

const HomeScreen = ({navigation})=> {
  const [userScore, setUserScore]= useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      getLatestScoreHistory().then( (result) => {
        if (result!==null){
          setUserScore(result.score);
          setLoading(false);
        }
      } );
    }, [])
  );

  // const userScore = 60;
  if (loading){
    return(
      <Text>
        Loading...
      </Text>
    )
  }
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>GravityFit</Text>
        <Ionicons name="person-circle-outline" size={32} color="#fff" />
      </View>

      {/* Circular Progress */}
      <View style={styles.gaugeContainer}>
        <AnimatedCircularProgress
          size={150}
          width={15}
          fill={userScore}
          tintColor="#4BC0C0"
          backgroundColor="#1e3d4f"
          arcSweepAngle={240}
          rotation={240}
          lineCap="round"
        >
          {() => (
            <Text style={styles.gaugeText}>{`${userScore}%`}</Text>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Difficulty')}><Text style={styles.buttonText}>Start Workout</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>View Progress</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>View Achievement</Text></TouchableOpacity>

      {/* Leaderboard */}
      {/* <Text style={styles.leaderboardTitle}>Leaderboard</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <Text style={styles.leaderboardItem}>{`${index + 1}. ${item.name} - ${item.score} ${item.medal}`}</Text>
        )}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#132935',
    padding: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  gaugeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#7d90b3',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  leaderboardTitle: {
    marginTop: 16,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leaderboardItem: {
    color: '#fff',
    paddingVertical: 2,
    fontSize: 16,
  },
});

export default HomeScreen;
