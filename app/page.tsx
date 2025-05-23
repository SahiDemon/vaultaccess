'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkSession();
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <p className="text-xl mb-4">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-4">
          Vault Access Security System
        </h1>
        <p className="text-xl mb-8">
          Connected to Supabase project: sandeepamadurajith230@gmail.com's Project
        </p>
        
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Link href="/login" passHref>
            <Button className="w-full">
              Login
            </Button>
          </Link>
          
          <Link href="/register" passHref>
            <Button variant="outline" className="w-full">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
} 