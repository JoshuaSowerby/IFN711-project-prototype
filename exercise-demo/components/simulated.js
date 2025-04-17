import {View, Text, StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import { csvData } from '../assets/test-3-slow-stretch-each-arm';
import Papa from 'papaparse';

const {width, height} = Dimensions.get('window');


const SimulatedSensor = ({onSensorData}) =>{
    const [data,setData] = useState([]);//chack that this isnt redundant
    const [currentIndex, setCurrentIndex] = useState(0);
    const [controlledDotPosition, setControlledDotPosition]=useState({leftBack:0, middleBack:0, rightBack:0, leftArm:0, rightArm:0})//useState({x:0,y:0,z:0});//stores position of dot on screen, which is controlled by gyroData
    const [history, setHistory] = useState([0]);

    //load the data from the csv
    useEffect( ()=>{
        const loadData = async () => {
            const parsed = Papa.parse(csvData.trim(), {
                header: true,
                dynamicTyping:true
            });
            setData(parsed.data);
        }
        loadData();
    }, []);

    // this use effect simulates the data
    useEffect(()=>{
        if (data.length === 0) return;//if no data return nothing and dont do the rest of this. will prevent from runing before we load the data

        //setInterval() method calls a function at specified intervals (in milliseconds)
        // so we are using this to simulate getting a sensor input every x milliseconds
        // based off csv's provided should be every 100 miliseconds (I think)
        const interval = setInterval(()=>{

            // data is an array of objects with the fields: time, leftBack, middleBack, rightBack, leftArm, rightArm
            const sensorData = data[currentIndex];//set current sensor data value
            
            if(!sensorData){//if sensorData null or undef, stop
                clearInterval(interval);
                return;
            }

            setControlledDotPosition({
                leftBack: sensorData.leftBack,
                middleBack: sensorData.middleBack,
                rightBack: sensorData.rightBack,
                leftArm: sensorData.leftArm,
                rightArm: sensorData.rightArm
            });
            setHistory(prevHistory => [...prevHistory, controlledDotPosition]);
            if(onSensorData){
                onSensorData ({
                    history: history,
                    position: controlledDotPosition,
                    //magnitude: magnitude(controlledDotPosition),
                    //angle: angle(controlledDotPosition),
                });
            };
            setCurrentIndex(prev => prev + 1);//should change this to loop
        },100);//update every 100miliseconds
        return ()=>clearInterval(interval);
    },[data,currentIndex,controlledDotPosition]);


    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontVariant: ['tabular-nums']}}>leftBack:{controlledDotPosition.leftBack}</Text>
            <Text style={{fontVariant: ['tabular-nums']}}>middleBack:{controlledDotPosition.middleBack}</Text>
            <Text style={{fontVariant: ['tabular-nums']}}>rightBack:{controlledDotPosition.rightBack}</Text>
            <Text style={{fontVariant: ['tabular-nums']}}>leftArm:{controlledDotPosition.leftArm}</Text>
            <Text style={{fontVariant: ['tabular-nums']}}>rightArm:{controlledDotPosition.rightArm}</Text>

            {/*fixed dot */}
            <View style={styles.fixedDot}/>
            <View style={styles.fixedDot2}/>
            <View style={styles.fixedDot3}/>
            {/*controlled dot not calibrated, TODO: add one for arms too */}
            <View style={{
                ...styles.controlledDot,
                transform:[
                    {translateX:(controlledDotPosition.rightBack-controlledDotPosition.leftBack)/10 },
                    {translateY:controlledDotPosition.middleBack/10}
                ],
            }}/>

            {/*add graph here? */}
        </SafeAreaView>
    );
};


export default SimulatedSensor;


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
