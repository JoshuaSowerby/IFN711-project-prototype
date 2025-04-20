import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DifficultyScreen = () => {
    const navigation = useNavigation();
    const handleSelect = (difficulty) => {
        navigation.navigate('ExerciseList', { difficulty })
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Choose Your Difficulty</Text>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={() => handleSelect('easy')}>
            {/*
            add to TouchableOpacity:
                onPress={() => navigation.navigate('???')}
            //???should go to ExerciseListScreen
            */}
            <Text style={styles.buttonText}>Easy{'\n'}Beginner level</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#FFA500' }]} onPress={() => handleSelect('medium')}>
            <Text style={styles.buttonText}>Medium{'\n'}Intermediate Level</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#F44336' }]} onPress={() => handleSelect('hard')}>
            <Text style={styles.buttonText}>Hard{'\n'}Advanced Level</Text>
        </TouchableOpacity>
        </View>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 30,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    button: {
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default DifficultyScreen;
