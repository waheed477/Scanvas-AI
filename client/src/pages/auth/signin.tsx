import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Button onClick={() => signIn('google')} className="gap-2">
        <FcGoogle className="w-5 h-5" />
        Sign in with Google
      </Button>
    </div>
  );
}