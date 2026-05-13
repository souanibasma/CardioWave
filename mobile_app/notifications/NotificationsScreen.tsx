import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNotificationsService } from '../services/notificationService';

type Notification = {
  id: string;
  title: string;
  body: string;
  receivedAt: string;
};

export default function NotificationsScreen() {
  const { data: notifications = [] } = useNotificationsService();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationBody}>{item.body}</Text>
            <Text style={styles.notificationDate}>{item.receivedAt}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No notifications.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', color: '#007bff', marginBottom: 12, textAlign: 'center' },
  notificationCard: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8 },
  notificationTitle: { fontSize: 16, fontWeight: '500' },
  notificationBody: { fontSize: 14, color: '#555' },
  notificationDate: { fontSize: 12, color: '#999', marginTop: 4 },
});