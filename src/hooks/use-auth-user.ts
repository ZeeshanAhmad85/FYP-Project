import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from "aws-amplify/auth";
import { useEffect, useState } from "react";

export default function useAuthUser(trigger?: number | string) {
  const [user, setUser] = useState<Record<string, any>>();

  useEffect(() => {
    async function getUser() {
      const session = await fetchAuthSession();
      if (!session.tokens) {
        console.log("NO Session");
        return;
      }

      const user = {
        ...(await getCurrentUser()),
        ...(await fetchUserAttributes()),
        isAdmin: false,
      };

      const groups = session.tokens.accessToken.payload["cognito:groups"] as
        | string[]
        | undefined;
      user.isAdmin = Boolean(groups?.includes("Admins"));

      console.log("Updated user info:", user);
      setUser({ ...user }); // force new ref
    }

    getUser();
  }, [trigger]); // re-run on any trigger

  return user;
}
