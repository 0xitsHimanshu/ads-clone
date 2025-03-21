'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.accessToken) {
      localStorage.setItem('token', data.accessToken); // Client-side storage
      document.cookie = `token=${data.accessToken}; path=/; max-age=3600`; // Set cookie (1 hour expiry)
      router.push('/dashboard'); // Redirect to dashboard
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 mb-2 w-full"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 mb-4 w-full"
      />
      <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign In
      </button>
      <p className="mt-4">
        Don’t have an account? <a href="/sign-up" className="text-blue-500">Sign Up</a>
      </p>
    </div>
  );
}