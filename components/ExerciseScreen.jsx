import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import GyroTest from './gyro';


const average = array => {
  try {
    return array.reduce((a, b) => a + b) / array.length;
  } catch (error) {
    return ""
  }
}

const ExerciseScreen = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3); // Workout duration in seconds
  const [sensorData, setSensorData] = useState([]); // Workout duration in seconds

  useEffect(() => {
    let timer;
    if (isWorkoutActive) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsWorkoutActive(false); // End workout
            /// SAVE DATA AT THIS POINT
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer); // Cleanup on unmount
  }, [isWorkoutActive]);

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setTimeRemaining(3); // Reset workout duration
  };

const handleSensorData = (data) => {
  setSensorData(data);
  //would this be where we save data? no as it is constantly updating
}

  return (
    <View>
      {isWorkoutActive ? (
        <>
          <View style={styles.container}>
            <Text style={styles.text}>Workout in progress...</Text>
          </View>
          <GyroTest onSensorData={handleSensorData}/>
          <View style={styles.container}>
            <Text style={styles.timer}>{timeRemaining} seconds remaining</Text>
            {sensorData && (
              <Text>Current:{average(sensorData.history)}</Text>
            )}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.text}>Workout Complete!</Text>
          {sensorData && (
            <Text>You scored:{average(sensorData.history)}</Text>
          )}
        </>
      )}
      <Button title="Start Workout" onPress={startWorkout} disabled={isWorkoutActive} />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  timer: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ExerciseScreen;
