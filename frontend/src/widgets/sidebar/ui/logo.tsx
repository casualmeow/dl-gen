import { Logo } from '../lib/logo'

export function HeaderLogo() {
  return (
    <div className="flex items-center gap-2">
      <Logo className="text-primary w-5 h-5" />
    </div>
  );
}
