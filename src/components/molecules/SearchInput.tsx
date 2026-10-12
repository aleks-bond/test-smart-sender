import { useEffect, useRef, useState } from 'react';
import { Input } from '../atoms/Input';

interface Props {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  placeholder?: string;
}

export function SearchInput({ value, onChange, delay = 300, placeholder = 'Search…' }: Props) {
  const [draft, setDraft] = useState(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (draft === value) return;
    const t = setTimeout(() => onChangeRef.current(draft.trim()), delay);
    return () => clearTimeout(t);
  }, [draft, value, delay]);

  return (
    <Input type="search" aria-label="Search by name" placeholder={placeholder} value={draft}
      onChange={(e) => setDraft(e.target.value)} className="max-w-xs" />
  );
}
