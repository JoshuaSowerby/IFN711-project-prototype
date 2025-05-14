import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { insertExerciseHistory } from '../db/exerciseHistory';
import { getLatestScoreHistory } from '../db/scoreHistory';
import { Share } from 'react-native';

// sound 
import { Audio } from 'expo-av';
import successSoundFile from '../assets/sounds/success_01.mp3';
import warningSoundFile from '../assets/sounds/warning.mp3';

// Helper to simulate smooth sensor transitions
const getSmoothValue = (prev, min, max, maxChange = 5) => {
  const delta = Math.floor(Math.random() * (2 * maxChange + 1)) - maxChange;
  let next = prev + delta;
  if (next > max) next = max;
  if (next < min) next = min;
  return next;
};

const ExerciseScreen = () => {
  const successCooldown = useRef(false);
  const warningCooldown = useRef(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { exercise, score } = route.params;
  const [postureFeedback, setPostureFeedback] = useState(null);

  // Sensor states
  const [leftSensor, setLeftSensor] = useState(30);
  const [middleSensor, setMiddleSensor] = useState(50);
  const [rightSensor, setRightSensor] = useState(30);

  const intervalRef = useRef(null);
  const hasFinishedRef = useRef(false);

  const playSound = async (soundFile) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (error) {
      console.error('❌ Sound playback error:', error);
    }
  };

  // ⏱ Simulate gradual sensor changes
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setLeftSensor((prev) => getSmoothValue(prev, 0, 100));
      setMiddleSensor((prev) => getSmoothValue(prev, 0, 100));
      setRightSensor((prev) => getSmoothValue(prev, 0, 100));
    }, 300); // Faster updates for smoother transitions

    return () => clearInterval(intervalRef.current);
  }, []);

  // 🔁 Monitor posture and provide feedback
  useEffect(() => {
    const isGoodPosture = middleSensor > 50 && leftSensor > 30 && rightSensor > 30;
    const isAveragePosture = middleSensor > 25 && leftSensor > 15 && rightSensor > 15;

    if (isGoodPosture) {
      setPostureFeedback({ text: '✅ Good posture! Keep going 💪', color: 'green' });
    } else if (isAveragePosture) {
      setPostureFeedback({ text: '🟡 Average posture – try to improve!', color: 'orange' });
    } else {
      setPostureFeedback({ text: '⚠️ Adjust posture 👀', color: 'red' });
    }

    if (isGoodPosture && !successCooldown.current) {
      successCooldown.current = true;
      playSound(successSoundFile);
      setTimeout(() => (successCooldown.current = false), 3000);
    }

    if (!isGoodPosture && !warningCooldown.current && (middleSensor < 40 || leftSensor < 40 || rightSensor < 40)) {
      warningCooldown.current = true;
      playSound(warningSoundFile);
      setTimeout(() => (warningCooldown.current = false), 3000);
    }
  }, [leftSensor, middleSensor, rightSensor]);

  const finishWorkout = async () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    clearInterval(intervalRef.current);
    await insertExerciseHistory(exercise.exerciseName, score);

    setTimeout(() => {
      Alert.alert(
        'Workout Complete!',
        'Would you like to share your score?',
        [
          { text: 'No, Thanks', style: 'cancel', onPress: () => navigation.navigate('Home') },
          { text: 'Yes, Share', onPress: handleShare },
        ],
        { cancelable: false }
      );
    }, 1000);
  };

  const handleShare = async () => {
    const latest = await getLatestScoreHistory();
    const message = `🏋️ I just completed ${exercise.exerciseName} exercise and scored ${score} points on GravityFit!\n🔋 Battery: ${latest?.batteryLevel ?? 'N/A'}%\nCan you beat my workout?`;
    try {
      await Share.share({ message });
    } catch (error) {
      console.error('❌ Error sharing:', error.message);
    } finally {
      navigation.navigate('Home');
    }
  };

  const getCircleSize = (value) => Math.max(35, (value / 100) * 70);

  return (
    <View style={styles.container}>
      <Text style={styles.exerciseName}>🏋️ {exercise.exerciseName}</Text>

      <View style={styles.sensorColumn}>
        <Text style={styles.sensorLabel}>M</Text>
        <View style={styles.outerCircle}>
          <View style={styles.middleCircle}>
            <View style={[styles.innerDot, {
              width: getCircleSize(middleSensor),
              height: getCircleSize(middleSensor),
              borderRadius: getCircleSize(middleSensor) / 2
            }]} />
          </View>
        </View>
      </View>

      <View style={styles.sideCirclesRow}>
        <View style={styles.sensorColumn}>
          <Text style={styles.sensorLabel}>L</Text>
          <View style={styles.outerCircle}>
            <View style={styles.middleCircle}>
              <View style={[styles.innerDot, {
                width: getCircleSize(leftSensor),
                height: getCircleSize(leftSensor),
                borderRadius: getCircleSize(leftSensor) / 2
              }]} />
            </View>
          </View>
        </View>
        <View style={styles.sensorColumn}>
          <Text style={styles.sensorLabel}>R</Text>
          <View style={styles.outerCircle}>
            <View style={styles.middleCircle}>
              <View style={[styles.innerDot, {
                width: getCircleSize(rightSensor),
                height: getCircleSize(rightSensor),
                borderRadius: getCircleSize(rightSensor) / 2
              }]} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.barsRow}>
        <View style={styles.barContainer}>
          <View style={styles.barBackground}>
            <View style={[styles.barFill, { height: `${leftSensor}%` }]} />
            <View style={styles.barThreshold} />
          </View>
          <Text style={styles.barLabel}>Left Stretch</Text>
        </View>
        <View style={styles.barContainer}>
          <View style={styles.barBackground}>
            <View style={[styles.barFill, { height: `${rightSensor}%` }]} />
            <View style={styles.barThreshold} />
          </View>
          <Text style={styles.barLabel}>Right Stretch</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.stopButton} onPress={finishWorkout}>
        <Text style={styles.stopButtonText}>Stop Exercise</Text>
      </TouchableOpacity>

      {postureFeedback && (
        <Text style={{ color: postureFeedback.color, marginTop: 20, fontWeight: 'bold', fontSize: 16 }}>
          {postureFeedback.text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    paddingTop: 60,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sensorColumn: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  outerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    backgroundColor: 'black',
  },
  sensorLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  sideCirclesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
  barContainer: {
    alignItems: 'center',
  },
  barBackground: {
    width: 20,
    height: 150,
    backgroundColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#00FF00',
  },
  barThreshold: {
    position: 'absolute',
    bottom: 75,
    width: '100%',
    height: 2,
    backgroundColor: 'black',
  },
  barLabel: {
    color: '#fff',
    marginTop: 8,
  },
  stopButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 40,
  },
  stopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ExerciseScreen;
