import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { Dimensions, StyleSheet, Text, View, ScrollView } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.3;
const IMAGE_TOP = SCREEN_HEIGHT * 0.2;

const IMAGE_URI = 'https://lively-sea-c0cb.aless-jeant.workers.dev/image.svg';
const JSON_URI = 'https://lively-sea-c0cb.aless-jeant.workers.dev/json';

export default function App() {
  const [jsonRaw, setJsonRaw] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(JSON_URI)
      .then((res) => res.text())
      .then((text) => {
        setJsonRaw(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        <Text style={[styles.label, { marginTop: IMAGE_TOP }]}>
          Response rendered as an SVG element
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          style={styles.imageScroll}
          contentContainerStyle={styles.imageScrollContent}
        >
          <Image
            source={{ uri: IMAGE_URI }}
            style={[styles.image, { height: IMAGE_HEIGHT, width: IMAGE_HEIGHT * (1400 / 220) }]}
            contentFit="contain"
          />
        </ScrollView>
        <Text style={styles.label}>Raw JSON response:</Text>
        <Text style={styles.jsonText} selectable>
          {loading ? 'Loading…' : error ? `Error: ${error}` : jsonRaw}
        </Text>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    alignItems: 'flex-start',
  },
  imageScroll: {
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  imageScrollContent: {
    flexGrow: 0,
  },
  image: {
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
  },
});
