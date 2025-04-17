import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({navigation}) => {
    
    const leaderboard = [
        { id: '1', name: 'AAAAA', score: 89, medal: '🥇' },
        { id: '2', name: 'BBBBB', score: 77, medal: '🥈' },
        { id: '3', name: 'CCCCC', score: 66, medal: '🥉' },
    ];

    return (
        <View style={styles.container}>
        <View style={styles.topBar}>
            <Ionicons name="person-outline" size={24} color="black" />
        </View>

        <View style={styles.batteryContainer}>
            <Text style={styles.batteryLabel}>Battery</Text>
            <View style={styles.batteryCircles}>
            <View style={styles.batteryCircle}><Text style={styles.batteryText}>60</Text></View>
            <View style={styles.batteryCircle}><Text style={styles.batteryText}>60</Text></View>
            <View style={styles.batteryCircle}><Text style={styles.batteryText}>60</Text></View>
            </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Difficulty')}>
            <Text style={styles.buttonText}>Start Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary}>
            <Text style={styles.buttonTextSecondary}>View Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary}>
            <Text style={styles.buttonTextSecondary}>View Achievement</Text>
        </TouchableOpacity>

        <Text style={styles.leaderboardLabel}>Leaderboard</Text>
        <FlatList
            data={leaderboard}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <Text style={styles.leaderboardItem}>
                {item.id}. {item.name} - {item.score} {item.medal}
            </Text>
            )}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
    topBar: {
        alignItems: 'flex-end',
    },
    batteryContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    batteryLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    batteryCircles: {
        flexDirection: 'row',
        gap: 10,
    },
    batteryCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 4,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    batteryText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonSecondary: {
        backgroundColor: '#ddd',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginVertical: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonTextSecondary: {
        color: '#000',
        fontWeight: 'bold',
    },
    leaderboardLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
    },
    leaderboardItem: {
        fontSize: 14,
        marginVertical: 2,
    },
});

export default HomeScreen;
