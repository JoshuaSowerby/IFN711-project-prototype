import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import SimulatedSensor from './simulated';
import { insertNewWorkoutSession, getLastScore } from '../db/workoutSession';

const scoreFunc = array => {
  try {
    leftBack=array.map(item=>item.leftBack);
    rightBack=array.map(item=>item.rightBack);
    middleBack=array.map(item=>item.middleBack);//dont know what to do with this yet
    LRbalance=array.map(item=>Math.abs(item.rightBack-item.leftBack));
    LRbalance=LRbalance.filter( value => Number(value) );//removes non numeric
    return average(LRbalance);
  } catch (error) {
    console.error("Error in scoreFunc:", error);
    return '';
  }
  
};

const average = array => {
  try {
    return array.reduce((a, b) => a + b) / array.length;
  } catch (error) {
    return "";
  };
};

const workoutDuration= 10;

const ExerciseComponent = (exercise) => {
  // const route = useRoute();
  // const { exercise } = route.params;// This does work but it would be better to pass as props
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(workoutDuration); // Workout duration in seconds
  const [sensorData, setSensorData] = useState({ history: [] }); 
  const [lastScore, setLastScore] = useState([]);
  const [startTime, setStartTime] = useState('');
  
  useEffect(() => {
    updateLastScore();//Not sure if this needs to be wrpped in async or not... probably doesnt matter if it is late
  }, []);
  
  // workout timer useEffect
  useEffect(() => {
    let timer;
    if (isWorkoutActive) {
      setStartTime( new Date().toISOString().slice(0, 19).replace('T', ' '));//should import this so it is easier to read
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsWorkoutActive(false); // End workout
            return;
          }
          return prev - 1;
        });
      }, 1000);
    }else{
      if (sensorData.history.length>0){
        const score = scoreFunc(sensorData.history);
        //
        // insertNewScore({score:score}).then((result) => {
        console.log(`hello? ${exercise.name}`);
        insertNewWorkoutSession({ name:exercise.name, difficulty:exercise.difficulty, startTime:startTime, totalReps:1, totalScore:score }).then((result) => {
          console.log("Score saved:", score);
          console.log("Insert result:", result);
          setLastScore(score);
        }).catch((err) => {
          console.error("DB insert failed:", err);
        });
      };
    };

    return () => clearInterval(timer); // Cleanup on unmount
  }, [isWorkoutActive]);

  //should these be before useEffects?
  const updateLastScore= async () =>{
    const result = await getLastScore();
    setLastScore(result?.score ?? 'No score')//if result.score not null/exists us it else "no score"
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setTimeRemaining(workoutDuration); // Reset workout duration
  };

const handleSensorData = (data) => {
  setSensorData(data);
}

  return (
    <View>
      {isWorkoutActive ? (//if else
        <>
          <View style={styles.container}>
            <Text style={styles.text}>Workout in progress...</Text>
          </View>
          <SimulatedSensor onSensorData={handleSensorData}/>
          <View style={styles.container}>
            <Text style={styles.timer}>{timeRemaining} seconds remaining</Text>
            {sensorData && (//if exists
              <Text>Current:{scoreFunc(sensorData.history)}</Text>
            )}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.text}>Workout Complete!</Text>
          {sensorData && (
            <Text>You last scored:{lastScore}</Text>
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

export default ExerciseComponent;
