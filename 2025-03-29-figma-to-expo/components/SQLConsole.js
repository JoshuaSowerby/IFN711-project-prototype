import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import { dbPromise } from '../db/db';

export default function SQLConsole(){
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(true);

    const runQuery = async () =>{
        const db = await dbPromise;
        setError('');
        setResult(null);
        try{
            if (query.startsWith('SELECT')){
                const res = await db.getAllAsync(query);
                setResult(JSON.stringify(res, null, 2));
            } else {
                const res = await db.runAsync(query);
                setResult('successfuly exec query');
            }
        }catch(err){
            console.error(err);
            setResult(err.message || 'error exec query');
        };
    };
    return (
        <SafeAreaView style={styles.container}>
            <Button title='SQL Console' onPress={()=>setIsCollapsed(!isCollapsed)}/>
        {isCollapsed ? (
            <Text>The panel is hidden</Text>
        ) : (
            <View style={styles.container}>
                <Text style={styles.title}>SQL Console</Text>
                <TextInput
                style={styles.input}
                placeholder="Enter SQL query"
                multiline
                value={query}
                onChangeText={setQuery}
                />
                <Button title="Run Query" onPress={runQuery} />
                <ScrollView style={styles.resultBox}>
                {error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : (
                    <Text style={styles.result}>{result}</Text>
                )}
                </ScrollView>
            </View>
        )}
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { padding: 16},
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        minHeight: 80,
        padding: 8,
        marginBottom: 10,
        borderRadius: 8,
        color: 'white'
    },
    resultBox: {
        marginTop: 10,
        maxHeight: 300,
        borderColor: '#eee',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
    },
    result: { fontFamily: 'monospace' , color: 'white'},
    error: { color: 'red', fontFamily: 'monospace' },
});