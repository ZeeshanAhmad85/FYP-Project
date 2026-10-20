import type { Metadata } from "next";
import { cn, constructMetadata } from "@/lib/utils";
// import { OnboardProvider } from "@/context/onboard-context";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SignupProvider } from "@/context/signup-context";
import { ProgressBar, ProgressBarProvider } from "react-transition-progress";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ResetProvider } from "@/context/reset-context";
import { TabsProvider } from "@/context/tab-context";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

//   FOR AWS AMPLIFY
Amplify.configure(outputs);
export const metadata = constructMetadata();

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen  antialiased", plusJakartaSans.className)}
      >
        <ProgressBarProvider>
          {/* I.e. using Tailwind CSS to show the progress bar with custom styling */}
          <ProgressBar className="fixed h-1 shadow-lg shadow-primary/20 bg-primary top-0 z-[10000]" />
          <SignupProvider>
            <ResetProvider>
              <TabsProvider>{children}</TabsProvider>
              <Toaster richColors />
            </ResetProvider>
          </SignupProvider>
        </ProgressBarProvider>
      </body>
    </html>
  );
}
