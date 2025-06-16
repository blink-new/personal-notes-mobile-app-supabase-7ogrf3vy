import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Edit3, Trash2, Calendar, NotebookPen } from 'lucide-react-native';
import { supabase } from '../../supabase/supabase';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    setLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select('id, title, content, created_at, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      Alert.alert('Error', 'Failed to fetch notes.');
    } else {
      setNotes(data as Note[]);
    }
    setLoading(false);
  }

  const handleCreateNote = () => {
    setIsCreating(true);
    setNewTitle('');
    setNewContent('');
    setEditingNote(null);
  };

  async function handleSaveNote() {
    if (!newTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your note');
      return;
    }

    setLoading(true);
    let error = null;

    if (editingNote) {
      const { error: updateError } = await supabase
        .from('notes')
        .update({ title: newTitle, content: newContent, updated_at: new Date().toISOString() })
        .eq('id', editingNote.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('notes')
        .insert({ title: newTitle, content: newContent });
      error = insertError;
    }

    if (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note.');
    } else {
      fetchNotes();
      setIsCreating(false);
      setEditingNote(null);
      setNewTitle('');
      setNewContent('');
    }
    setLoading(false);
  }

  async function handleEditNote(note: Note) {
    setEditingNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setIsCreating(true);
  }

  async function handleDeleteNote(noteId: string) {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const { error } = await supabase
              .from('notes')
              .delete()
              .eq('id', noteId);

            if (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Failed to delete note.');
            } else {
              setNotes(prev => prev.filter(note => note.id !== noteId));
            }
            setLoading(false);
          },
        },
      ]
    );
  }

  const handleCancel = () => {
    setIsCreating(false);
    setEditingNote(null);
    setNewTitle('');
    setNewContent('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading notes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isCreating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editingNote ? 'Edit Note' : 'New Note'}
          </Text>
          <TouchableOpacity onPress={handleSaveNote}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.noteEditor}>
          <TextInput
            style={styles.titleInput}
            placeholder="Note title..."
            value={newTitle}
            onChangeText={setNewTitle}
            placeholderTextColor="#8E8E93"
          />
          <TextInput
            style={styles.contentInput}
            placeholder="Start writing..."
            value={newContent}
            onChangeText={setNewContent}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#8E8E93"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleCreateNote}
        >
          <Plus color="#007AFF" size={24} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.notesList} showsVerticalScrollIndicator={false}>
        {notes.map((note) => (
          <View key={note.id} style={styles.noteCard}>
            <TouchableOpacity 
              style={styles.noteContent}
              onPress={() => handleEditNote(note)}
            >
              <Text style={styles.noteTitle}>{note.title}</Text>
              <Text style={styles.notePreview} numberOfLines={3}>
                {note.content}
              </Text>
              <View style={styles.noteMeta}>
                <Calendar color="#8E8E93" size={14} />
                <Text style={styles.noteDate}>{formatDate(note.updatedAt)}</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.noteActions}>
              <TouchableOpacity 
                onPress={() => handleEditNote(note)}
                style={styles.actionButton}
              >
                <Edit3 color="#007AFF" size={18} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleDeleteNote(note.id)}
                style={styles.actionButton}
              >
                <Trash2 color="#FF3B30" size={18} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {notes.length === 0 && (
          <View style={styles.emptyState}>
            <NotebookPen color="#8E8E93" size={64} />
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to create your first note
            </Text>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    padding: 8,
  },
  cancelButton: {
    fontSize: 16,
    color: '#8E8E93',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  noteEditor: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    paddingBottom: 12,
    marginBottom: 16,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
  },
  notesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noteContent: {
    padding: 16,
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  notePreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  noteActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#8E8E93',
  },
});