import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function PrimaryButton({ title, onPress }) {
    return (
        <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.txt}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#9fa8da',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 6
    },
    txt: {
        color: '#fff',
        fontWeight: 'bold'
    }
});
