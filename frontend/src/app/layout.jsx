import './globals.css';
import Loader from '@/components/ui/Loader';

export const metadata = {
  title: 'PromptShield - AI Security & Defense Dashboard',
  description: 'AI Security and Threat Monitoring Dashboard. Real-time prompt injection detection, audit logs, and threat intelligence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var raw = localStorage.getItem('promptshield_appearance_settings');
                if (raw) {
                  var settings = JSON.parse(raw);
                  var t = settings.theme || 'Dark';
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isLight = t === 'Light' || (t === 'System' && !prefersDark);
                  if (isLight) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light-theme');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                  if (settings.layout) {
                    document.documentElement.setAttribute('data-layout', settings.layout.toLowerCase());
                  }
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#0b080e] text-slate-100 antialiased selection:bg-rose-600/30 selection:text-rose-200">
        <Loader />
        {children}
      </body>
    </html>
  );
}
