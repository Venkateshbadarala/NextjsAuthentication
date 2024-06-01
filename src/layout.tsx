import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PrimaryNavigation from "@/components/navigation/PrimaryNavigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import SessionProvider from "@/context/Authcontext";
import QueryContext from "@/context/queryContext";
import LoginView from "@/app/(auth)/login/page"

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


          {/* Header */}
          <div className="bg-slate-500 flex items-center justify-end p-1">
            <LoginView/>
          </div>
          {/* Body */}
          <div className="">{children}</div>
          </QueryContext>
        </SessionProvider>
      </body>
    </html>
  );
}
