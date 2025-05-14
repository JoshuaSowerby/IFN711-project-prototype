import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLeaderboard } from '../api/leaderboard';

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();

        // Optional: confirm structure
        console.log('🏆 Leaderboard data:', data);

        // Sort and store
        const sorted = data.sort((a, b) => b.score - a.score);
        setLeaderboard(sorted);
      } catch (error) {
        console.error('❌ Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  const renderItem = ({ item, index }) => {
    const name = typeof item.username === 'string'
      ? item.username
      : typeof item.userId === 'string'
      ? item.userId
      : '[Anonymous]';

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.rank}>{index + 1}</Text>
        <Ionicons name="person-circle" size={32} color="#94a3b8" />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{name}</Text>
          <Text style={styles.score}>Score: {item.score}</Text>
        </View>
        <Text style={styles.medal}>{getMedal(index)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#7C3AED" />
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#334155',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
    width: 25,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  score: {
    fontSize: 14,
    color: '#CBD5E0',
  },
  medal: {
    fontSize: 24,
    marginLeft: 10,
  },
});

export default LeaderboardScreen;
