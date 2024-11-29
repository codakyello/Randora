import { Poppins, Sono, Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./_contexts/AuthProvider";
import QueryProvider from "./_contexts/QueryProvider";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from "@chakra-ui/react";
import { DarkModeProvider } from "./_contexts/DarkModeProvider";

const poppins = Poppins({
  subsets: ["latin"], // Add other subsets if needed
  weight: ["400", "500", "600", "700"], // Specify the font weights you need
});

const sono = Sono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Specify the font weights you need
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Specify the font weights you need
});

export const metadata = {
  title: {
    template: "%s |  The Elegant Escape",
    default: "The Elegant Escape",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="lg:text-[62.5%] md:text-[56.25%] text-[50%]" lang="en">
      <body
        className={`${inter.className} ${poppins.className} ${sono.className} `}
      >
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
