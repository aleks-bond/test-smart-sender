import { useState, type FormEvent } from 'react';
import { isApiError } from '@/api/errors';
import type { FieldErrors } from '@/api/api.types';
import { Button } from '@/components/atoms/Button';
import { FieldError } from '@/components/atoms/FieldError';
import { FormField } from '@/components/molecules/FormField';
import { useAuth } from './useAuth';

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    setFormError(null);
    try {
      await login({ email, password });
      onSuccess();
    } catch (err) {
      if (isApiError(err) && err.isValidation) setErrors(err.fieldErrors);
      else setFormError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField id="email" label="Email" type="email" autoComplete="username" value={email}
        onChange={(e) => setEmail(e.target.value)} errors={errors.email} required />
      <FormField id="password" label="Password" type="password" autoComplete="current-password" value={password}
        onChange={(e) => setPassword(e.target.value)} errors={errors.password} required />
      {formError && <FieldError messages={[formError]} />}
      <Button type="submit" loading={pending} className="w-full">Sign in</Button>
    </form>
  );
}
