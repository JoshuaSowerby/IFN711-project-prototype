import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import common from '../styles/common';
import { useNavigation, useRoute } from '@react-navigation/native';

const ExerciseDetailsScreen = () => {
    const route = useRoute();
      const navigation=useNavigation();
      const { exercise } = route.params;
    return (
        <View style={common.container}>
            <Text>{exercise.description}</Text>
            <TouchableOpacity style={common.button} onPress={() => navigation.navigate('Exercise', {exercise})}>
                <Text style={common.buttonText}>Start Workout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ExerciseDetailsScreen;