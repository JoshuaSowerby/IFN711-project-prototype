import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import common from '../styles/common';
import { getScoreHistory } from '../db/db';

const ProgressScreen = ({ navigation }) => {
  const[history,setHistory]=useState([]);
  useEffect( ()=>{
    getScoreHistory().then( (result) => {
      setHistory(result);
      console.log(result);
    } );
  },[])

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