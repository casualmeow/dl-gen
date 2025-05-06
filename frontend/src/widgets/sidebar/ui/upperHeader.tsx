import { ThemeSwitch } from "./themeSwitch";
import { HeaderLogo } from "./logo";

export function UpperHeader() {
  return (
    <div className="flex w-full items-center justify-between p-4">
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        <HeaderLogo />
      </div>
      <span className="text-lg font-semibold tracking-tight">PDF to Site</span>
    </div>
    <ThemeSwitch />
  </div>
  );
}