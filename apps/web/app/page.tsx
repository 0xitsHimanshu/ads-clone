// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to the App</h1>
      <p className="mb-4">Please sign in or create an account to get started.</p>
      <div className="space-x-4">
        <Link
          href="/sign-in"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}