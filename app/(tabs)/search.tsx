import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Clock, TrendingUp } from 'lucide-react-native';
import { supabase } from '../../supabase/supabase';

interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(query: string) {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    setLoading(query.length > 0);
    setSearchResults([]); // Clear previous results

    if (query.trim().length > 0) {
      const { data, error } = await supabase
        .from('notes')
        .select('id, user_id, title, content, created_at, updated_at')
        .or(
          `title.ilike.%${query}%,content.ilike.%${query}%`
        )
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error searching notes:', error);
        Alert.alert('Error', 'Failed to search notes.');
        setSearchResults([]);
      } else {
        setSearchResults(data as Note[]);
      }
      setLoading(false);
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setLoading(false);
  };

  const handleQuickSearch = (query: string) => {
    handleSearch(query);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#8E8E93" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#8E8E93"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X color="#8E8E93" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : !isSearching ? (
          <>
            {/* Recent Searches */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock color="#8E8E93" size={18} />
                <Text style={styles.sectionTitle}>Recent</Text>
              </View>
              <View style={styles.chipContainer}>
                {/* Replace with actual recent searches from user history if implemented */}
                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => handleQuickSearch('example')}
                >
                  <Text style={styles.chipText}>example</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Trending Searches */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp color="#8E8E93" size={18} />
                <Text style={styles.sectionTitle}>Trending</Text>
              </View>
              <View style={styles.chipContainer}>
                 {/* Replace with actual trending searches if implemented */}
                 <TouchableOpacity
                  style={styles.chip}
                  onPress={() => handleQuickSearch('ideas')}
                >
                  <Text style={styles.chipText}>ideas</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Search Results */}
            <View style={styles.section}>
              <Text style={styles.resultsHeader}>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
              </Text>
              
              {searchResults.length === 0 ? (
                <View style={styles.noResults}>
                  <Search color="#8E8E93" size={48} />
                  <Text style={styles.noResultsTitle}>No results found</Text>
                  <Text style={styles.noResultsSubtitle}>
                    Try searching with different keywords
                  </Text>
                </View>
              ) : (
                searchResults.map((note) => (
                  <TouchableOpacity key={note.id} style={styles.resultCard}>
                    <Text style={styles.resultTitle}>{note.title}</Text>
                    <Text style={styles.resultContent} numberOfLines={2}>
                      {note.content}
                    </Text>
                    <Text style={styles.resultDate}>{formatDate(note.created_at)}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  resultsHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  resultContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  resultDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 18,
    color: '#8E8E93',
  },
});