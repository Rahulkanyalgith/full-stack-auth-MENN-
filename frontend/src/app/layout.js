
import "./globals.css";
import StoreProvider from "./StoreProvider";

export const metadata = {
  title: "Full-stack Auth",
  description: "Made by Rahul",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-500">
        <StoreProvider>
        {children}
        </StoreProvider>
      </body>
    </html>
  );
}
