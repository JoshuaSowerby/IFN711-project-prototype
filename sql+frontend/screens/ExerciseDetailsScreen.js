import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { insertExerciseHistory } from '../db/exerciseHistory';

// Dummy image URL - replace with actual image or video thumbnail
const dummyVideoThumbnail = 'https://via.placeholder.com/320x180/000000/FFFFFF?Text=Video+Thumbnail';

// Dummy instructions - replace with actual instructions from your database
const dummyInstructions = [
  'Step 1: Stand with feet shoulder-width apart.',
  'Step 2: Hold the resistance band with both hands, slightly wider than shoulder-width.',
  'Step 3: Pull the band apart, keeping your arms straight, until your hands are in line with your shoulders.',
];

const ExerciseDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { exercise } = route.params; // Get the exercise object passed from the list screen

  const handleStartExercise = () => {
    console.log('Start Exercise pressed for:', exercise.exerciseName);
    if (exercise.difficulty==='easy'){
      score=100
    }else if(exercise.difficulty==='medium'){
      score=1000
    }else if (exercise.difficulty==='hard'){
      score=10000
    }
    console.log(`${exercise.difficulty} ${score}`)
    insertExerciseHistory(exercise.exerciseName, score)
    // Navigate to the actual exercise screen
    // navigation.navigate('Exercise', { exercise });
  };

  return (
    <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>{exercise?.exerciseName || 'Exercise Details'}</Text>
            <Ionicons name="person-outline" size={24} color="white" />
        </View>

        {/* Video/Image Section */}
        <View style={styles.videoContainer}>
            <Image source={{ uri: dummyVideoThumbnail }} style={styles.videoThumbnail} />
            <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play-circle" size={60} color="white" />
            </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.description}>{exercise?.description || 'err'}</Text>

        {/* How to Perform */}
        <Text style={styles.instructionsTitle}>How to Perform</Text>
        {dummyInstructions.map((step, index) => (
            <Text key={index} style={styles.instructionStep}>{step}</Text>
        ))}

        {/* Start Exercise Button */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  videoThumbnail: {
    width: '90%',
    height: 180,
    borderRadius: 10,
    backgroundColor: '#334155', // Placeholder background
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    color: '#CBD5E0',
    fontSize: 16,
    paddingHorizontal: 20,
    marginBottom: 25,
    textAlign: 'center',
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
    backgroundColor: '#7C3AED', // Purple color
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#2C3E50',
    borderTopWidth: 1,
    borderTopColor: '#34495E',
    marginTop: 'auto', // Push to the bottom
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ExerciseDetailsScreen;