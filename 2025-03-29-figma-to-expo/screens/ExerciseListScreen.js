import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, TouchableOpacity } from 'react-native';
import common from '../styles/common';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getExercises } from '../db/db';

/*
Install expo-sqlite
setup db with table like
id|exerciseName|difficulty|instructions|video|otherData
*/

const ExerciseListScreen = () => {
  const route = useRoute();
  const navigation=useNavigation();
  const { difficulty } = route.params;

  const [exercises, setExercises] = useState([]);

  useEffect( () =>{
    const loadExercises = async () => {
      //somehow broke getExercises
      const exerciseData = await getExercises(difficulty);
      setExercises(exerciseData);
    };
    loadExercises();
  },[] );
  return (
    <View style={common.container}>
        <Text>Exercise List: {difficulty}(should map this or use actual text)</Text>
        {exercises.length > 0 ? (
          exercises.map( (exercise)=>(
            <TouchableOpacity
              key={exercise.id}
              onPress={()=>navigation.navigate('ExerciseDetails', {exercise})}
            >
              <Text>{exercise.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No exercises found</Text>
        )}
    </View>
  );
};

export default ExerciseListScreen;