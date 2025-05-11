import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: 16,
    color: '#555',
  },
  statBox: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  button: {
      backgroundColor: '#000',
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
      marginVertical: 8,
  },
  buttonSecondary: {
      backgroundColor: '#ddd',
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
      marginVertical: 4,
  },
  buttonText: {
      color: '#fff',
      fontWeight: 'bold',
  },
  buttonTextSecondary: {
      color: '#000',
      fontWeight: 'bold',
  },
  leaderboardLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 20,
  },
  leaderboardItem: {
      fontSize: 14,
      marginVertical: 2,
  },
});
