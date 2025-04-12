import {View, Text, StyleSheet, Switch, SafeAreaView, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import { Gyroscope } from 'expo-sensors';

const {width, height} = Dimensions.get('window');

const GyroTest = ({ onSensorData }) =>{
    const [gyroData,setGyroData]=useState({x:0,y:0,z:0});//holds gyro data
    const [controlledDotPosition, setControlledDotPosition]=useState({x:0,y:0,z:0});//stores position of dot on screen, which is controlled by gyroData
    const [history, setHistory] = useState([0]);
    useEffect( () =>{
        let subscriptions;
        subscriptions= Gyroscope.addListener(gyroscopeData =>{
            setGyroData(gyroscopeData);
            // update the position of controlled dot based on gyroscope
            setControlledDotPosition(prevPosition =>({
                x: prevPosition.x - gyroscopeData.y * 4, // multiplication affects sensetivity
                y: prevPosition.y + gyroscopeData.x * 4,
            }));
            //
            setHistory(prevHistory => [...prevHistory, magnitude(controlledDotPosition)]);
            
            // onSensorData && onSensorData ({// if onSensorData exists, do this. Why though, we define it in the GyroTest arro func so it should always exist...
            //     history: history,
            //     position: controlledDotPosition,
            //     magnitude: magnitude(controlledDotPosition),
            //     ngle: angle(controlledDotPosition),
            // })

            //I find this to be more readable than onSensorData && onSensorData. But again shouldn't it always exist? better safe than sorry I guess.
            if (onSensorData){
                onSensorData({//this is the prop that we use to give data to the parent
                    history: history,
                    position: controlledDotPosition,
                    magnitude: magnitude(controlledDotPosition),
                    angle: angle(controlledDotPosition),
    
                });
            };
        });
        return () =>{
            subscriptions?.remove();
        }
    }, [history, controlledDotPosition] );//[] tells react what your effect depends on, if blank then it nver needs to rerun, otherwise it will depend on a value from props
    // essentially it will only look to change this when gyroEnabled is changed
    // had to add history and controlled dot as things are dependent on them

    const magnitude= (controlledDotPosition)=>{
        return Math.sqrt(controlledDotPosition.x**2+controlledDotPosition.y**2);
    };
    
    const angle= (controlledDotPosition)=>{
        return Math.atan((controlledDotPosition.y)/(controlledDotPosition.x)) * 180 / Math.PI;
    };
    
    const truncate=(x)=>{
        try{
            x=x.toString()
            //substring accounts for undersized strings
            if (x.substring(0,1)!='-'){
                x=' '+x;
            }
            x=x.substring(0,10)
            return x
        }catch{
            return 'NaN'
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontVariant: ['tabular-nums']}}>gyroData.x:{truncate(gyroData.x)}</Text>
            <Text style={{fontVariant: ['tabular-nums']}}>gyroData.y:{truncate(gyroData.y)}</Text>
            <Text>Magnitude:{truncate(magnitude(controlledDotPosition))}</Text>
            <Text>Angle:{truncate(angle(controlledDotPosition))}</Text>
            {/**
            <Text>{history.toString() }</Text>
            
            <Text style={{fontVariant: ['tabular-nums']}}>controlledDotPosition.x:{controlledDotPosition.x.toString().padStart(11).substring(0,10)}</Text>
            <Text style={{fontVariant: ['tabular-nums']}}>controlledDotPosition.y:{controlledDotPosition.y.toString().padStart(11).substring(0,10)}</Text>
             */}
            {/*fixed dot */}
            <View style={styles.fixedDot}/>
            <View style={styles.fixedDot2}/>
            <View style={styles.fixedDot3}/>
            {/*controlled dot dot */}
            <View style={{
                ...styles.controlledDot,
                transform:[
                    {translateX:controlledDotPosition.x},
                    {translateY:controlledDotPosition.y}
                ],
            }}/>

            {/*add graph here? */}
        </SafeAreaView>
    );
}
export default GyroTest;


const baseWidth=60
const baseHeight=60;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    title:{
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 80
    },
    fixedDot:{
        width: baseWidth,
        height:baseHeight,
        borderRadius:500,
        backgroundColor:'red',
        position:'absolute',
        top: height/2-baseHeight/2,
        left: width/2-baseWidth/2,
        zIndex: 99
    },
    fixedDot2:{
        width: baseWidth*2,
        height:baseHeight*2,
        borderRadius:5000,
        backgroundColor:'orange',
        position:'absolute',
        top: height/2-baseHeight*2/2,
        left: width/2-baseWidth*2/2,
        zIndex: 98
    },
    fixedDot3:{
        width: baseWidth*3,
        height:baseHeight*3,
        borderRadius:5000,
        backgroundColor:'yellow',
        position:'absolute',
        top: height/2-baseHeight*3/2,
        left: width/2-baseWidth*3/2,
        zIndex: 97
    },
    controlledDot:{
        width: baseWidth*.7,
        height:baseHeight*.7,
        borderRadius:500,
        backgroundColor:'blue',
        position:'absolute',
        top: height/2-baseHeight*.7/2,
        left: width/2-baseWidth*.7/2,
        zIndex: 999

    }
  });
