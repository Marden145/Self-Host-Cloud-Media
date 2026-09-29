import { Aperture, BookImage, Heart, Images, Sparkles, Trash2, Users } from 'lucide-react'
import { cn } from '../../utils/utils'

const NAV = [
  { label: 'Biblioteca', icon: Images, active: true },
  { label: 'Favoritos', icon: Heart },
  { label: 'Álbumes', icon: BookImage },
  { label: 'Papelera', icon: Trash2 },
]

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-highlight">
        <Aperture className="size-5" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-tight">SelfHostCloudMedia</span>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r bg-sidebar px-4 py-5 lg:flex">
      <div className="px-2">
        <Logo />
      </div>
      <nav aria-label="Principal" className="mt-8">
        <ul className="flex flex-col gap-1">
          {NAV.map(({ label, icon: Icon, active }) => (
            <li key={label}
                href="#"
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}