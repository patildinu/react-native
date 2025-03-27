import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ActivityIndicator, TouchableOpacity, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UNSPLASH_ACCESS_KEY = 'PfH37OzK8hkhunTtF7AG8szL-msqVaQn2pijIHsv9qM'; 
const HomePage = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (err) {
      console.error('Failed to fetch search history:', err);
    }
  };

  const handleSearch = async (reset = false, pageNumber = 1) => {
    if (!searchQuery) return;

    setLoading(true);
    if (reset) {
      setImages([]);
      setPage(1);
      setHasMore(true);
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${UNSPLASH_ACCESS_KEY}&page=${pageNumber}&per_page=5`
      ); 
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setImages(prevImages => reset ? data.results : [...prevImages, ...data.results]);
        setError('');
        saveSearchHistory(searchQuery);
        setHasMore(data.total_pages > pageNumber);
      } else {
        setError('No images found.');
        setHasMore(false);
      }
    } catch (err) {
      setError('Error fetching images');
    } finally {
      setLoading(false);
      setShowHistory(false);
    }
  };

  const saveSearchHistory = async (query) => {
    try {
      const updatedHistory = [query, ...searchHistory.filter(item => item !== query)];
      await AsyncStorage.setItem('searchHistory', JSON.stringify(updatedHistory.slice(0, 5)));
      setSearchHistory(updatedHistory.slice(0, 5));
    } catch (err) {
      console.error('Failed to save search history:', err);
    }
  };

  const handleHistorySelect = (query) => {
    setSearchQuery(query);
    handleSearch(true);
    setShowHistory(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setImages([]);
    setError('');
    setShowHistory(false);
  };

  const loadMoreImages = async () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      setPage(prevPage => {
        const newPage = prevPage + 1;
        handleSearch(false, newPage); // Pass the new page number
        return newPage;
      });
      setLoadingMore(false); 
    }
  };

  const handleInputChange = (text) => {
    setSearchQuery(text);
    if (text.length > 0) {
      setShowHistory(true);
    } else {
      setShowHistory(false);
    }
  };

  const renderImageItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.urls.small }} style={styles.image} />
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Image Search</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search images"
            value={searchQuery}
            onChangeText={handleInputChange}
            onSubmitEditing={() => handleSearch(true)}
          />
          <TouchableOpacity onPress={() => handleSearch(true)} style={styles.iconContainer}>
            <FontAwesomeIcon icon={faSearch} size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {showHistory && searchHistory.length > 0 && (
          <View style={styles.historyContainer}>
            {searchHistory.map((query, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleHistorySelect(query)}
                style={styles.historyItemContainer}
              >
                <Text style={styles.historyItem}>{query}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {loading && <ActivityIndicator size="large" color="green" />}
        {!loading && images.length > 0 ? (
          <FlatList
            data={images}
            renderItem={renderImageItem}
            keyExtractor={item => item.id}
            onEndReached={loadMoreImages}
            onEndReachedThreshold={0.5} // Trigger loading more when the user is 50% away from the end
            ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="green" /> : null}
          />
        ) : (
          !loading && <Text style={styles.emptyText}>No images found. Try a different search!</Text>
        )}
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f7f7',
  },
  headerContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 33,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    height: '8%',
    elevation: 3,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerText: { 
    fontSize: 20, 
    fontWeight: "500", 
    color: "rgb(79, 78, 78)", 
    alignItems: 'center', 
    paddingLeft: 75, 
    textAlign: "center" 
  },
  content: {
    paddingHorizontal: 16,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    height: 45,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 0.5,
    paddingHorizontal: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    paddingHorizontal: 0,
    right: 40,
    height: 20,
    width: 0,
    borderRadius: 0,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  historyContainer: {
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
  },
  historyItemContainer: {
    paddingVertical: 5,
  },
  historyItem: {
    color: 'blue',
  },
  imageContainer: {
    width: '100%',
    height: 250, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default HomePage;
