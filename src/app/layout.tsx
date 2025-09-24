import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";

export const metadata: Metadata = {
  title: "NetSheets — Network Cheat Sheets",
  description: "Community-driven cheat sheets for Cisco, Juniper, Fortinet, Mikrotik and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {/* Add NavBar */}
        <div className="sticky top-0 z-50">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          {/* Using client component inside layout */}
        </div>
        {/* Render NavBar above content */}
        {(() => {
          const NavBar = require("@/components/NavBar").default;
          return <NavBar />;
        })()}
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}