import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import common from '../styles/common';
import { useNavigation, useRoute } from '@react-navigation/native';

const ExerciseDetailsScreen = () => {
    const route = useRoute();
      const navigation=useNavigation();
      const { exercise } = route.params;
    return (
        <View style={common.container}>
            <Text>{exercise.description}</Text>
            <Text>add start exercise button here</Text>
        </View>
    );
};

export default ExerciseDetailsScreen;