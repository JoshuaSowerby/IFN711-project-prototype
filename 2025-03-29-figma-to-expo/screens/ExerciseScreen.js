//This will be a modified version of https://github.com/JoshuaSowerby/IFN711-exercise-demo.git, which is located in "exercise-demo"
import React from 'react';
import { View, Text,  StyleSheet } from 'react-native';
import common from '../styles/common';
import { useRoute } from '@react-navigation/native';
import ExerciseComponent from '../components/ExerciseComponent';

const ExerciseScreen = () => {
    const route = useRoute();
    const { exercise } = route.params;
  return (
    <View style={common.container}>
        <ExerciseComponent/>
    </View>
  );
};

export default ExerciseScreen;