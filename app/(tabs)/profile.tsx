import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  LogOut,
  ChevronRight,
  Moon,
  Smartphone,
  Download,
  Trash2
} from 'lucide-react-native';
import { supabase } from '../../supabase/supabase';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out.');
            }
          },
        },
      ]
    );
  }

  const handleExportData = () => {
    Alert.alert('Export Data', 'Your notes will be exported as a backup file');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your notes. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been permanently deleted');
          },
        },
      ]
    );
  };

  const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingsRow = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightContent,
    showChevron = true,
    danger = false 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightContent?: React.ReactNode;
    showChevron?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.settingsRow} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingsLeft}>
        <View style={[styles.iconContainer, danger && styles.dangerIcon]}>
          {icon}
        </View>
        <View style={styles.settingsText}>
          <Text style={[styles.settingsTitle, danger && styles.dangerText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingsSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingsRight}>
        {rightContent}
        {showChevron && onPress && (
          <ChevronRight color="#C7C7CC" size={16} style={styles.chevron} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User color="#fff" size={32} />
          </View>
          <Text style={styles.profileName}>{user?.email || 'Guest'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'Sign in to see your profile'}</Text>
          {/* <Text style={styles.profileStats}>24 notes • Joined Jan 2024</Text> */}
        </View>

        {/* App Settings */}
        <SettingsSection title="App Settings">
          <SettingsRow
            icon={<Moon color="#007AFF" size={20} />}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            rightContent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                thumbColor="#fff"
              />
            }
            showChevron={false}
          />
          <SettingsRow
            icon={<Bell color="#007AFF" size={20} />}
            title="Notifications"
            subtitle="Get notified about important updates"
            rightContent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                thumbColor="#fff"
              />
            }
            showChevron={false}
          />
          <SettingsRow
            icon={<Database color="#007AFF" size={20} />}
            title="Auto Sync"
            subtitle="Automatically sync notes across devices"
            rightContent={
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                thumbColor="#fff"
              />
            }
            showChevron={false}
          />
        </SettingsSection>

        {/* Customization */}
        <SettingsSection title="Customization">
          <SettingsRow
            icon={<Palette color="#007AFF" size={20} />}
            title="Theme"
            subtitle="Customize your app appearance"
            onPress={() => Alert.alert('Theme', 'Theme customization coming soon!')}
          />
          <SettingsRow
            icon={<Smartphone color="#007AFF" size={20} />}
            title="Display"
            subtitle="Adjust text size and layout"
            onPress={() => Alert.alert('Display', 'Display settings coming soon!')}
          />
        </SettingsSection>

        {/* Data & Privacy */}
        <SettingsSection title="Data & Privacy">
          <SettingsRow
            icon={<Download color="#007AFF" size={20} />}
            title="Export Data"
            subtitle="Download a backup of your notes"
            onPress={handleExportData}
          />
          <SettingsRow
            icon={<Shield color="#007AFF" size={20} />}
            title="Privacy Settings"
            subtitle="Manage your data and privacy"
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon!')}
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="Account">
          <SettingsRow
            icon={<LogOut color="#FF3B30" size={20} />}
            title="Sign Out"
            onPress={handleLogout}
            showChevron={false}
            danger
          />
          <SettingsRow
            icon={<Trash2 color="#FF3B30" size={20} />}
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            onPress={handleDeleteAccount}
            showChevron={false}
            danger
          />
        </SettingsSection>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Notes App v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ using Expo</Text>
        </View>
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
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  profileStats: {
    fontSize: 14,
    color: '#8E8E93',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingsLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: '#FFE5E5',
  },
  settingsText: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 2,
  },
  dangerText: {
    color: '#FF3B30',
  },
  settingsSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 100, // Extra padding for tab bar
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
});