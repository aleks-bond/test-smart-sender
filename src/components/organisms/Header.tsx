import { Link } from 'react-router-dom';
import { Button } from '../atoms/Button';

interface Props {
  onLogout: () => void;
  loggingOut?: boolean;
}

export function Header({ onLogout, loggingOut }: Props) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/webhooks" className="font-semibold text-slate-900">Webhooks</Link>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Button variant="secondary" onClick={onLogout} loading={loggingOut}>Log out</Button>
        </div>
      </div>
    </header>
  );
}
