import type { InputHTMLAttributes } from 'react';
import { FieldError } from '../atoms/FieldError';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  errors?: string[];
}

export function FormField({ id, label, errors, ...rest }: Props) {
  const errorId = `${id}-error`;
  const invalid = !!errors?.length;
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} invalid={invalid} aria-describedby={invalid ? errorId : undefined} {...rest} />
      <FieldError id={errorId} messages={errors} />
    </div>
  );
}
