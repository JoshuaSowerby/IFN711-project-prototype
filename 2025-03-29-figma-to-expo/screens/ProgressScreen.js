import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import common from '../styles/common';
import { getScoreHistory } from '../db/score';
import { useFocusEffect } from '@react-navigation/native';

const ProgressScreen = ({ navigation }) => {
  const[history,setHistory]=useState([]);

  //this should be changed to update whenever we look at it.
  //So we can rerender things on the page without calling this again
  useFocusEffect(
    React.useCallback(() => {
      getScoreHistory().then((result) => {
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
                {item.id}. score: {item.score}, time: {item.Timestamp}
            </Text>
            )}
        />
    </View>
  );
};

export default ProgressScreen;