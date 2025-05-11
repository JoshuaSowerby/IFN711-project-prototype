import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getExercises } from '../db/exercises';
import { Ionicons } from '@expo/vector-icons'; // Make sure this is imported

const ExerciseListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { difficulty } = route.params;

  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const loadExercises = async () => {
      const exerciseData = await getExercises(difficulty);
      setExercises(exerciseData);
    };
    loadExercises();
  }, [difficulty]); // Added difficulty to the dependency array to reload if difficulty changes

  const handleExercisePress = (exercise) => {
    navigation.navigate('ExerciseDetails', { exercise });
  };

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity style={styles.exerciseItem} onPress={() => handleExercisePress(item)}>
      <View style={styles.imageContainer}>
        {/* You can add logic here to display an actual image if your 'exercises' table has an image URL */}
        <Ionicons name="image-outline" size={40} color="#6B7280" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.exerciseName}>{item.exerciseName}</Text>
        <Text style={styles.exerciseDescription}>{item.description}</Text>
      </View>
      <Ionicons name="play-circle-outline" size={30} color="#6B7280" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{difficulty} Workouts</Text>
        <Ionicons name="person-outline" size={24} color="white" />
      </View>

      {exercises.length > 0 ? (
        <FlatList
          data={exercises}
          renderItem={renderExerciseItem}
          keyExtractor={(item) => item.id.toString()} // Ensure ID is a string for keyExtractor
          style={styles.list}
        />
      ) : (
        <View style={styles.noExercisesContainer}>
          <Text style={styles.noExercisesText}>No exercises found for {difficulty}</Text>
        </View>
      )}
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
    textTransform: 'capitalize', // Capitalize the difficulty text
  },
  list: {
    flex: 1,
    paddingHorizontal: 15,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseDescription: {
    color: '#CBD5E0',
    fontSize: 14,
  },
  noExercisesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noExercisesText: {
    color: '#CBD5E0',
    fontSize: 16,
  },
});

export default ExerciseListScreen;