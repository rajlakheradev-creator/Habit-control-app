import "./globals.css";

export const metadata = {
  title: "Habit Ctrl | Cyberpunk Edition",
  description: "Gamified Habit Tracker with AI Shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}