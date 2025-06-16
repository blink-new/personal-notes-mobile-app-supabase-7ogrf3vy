import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { supabase } from '../supabase/supabase';

export default function RootLayout() {
  useFrameworkReady();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // User is signed in
        setInitialRoute('(tabs)');
      } else {
        // User is not signed in
        setInitialRoute('auth');
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/(tabs)/notes');
      } else {
        router.replace('/auth');
      }
    });
  }, []);

  if (initialRoute === null) {
    // Still checking session, maybe show a splash screen or loading indicator
    return null; 
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" redirect={true} />
        <Stack.Screen name={(initialRoute === '(tabs)') ? '(tabs)' : 'auth'} options={{ headerShown: false }} />
        <Stack.Screen name="auth" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}