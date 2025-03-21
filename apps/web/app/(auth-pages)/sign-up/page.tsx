'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      alert('Account created! Please sign in.');
      router.push('/sign-in'); // Redirect to sign-in after signup
    } else {
      alert('Error creating account');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
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
      <button onClick={handleSignUp} className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign Up
      </button>
      <p className="mt-4">
        Already have an account? <a href="/sign-in" className="text-blue-500">Sign In</a>
      </p>
    </div>
  );
}