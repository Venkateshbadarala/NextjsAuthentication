import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import SessionProvider from "@/context/Authcontext";
import QueryContext from "@/context/queryContext";
import PrimaryNavigation from "@/components/navigation/PrimaryNavigation";
import LoginPage from "./(auth)/login/page";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Retrieve the session
  const session = await getServerSession(authOptions);
 console.log("session",session);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
         <QueryContext>
           {/* header */}
        
            {/* Body */}
          <div className="">{children}</div>
          </QueryContext>
        </SessionProvider>
      </body>
    </html>
  );
}
