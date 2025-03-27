import { Moon, Sun } from "lucide-react"
import { Switch, Label } from "entities/components"
import { useTheme } from "entities/theme"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <>
        <Switch 
          id="theme-toggle" 
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
        <Label htmlFor="theme-toggle">
          {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          Toggle theme
        </Label>
    </>
  )
}
