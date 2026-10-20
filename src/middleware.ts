import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./utils/amplify-server-utils";
import { TrophyIcon } from "lucide-react";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const user: any = await authenticatedUser({ request, response });

  console.log("User: ", user);

  // Define allowed dashboard and onboarding paths
  const allowedDashboardPaths = [
    "/overview",
    "/my-resume",
    "/my-links",
    "/my-plans",
    "/my-feedbacks",
    "/settings",
  ];
  const allowedOnboardingPaths = [
    "/onboarding",
    "/onboarding/basic-details",
    "/onboarding/upload-resume",
    "/onboarding/create-link",
  ]; // Supports subroutes

  // Check if user is logged in
  if (!user) {
    // Redirect to login if not logged in and accessing dashboard or onboarding pages
    if (
      allowedDashboardPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      ) ||
      allowedOnboardingPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      )
    ) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    return response; // Allow access to other pages if not logged in
  } else {
    // Check if the user has completed onboarding
    const isOnboarded = user?.["custom:onboarded"] === "true";

    // Redirect logged-in users from auth pages to overview
    const isAuthPage = [
      "/login",
      "/sign-up",
      "/confirm-signup",
      "/social-signin",
      "/forget-password",
      "/reset-password",
    ].includes(request.nextUrl.pathname);

    if (isAuthPage) {
      return NextResponse.redirect(new URL("/overview", request.url));
    }

    interface Provider {
      dateCreated: string;
      userId: string;
      providerName: string;
      providerType: string;
      issuer: string | null;
      primary: string;
    }

    try {
      const parsedData: Provider[] = JSON.parse(user.identities);
      const hasGoogleProvider = parsedData.some(
        (item) => item.providerType === "Google"
      );
      //const hasFacebookProvider = parsedData.some(item => item.providerType === 'Facebook');

      if (hasGoogleProvider) {
        return response;
      }
    } catch (err) {
      console.log(err, "ERROR");
    }

    // If user has not completed onboarding, redirect to onboarding
    if (!isOnboarded) {
      const isOnboardingPage = allowedOnboardingPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      );
      if (!isOnboardingPage) {
        return NextResponse.redirect(
          new URL("/onboarding/basic-details", request.nextUrl)
        );
      }
    } else {
      // If user has completed onboarding, prevent access to onboarding pages
      const isOnboardingPage = allowedOnboardingPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      );
      if (isOnboardingPage) {
        return NextResponse.redirect(new URL("/overview", request.nextUrl));
      }
    }

    // Allow access to authorized pages (dashboard, onboarding, and others)
    return response;
  }
}

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: [
    "/overview",
    "/my-resume",
    "/my-links",
    "/my-plans",
    "/my-feedbacks",
    "/settings",
    "/onboarding",
    "/onboarding/basic-details",
    "/onboarding/upload-resume",
    "/onboarding/create-link",
    "/login",
    "/sign-up",
    "/confirm-signup",
    "/social-signin",
    "/forget-password",
    "/reset-password",
  ],
};
