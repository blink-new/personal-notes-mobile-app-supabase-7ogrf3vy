import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Clock, TrendingUp } from 'lucide-react-native';

const mockNotes = [
  {
    id: '1',
    title: 'Welcome to Notes!',
    content: 'This is your first note. Tap to edit or create a new one using the + button.',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Ideas for Tomorrow',
    content: 'Remember to review project proposals, call mom, buy groceries, plan weekend trip',
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    title: 'Meeting Notes',
    content: 'Discussed quarterly goals, budget allocation, team restructuring, and upcoming product launches',
    createdAt: new Date('2024-01-13'),
  },
];

const recentSearches = ['meeting', 'ideas', 'project'];
const trendingSearches = ['productivity', 'goals', 'planning'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockNotes>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    
    if (query.trim().length > 0) {
      const results = mockNotes.filter(note =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleQuickSearch = (query: string) => {
    handleSearch(query);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        `**${part}**` : part
    ).join('');
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
        {!isSearching ? (
          <>
            {/* Recent Searches */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock color="#8E8E93" size={18} />
                <Text style={styles.sectionTitle}>Recent</Text>
              </View>
              <View style={styles.chipContainer}>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.chip}
                    onPress={() => handleQuickSearch(search)}
                  >
                    <Text style={styles.chipText}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Trending Searches */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp color="#8E8E93" size={18} />
                <Text style={styles.sectionTitle}>Trending</Text>
              </View>
              <View style={styles.chipContainer}>
                {trendingSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.chip}
                    onPress={() => handleQuickSearch(search)}
                  >
                    <Text style={styles.chipText}>{search}</Text>
                  </TouchableOpacity>
                ))}
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
                    <Text style={styles.resultDate}>{formatDate(note.createdAt)}</Text>
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
});