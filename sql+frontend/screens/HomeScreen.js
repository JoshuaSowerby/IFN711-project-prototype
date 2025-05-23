// HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Share,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Ionicons } from '@expo/vector-icons';
import { getLatestScoreHistory } from '../db/scoreHistory';
import { useFocusEffect } from '@react-navigation/native';
import { getLeaderboard } from '../api/leaderboard';
import { LinearGradient } from 'expo-linear-gradient';

// Import the GravityFit logo
import Logo from '../assets/GravityFit_Logo.png';
import { FormatScore } from '../utils/FormatScore';

const HomeScreen = ({ navigation }) => {
  const [userScore, setUserScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getLatestScoreHistory().then((result) => {
        if (result !== null) {
          setUserScore(result.score);
          setLoading(false);
        }
      });

      getLeaderboard().then((data) => {
        const top3 = data.slice(0, 3);
        setLeaderboard(top3);
      });
    }, [])
  );

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  const handleShare = async () => {
    const message = `🏋️ I just scored ${userScore} points on GravityFit! Can you beat me?`;
    try {
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <LinearGradient colors={["#132935", "#0f172a"]} style={styles.background}>
      <View style={styles.container}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Score Progress Gauge */}
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeCard}>
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
                <Text style={styles.gaugeText}>{`${FormatScore(userScore)}%`}</Text>
              )}
            </AnimatedCircularProgress>
          </View>
        </View>

        {/* Motivational Quote
        <View style={styles.motivationBox}>
          <Text style={styles.motivationText}>“Stay strong, stay consistent 💪”</Text>
        </View> */}

        {/* Buttons */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Difficulty')}>
          <Ionicons name="barbell-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Start Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Progress')}>
        <Ionicons name="trending-up-outline" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>View Progress</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="star-outline" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>View Achievement</Text>
      </TouchableOpacity>


        {/* Social Sharing */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Share My Score</Text>
        </TouchableOpacity>

        {/* Leaderboard Section */}
        <Text style={styles.leaderboardTitle}>🏆 Top Performers</Text>
        {leaderboard.length === 0 ? (
          <Text style={styles.leaderboardItem}>No data available.</Text>
        ) : (
          leaderboard.map((user, index) => (
            <Text key={index} style={styles.leaderboardItem}>
              {getMedal(index)} {(typeof user.username === 'string' ? user.username : JSON.stringify(user.username))} - {user.score}
            </Text>
          ))
        )}
        <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
          <Text style={[styles.leaderboardItem, { color: '#7C3AED', marginTop: 8 }]}>
            View Full Leaderboard →
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 180,
    height: 60,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  gaugeCard: {
    backgroundColor: '#0f172a',
    padding: 20,
    borderRadius: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gaugeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  motivationBox: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  motivationText: {
    color: '#E0E0E0',
    fontStyle: 'italic',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#7C3AED',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shareButton: {
    backgroundColor: '#3BC9C9',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  leaderboardTitle: {
    marginTop: 24,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leaderboardItem: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 2,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default HomeScreen;
