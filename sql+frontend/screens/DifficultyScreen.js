import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function WorkoutDifficultyScreen() {
  const navigation = useNavigation();

  const quotes = [
    "Push yourself, because no one else will do it for you.",
    "Consistency is more important than intensity.",
    "Every rep brings you one step closer to your goal.",
    "Don’t stop until you’re proud.",
    "Strong mind, strong body.",
    "You don’t have to be extreme, just consistent.",
    "Train hard, recover harder.",
    "Discipline is choosing what you want most over what you want now.",
  ];

  const [quote, setQuote] = useState('');

  useFocusEffect(
    useCallback(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.headerText}>CHOOSE YOUR DIFFICULTY</Text>

      {/* Difficulty Buttons */}
      <View style={styles.buttonContainer}>
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

      {/* Motivational Quote */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>“{quote}”</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 25,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  easyButton: {
    backgroundColor: '#2ECC71',
  },
  mediumButton: {
    backgroundColor: '#F39C12',
  },
  hardButton: {
    backgroundColor: '#E74C3C',
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
  quoteContainer: {
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  quoteText: {
    color: '#CBD5E1',
    fontStyle: 'italic',
    fontSize: 15,
    textAlign: 'center',
  },
});
