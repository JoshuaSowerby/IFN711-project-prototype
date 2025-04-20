import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import common from '../styles/common';
import { useFocusEffect } from '@react-navigation/native';
import { getWorkoutSessionHistory } from '../db/workoutSession';

const ProgressScreen = ({ navigation }) => {
  const[history,setHistory]=useState([]);

  //this should be changed to update whenever we look at it.
  //So we can rerender things on the page without calling this again
  useFocusEffect(
    React.useCallback(() => {
      getWorkoutSessionHistory().then((result) => {
        setHistory(result);
        console.log('Score history updated:', result);
      });
    }, [])
  );

/*apparently this is bad... 
//this will run whenever the component is rendered which can cause issues
  useEffect( ()=>{
    getScoreHistory().then( (result) => {
      setHistory(result);
      console.log(result);
    } );
  })
  */

  return (
    <View style={common.container}>
        {/*query SQLite for things*/}
        <Text style={common.leaderboardLabel}>Score History</Text>
        <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <Text style={common.leaderboardItem}>
                {item.id}. name {item.name} score: {item.totalScore}, time: {item.endTime}
            </Text>
            )}
        />
    </View>
  );
};

export default ProgressScreen;