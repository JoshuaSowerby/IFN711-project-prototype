import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, StackedBarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { getScoreHistory } from '../db/scoreHistory';

const screenWidth = Dimensions.get('window').width;

const ProgressScreen = () => {
  const [weeklyData, setWeeklyData] = useState(null);
  const [summary, setSummary] = useState({
    bestScore: 0,
    avgFormRating: 'Good',
    totalMinutes: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const history = await getScoreHistory();
        if (!history || history.length === 0) return;

        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const frequency = Array(7).fill(0);
        const postureData = Array(7).fill(0);
        let best = 0;
        let total = 0;

        history.forEach(entry => {
          const date = new Date(entry.timestamp);
          const weekday = date.getDay(); // 0=Sun, 6=Sat
          const index = weekday === 0 ? 6 : weekday - 1;

          const posture = Math.floor(entry.score * 0.4);
          const effort = Math.floor(entry.score * 0.6);
          postureData[index] += posture;
          frequency[index] += effort;

          best = Math.max(best, entry.score);
          total += 15; // Assume 15 mins per session
        });

        setWeeklyData({ labels, postureData, frequency });
        setSummary({ bestScore: best, avgFormRating: 'Good', totalMinutes: total });
        console.log('✅ Progress data loaded');
      } catch (error) {
        console.error('❌ Progress Screen Error:', error);
      }
    };

    fetchData();
  }, []);

  const safeData =
    weeklyData?.frequency?.length === 7 && weeklyData?.postureData?.length === 7;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.title}>Progress</Text>
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </View>

      {/* Weekly Score Chart */}
      <Text style={styles.sectionTitle}>Weekly GravityFit Score</Text>
      {safeData ? (
        <LineChart
          data={{
            labels: weeklyData.labels,
            datasets: [{ data: weeklyData.frequency }],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={{
            backgroundGradientFrom: '#1E293B',
            backgroundGradientTo: '#1E293B',
            color: (opacity = 1) => `rgba(252, 76, 76, ${opacity})`,
            labelColor: () => '#CBD5E0',
            strokeWidth: 2,
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#FC4C4C',
            },
          }}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.fallback}>Not enough data to show score trend.</Text>
      )}

      {/* Stacked Bar Chart */}
      <Text style={styles.sectionTitle}>Workout Frequency</Text>
      {safeData ? (
        <StackedBarChart
          data={{
            labels: weeklyData.labels,
            legend: ['Posture', 'Reps'],
            data: weeklyData.frequency.map((val, i) => [
              weeklyData.postureData[i],
              val,
            ]),
            barColors: ['#FBBF24', '#818CF8'],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#1E293B',
            backgroundGradientTo: '#1E293B',
            decimalPlaces: 0,
            color: () => '#fff',
            labelColor: () => '#CBD5E0',
          }}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.fallback}>Not enough data to show frequency chart.</Text>
      )}

      {/* Summary Box */}
      <Text style={styles.sectionTitle}>Summary</Text>
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Best Score</Text>
          <Text style={styles.summaryValue}>{summary.bestScore}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Avg Form Rating</Text>
          <Text style={styles.summaryValue}>{summary.avgFormRating}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Time</Text>
          <Text style={styles.summaryValue}>{summary.totalMinutes} mins</Text>
        </View>
        <View style={styles.summaryReview}>
          <Text style={styles.reviewText}>“Your Highest Score”</Text>
          <Text style={styles.reviewText}>“Avg. Posture Quality”</Text>
          <Text style={styles.reviewText}>“Total Minutes Exercised”</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  chart: {
    borderRadius: 12,
    marginBottom: 24,
  },
  fallback: {
    color: '#CBD5E0',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  summaryReview: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  reviewText: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 2,
  },
});

export default ProgressScreen;
