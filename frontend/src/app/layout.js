import './globals.css';

export const metadata = {
  title: 'ERP Dashboard',
  description: 'Real-time AI ERP Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
