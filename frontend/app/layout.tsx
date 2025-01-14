import "./globals.css";
import { Poppins } from "next/font/google";
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
  description:
    "Create and manage raffles, spin-the-wheel, and giveaways with our platform. Upload thousands of participants via CSV, track results in an analytics dashboard, and send bulk emails—all under flexible pricing tiers.",
};

const poppins = Poppins({
  subsets: ["latin"], // Add other subsets if needed
  weight: ["400", "500", "600", "700"], // Specify the font weights you need
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="lg:text-[58%] md:text-[56.25%] text-[50%]" lang="en">
      <body className={`${poppins.className}`}>
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
