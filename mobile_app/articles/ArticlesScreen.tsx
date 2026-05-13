import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useArticlesService } from '../services/articleService';

type Article = {
  id: string;
  title: string;
  summary: string;
};

export default function ArticlesScreen() {
  const { data: articles = [] } = useArticlesService();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medical Articles</Text>
      <FlatList
        data={articles}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.articleCard}>
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleSummary}>{item.summary}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No articles available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', color: '#007bff', marginBottom: 12, textAlign: 'center' },
  articleCard: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8 },
  articleTitle: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  articleSummary: { fontSize: 14, color: '#555' },
});