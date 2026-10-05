import "./globals.css";
import { Provider } from "../lib/store";

export const metadata = { title: "Kosmos Schule" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}