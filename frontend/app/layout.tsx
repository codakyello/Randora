import "./globals.css";
import AuthProvider from "./_contexts/AuthProvider";
import QueryProvider from "./_contexts/QueryProvider";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from "@chakra-ui/react";
import { DarkModeProvider } from "./_contexts/DarkModeProvider";

export const metadata = {
  title: {
    template: "%s | Randora",
    default: "Randora",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="lg:text-[62.5%] md:text-[56.25%] text-[50%]" lang="en">
      <body>
        <ChakraProvider>
          <QueryProvider>
            <DarkModeProvider>
              <AuthProvider>{children}</AuthProvider>
            </DarkModeProvider>
          </QueryProvider>
        </ChakraProvider>

        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              duration: 3000,
              style: {
                textAlign: "center",
                background: "green",
                color: "white",
                fontSize: "16px",
              },
            },
            error: {
              duration: 5000,
              style: {
                textAlign: "center",
                background: "red",
                color: "white",
                fontSize: "16px",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
