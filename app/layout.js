import "./globals.css";


export const metadata = {
  title: "Speech to Text",
  description: "Major Project built by Vishal Jaiswal & Rituraj Pandey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
