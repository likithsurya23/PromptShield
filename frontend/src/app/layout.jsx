import './globals.css';

export const metadata = {
  title: 'PromptShield - AI Security & Defense Dashboard',
  description: 'AI Security and Threat Monitoring Dashboard. Real-time prompt injection detection, audit logs, and threat intelligence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060a12] text-slate-100 antialiased selection:bg-blue-600/30 selection:text-blue-200">
        {children}
      </body>
    </html>
  );
}
