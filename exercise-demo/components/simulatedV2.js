import React, {useState, useEffect} from 'react';
import { View, StyleSheet } from "react-native"
import { csvData } from '../assets/test-3-slow-stretch-each-arm';
import Papa from 'papaparse';

/*
Why this is bad
- radius increases take up more area
- peole are bad at reading size
- small (unless we make landscape)
- ratios make them all move constantly
- unclear when doing good, unclear that you need to be between the blue and red lines
- should probably use precise sizes for everything then scale them because at the moment the limits are arbitrary
Suggested changes
- rather than circles, could just be bars, then it is just height
- make them rings not circles so It is clearer where you are
- could use rings rather than lines for optimal limits, then we could offse 2 of the circles for more room
*/



///It my make sense to parse the sensor values to this component rathe than simualte them inside it...
export const SimulatedSensorV2 = ({onSensorData, limits}) =>{
    const [data,setData] = useState([]);//check that this isnt redundant
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sensorReading, setSensorReading]=useState({leftBack:0, middleBack:0, rightBack:0, leftArm:0, rightArm:0})//useState({x:0,y:0,z:0});//stores position of dot on screen, which is controlled by gyroData
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
    
                setSensorReading({
                    leftBack: sensorData.leftBack,
                    middleBack: sensorData.middleBack,
                    rightBack: sensorData.rightBack,
                    leftArm: sensorData.leftArm,
                    rightArm: sensorData.rightArm
                });
                setHistory(prevHistory => [...prevHistory, sensorReading]);
                if(onSensorData){
                    onSensorData ({
                        history: history,
                        position: sensorReading,
                        //magnitude: magnitude(controlledDotPosition),
                        //angle: angle(controlledDotPosition),
                    });
                };
                setCurrentIndex(prev => prev + 1);
            },100);//update every 100miliseconds
            return ()=>clearInterval(interval);
        },[data,currentIndex,sensorReading]);


    const outerLimitTop = limits.outerLimitTop;
    const innerLimitTop = limits.innerLimitTop;
    const innerLimitBottom = limits.innerLimitBottom;
    const outerLimitBottom = limits.outerLimitBottom;

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        outerLimitTop: {
          position: 'absolute',
          top: outerLimitTop,
          width: '60%',
          height: 4,
          backgroundColor: 'red',
          borderRadius: 2,
          zIndex:999
        },
        innerLimitTop: {
          position: 'absolute',
          top: innerLimitTop,
          width: '60%',
          height: 2,
          backgroundColor: 'blue',
          zIndex:999
    
        },
        centerLine: {
          position: 'absolute',
          top: '50%',
          width: '60%',
          height: 1,
          backgroundColor: 'black',
          zIndex:999
    
        },
        innerLimitBottom: {
          position: 'absolute',
          top: innerLimitBottom,
          width: '60%',
          height: 2,
          backgroundColor: 'blue',
          zIndex:999
    
        },
        outerLimitBottom: {
          position: 'absolute',
          top: outerLimitBottom,
          width: '60%',
          height: 4,
          backgroundColor: 'red',
          borderRadius: 2,
          zIndex:999
    
        },
        circlesRow: {
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          width: '100%',
        },
        circle: {
          borderRadius: 999,
          backgroundColor: 'magenta',
          width: 30,
          height: 30,
          margin:'15%'
        },
        stretchBarRow: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          width: '40%',
          height: 50,
        },
        barContainer: {
          width: 20,
          bottom:'10%',
          position: 'absolute',
          height: '20%',
          backgroundColor: '#ddd',
          borderRadius: 6,
          overflow: 'hidden',
          flexDirection: 'column-reverse',
        },
        fill: {
          backgroundColor: 'limegreen',
        },
        empty: {
          backgroundColor: 'transparent',
        },
      });

    //ratio*3 as optimal is 1/3, so no scaling at optimal? but we want min size, so add 1? or use actual min
    const lRatio = () =>{
        const total=sensorReading.leftBack+sensorReading.rightBack+sensorReading.middleBack;
        return Math.max((sensorReading.leftBack/total)*3,.5);
    };
    const mRatio = () =>{
        const total=sensorReading.leftBack+sensorReading.rightBack+sensorReading.middleBack;
        return Math.max((sensorReading.middleBack/total)*3,.5);
    };
    const rRatio = () =>{
        const total=sensorReading.leftBack+sensorReading.rightBack+sensorReading.middleBack;
        return Math.max((sensorReading.rightBack/total)*3,.5);
    };

    return(
        <View style={styles.container}>
            {/* Limit lines */}
            <View style={styles.outerLimitTop} />
            <View style={styles.innerLimitTop} />
            <View style={styles.innerLimitBottom} />
            <View style={styles.outerLimitBottom} />
            <View style={styles.centerLine} />
                {/* Pressure Circles */}
            <View style={styles.circlesRow}>
                <View style={[styles.circle, { transform: [{ scale: lRatio() }] }]}/>
                <View style={[styles.circle, { transform: [{ scale: mRatio() }] }]}/>
                <View style={[styles.circle, { transform: [{ scale: rRatio() }] }]}/>
            </View>
            <View style={[styles.barContainer, {left:'30%'}]}>
                <View style={[styles.fill, { flex: sensorReading.leftArm/100 }]} />
                <View style={[styles.empty, { flex: 1 - sensorReading.leftArm/100 }]} />
            </View>
            <View style={[styles.barContainer, {right:'30%'}]}>
                <View style={[styles.fill, { flex: sensorReading.rightArm/100 }]} />
                <View style={[styles.empty, { flex: 1 - sensorReading.rightArm/100 }]} />
            </View>
        </View>
    )
}

  