import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function WorkoutDifficultyScreen() {
  const navigation = useNavigation(); // Get the navigation object

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Start Workout</Text>
        <Ionicons name="person-outline" size={24} color="white" />
      </View>

      {/* Choose Your Difficulty */}
      <Text style={styles.title}>Choose Your Difficulty</Text>

      {/* Difficulty Buttons */}
      <TouchableOpacity
        style={[styles.button, styles.easyButton]}
        onPress={() => navigation.navigate('ExerciseList', { difficulty: 'easy' })}
      >
        <Text style={styles.buttonText}>Easy</Text>
        <Text style={styles.subText}>Beginner level</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.mediumButton]}
        onPress={() => navigation.navigate('ExerciseList', { difficulty: 'medium' })}
      >
        <Text style={styles.buttonText}>Medium</Text>
        <Text style={styles.subText}>Intermediate Level</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.hardButton]}
        onPress={() => navigation.navigate('ExerciseList', { difficulty: 'hard' })}
      >
        <Text style={styles.buttonText}>Hard</Text>
        <Text style={styles.subText}>Advanced Level</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B', // Dark background color
    paddingTop: 40, // Adjust for status bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  easyButton: {
    backgroundColor: '#2ECC71', // Green
  },
  mediumButton: {
    backgroundColor: '#F39C12', // Orange
  },
  hardButton: {
    backgroundColor: '#E74C3C', // Red
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
});