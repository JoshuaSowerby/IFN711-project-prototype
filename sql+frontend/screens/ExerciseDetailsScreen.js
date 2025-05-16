import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { insertExerciseHistory } from '../db/exerciseHistory';
import { Video } from 'expo-av';

// 🎥 Video & thumbnail mappings by difficulty and index
const videoMap = {
  easy: [
    { video: require('../assets/videos/shoulder_01.mp4'), thumb: require('../assets/thumbnails/shoulder01_thumb.jpg') },
    { video: require('../assets/videos/shoulder_02_onwall.mp4'), thumb: require('../assets/thumbnails/shoulder02onwall_thumb.jpg') },
    { video: require('../assets/videos/shoulder_01.mp4'), thumb: require('../assets/thumbnails/shoulder01_thumb.jpg') },
  ],
  medium: [
    { video: require('../assets/videos/medium_exercise.mp4'), thumb: require('../assets/thumbnails/medium_exercise_thumb.jpg') },
    { video: require('../assets/videos/medium_exercise.mp4'), thumb: require('../assets/thumbnails/medium_exercise_thumb.jpg') },
    { video: require('../assets/videos/medium_exercise.mp4'), thumb: require('../assets/thumbnails/medium_exercise_thumb.jpg') },
  ],
  hard: [
    { video: require('../assets/videos/golf_swing.mp4'), thumb: require('../assets/thumbnails/golf_swing_thumb.jpg') },
    { video: require('../assets/videos/golf_stretch.mp4'), thumb: require('../assets/thumbnails/golf_stretch_thumb.jpg') },
    { video: require('../assets/videos/golf_swing_woman.mp4'), thumb: require('../assets/thumbnails/golf_swing_woman_thumb.jpg') },
  ],
};

const ExerciseDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { exercise } = route.params;

  const [showVideo, setShowVideo] = useState(false);

  // Determine index for current exercise in the list
  const difficulty = exercise.difficulty;
  const index = Math.max(0, (exercise.id - 1) % 3);
  const { video, thumb } = videoMap[difficulty][index];

  const handleStartExercise = () => {
    let score = 0;
    if (difficulty === 'easy') score = 5;
    else if (difficulty === 'medium') score = 10;
    else if (difficulty === 'hard') score = 20;

    insertExerciseHistory(exercise.exerciseName, score);
    navigation.navigate('Exercise', { exercise, score });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.exerciseTitle}>{exercise.exerciseName}</Text>

      {/* Video Section */}
      <View style={styles.videoContainer}>
        {showVideo ? (
          <Video
            source={video}
            useNativeControls
            resizeMode="contain"
            style={styles.video}
            shouldPlay
          />
        ) : (
          <TouchableOpacity style={styles.thumbnailWrapper} onPress={() => setShowVideo(true)}>
            <Image source={thumb} style={styles.thumbnail} />
            <View style={styles.playButtonOverlay}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.description}>{exercise.description}</Text>

      {/* Instructions */}
      <Text style={styles.instructionsTitle}>How to Perform</Text>
      {(exercise.instructions || 'Step 1\nStep 2\nStep 3')
        .split('\n')
        .map((step, index) => (
          <Text key={index} style={styles.instructionStep}>{step}</Text>
        ))}

      <TouchableOpacity style={styles.startButton} onPress={handleStartExercise}>
        <Text style={styles.startButtonText}>Start Exercise</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingTop: 40,
  },
  exerciseTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  videoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  thumbnailWrapper: {
    position: 'relative',
    width: '90%',
    height: 200,
    backgroundColor: '#334155',
    borderRadius: 10,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '40%',
    left: '45%',
  },
  playIcon: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  video: {
    width: '90%',
    height: 200,
    borderRadius: 10,
  },
  description: {
    color: '#CBD5E0',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 12,
  },
  instructionsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  instructionStep: {
    color: '#CBD5E0',
    fontSize: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 15,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExerciseDetailsScreen;
