import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getExercises } from '../db/exercises';
import { Ionicons } from '@expo/vector-icons';

// Preload thumbnails manually
const thumbnailMapping = {
  easy: [
    require('../assets/thumbnails/shoulder01_thumb.jpg'),
    require('../assets/thumbnails/shoulder02onwall_thumb.jpg'),
    require('../assets/thumbnails/shoulder01_thumb.jpg')
  ],
  medium: [
    require('../assets/thumbnails/medium_exercise_thumb.jpg'),
    require('../assets/thumbnails/medium_exercise_thumb.jpg'),
    require('../assets/thumbnails/medium_exercise_thumb.jpg')
  ],
  hard: [
    require('../assets/thumbnails/golf_swing_thumb.jpg'),
    require('../assets/thumbnails/golf_stretch_thumb.jpg'),
    require('../assets/thumbnails/golf_swing_woman_thumb.jpg')
  ]
};

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
  }, [difficulty]);

  const handleExercisePress = (exercise) => {
    navigation.navigate('ExerciseDetails', { exercise });
  };

  const renderExerciseItem = ({ item, index }) => (
    <TouchableOpacity style={styles.exerciseItem} onPress={() => handleExercisePress(item)}>
      <View style={styles.imageContainer}>
        <Image
          source={thumbnailMapping[difficulty][index % thumbnailMapping[difficulty].length]}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.exerciseName}>{item.exerciseName}</Text>
        <Text style={styles.exerciseDescription}>{item.description}</Text>
      </View>
      <Ionicons name="play-circle-outline" size={30} color="#CBD5E0" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Only show title */}
      <Text style={styles.headerText}>{difficulty} Workouts</Text>

      {exercises.length > 0 ? (
        <FlatList
          data={exercises}
          renderItem={renderExerciseItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
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
    paddingTop: 50,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseDescription: {
    color: '#CBD5E0',
    fontSize: 13,
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
