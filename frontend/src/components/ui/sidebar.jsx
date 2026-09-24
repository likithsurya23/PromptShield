'use client';

import * as React from 'react';
import Link from 'next/link';
import { PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
// const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3.5rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

const SidebarContext = React.createContext(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const [isMobile, setIsMobile] = React.useState(false);

  // Check mobile screen
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Restore open state from localStorage/cookie
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('promptshield_sidebar_state');
        if (stored !== null) {
          _setOpen(stored === 'true');
        }
      } catch {}
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      try {
        localStorage.setItem('promptshield_sidebar_state', String(openState));
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      } catch {}
    },
    [setOpenProp, open]
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((prev) => !prev) : setOpen((prev) => !prev);
  }, [isMobile, setOpen, setOpenMobile]);

  // Keyboard shortcut Ctrl+B or Cmd+B
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        data-state={state}
        style={{
          '--sidebar-width': SIDEBAR_WIDTH,
          '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
          ...style,
        }}
        className={cn(
          'group/sidebar-wrapper flex min-h-screen w-full has-data-[variant=inset]:bg-sidebar',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'icon',
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    if (!openMobile) return null;
    return (
      <div className="fixed inset-0 z-50 flex">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setOpenMobile(false)}
        />
        <div
          className={cn(
            'relative z-50 flex h-full w-[18rem] flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-2xl',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }

  const isCollapsed = state === 'collapsed' && collapsible === 'icon';

  return (
    <aside
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
      className={cn(
        'group peer hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border select-none transition-all duration-200 ease-linear z-40',
        isCollapsed ? 'w-(--sidebar-width-icon)' : 'w-(--sidebar-width)',
        className
      )}
      {...props}
    >
      <div
        data-sidebar="sidebar"
        data-slot="sidebar-inner"
        className="flex size-full flex-col bg-sidebar"
      >
        {children}
      </div>
    </aside>
  );
}

export function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      aria-label="Toggle Sidebar"
      title="Toggle Sidebar (Ctrl+B)"
      onClick={(e) => {
        onClick?.(e);
        toggleSidebar();
      }}
      className={cn(
        'p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-700/60',
        className
      )}
      {...props}
    >
      <PanelLeft className="w-4 h-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

export function SidebarRail({ className, ...props }) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
        className
      )}
      {...props}
    />
  );
}

export function SidebarInset({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-inset"
      className={cn(
        'relative flex w-full flex-1 flex-col bg-background min-w-0 overflow-y-auto',
        className
      )}
      {...props}
    />
  );
}

export function SidebarInput({ className, ...props }) {
  return (
    <input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn(
        'h-8 w-full bg-background rounded-lg border border-slate-700 px-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500',
        className
      )}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn('flex flex-col gap-2 p-3 border-b border-sidebar-border', className)}
      {...props}
    />
  );
}

export function SidebarFooter({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2 border-t border-sidebar-border relative', className)}
      {...props}
    />
  );
}

export function SidebarSeparator({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn('mx-2 my-1 h-px bg-sidebar-border', className)}
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden p-2',
        className
      )}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn('relative flex w-full min-w-0 flex-col py-1', className)}
      {...props}
    />
  );
}

export function SidebarGroupLabel({
  className,
  as: Component = 'div',
  ...props
}) {
  const { state } = useSidebar();
  if (state === 'collapsed') return null;

  return (
    <Component
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        'px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider',
        className
      )}
      {...props}
    />
  );
}

export function SidebarGroupAction({ className, ...props }) {
  return (
    <button
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        'absolute top-2 right-2 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-slate-400 hover:text-white',
        className
      )}
      {...props}
    />
  );
}

export function SidebarGroupContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn('w-full text-sm space-y-0.5', className)}
      {...props}
    />
  );
}

export function SidebarMenu({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn('flex w-full min-w-0 flex-col gap-0.5', className)}
      {...props}
    />
  );
}

export function SidebarMenuItem({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  );
}

export function SidebarMenuButton({
  isActive = false,
  tooltip,
  className,
  href,
  children,
  onClick,
  ...props
}) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const baseClasses = cn(
    'peer/menu-button group/menu-button flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors cursor-pointer select-none',
    isActive
      ? 'bg-blue-600/15 text-blue-400 font-semibold'
      : 'text-slate-300 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    isCollapsed && 'justify-center px-0 py-2.5',
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        data-slot="sidebar-menu-button"
        data-sidebar="menu-button"
        data-active={isActive}
        className={baseClasses}
        title={isCollapsed && tooltip ? tooltip : undefined}
        onClick={onClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-active={isActive}
      className={baseClasses}
      title={isCollapsed && tooltip ? tooltip : undefined}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function SidebarMenuAction({ className, ...props }) {
  return (
    <button
      type="button"
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        'absolute top-2 right-2 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-slate-400 hover:text-white',
        className
      )}
      {...props}
    />
  );
}

export function SidebarMenuBadge({ className, ...props }) {
  const { state } = useSidebar();
  if (state === 'collapsed') return null;

  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        'pointer-events-none ml-auto flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[10px] font-semibold text-slate-400 tabular-nums',
        className
      )}
      {...props}
    />
  );
}

export function SidebarMenuSkeleton({ className, showIcon = true, ...props }) {
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn('flex h-8 items-center gap-2.5 rounded-md px-3', className)}
      {...props}
    >
      {showIcon && <div className="w-4 h-4 rounded bg-slate-800 animate-pulse shrink-0" />}
      <div className="h-3 w-3/4 rounded bg-slate-800 animate-pulse" />
    </div>
  );
}

export function SidebarMenuSub({ className, ...props }) {
  const { state } = useSidebar();
  if (state === 'collapsed') return null;

  return (
    <div
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        'ml-4 pl-3.5 border-l border-sidebar-border space-y-0.5 py-1',
        className
      )}
      {...props}
    />
  );
}

export function SidebarMenuSubItem({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn('relative', className)}
      {...props}
    />
  );
}

export function SidebarMenuSubButton({
  isActive = false,
  className,
  href,
  children,
  onClick,
  ...props
}) {
  const baseClasses = cn(
    'block w-full px-2.5 py-1.5 rounded-md text-xs transition-colors text-left truncate',
    isActive
      ? 'text-blue-400 font-semibold bg-blue-600/10'
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40',
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        data-slot="sidebar-menu-sub-button"
        data-sidebar="menu-sub-button"
        data-active={isActive}
        className={baseClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-active={isActive}
      className={baseClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
