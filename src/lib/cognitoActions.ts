import { getErrorMessage } from "@/utils/get-error-message";

import {
  fetchAuthSession,
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resendSignUpCode,
  updateUserAttribute,
  type UpdateUserAttributeOutput,
  confirmUserAttribute,
  updatePassword,
  resetPassword,
  confirmResetPassword,
} from "aws-amplify/auth";
import { Amplify } from "aws-amplify";

import outputs from "../../amplify_outputs.json";
import { deleteUser } from "aws-amplify/auth";
import { handleError } from "./utils";

Amplify.configure(outputs, {
  ssr: true, // required when using Amplify with Next.js
});

/*Amplify.configure(
  {
    Auth: authConfig,
  },
  //  For Next JS, we need to set ssr to true
  { ssr: true }
);*/

export async function handleDeleteUser() {
  try {
    await deleteUser();
  } catch (error) {
    handleError(error);
  }
}

export async function handleSignUp(
  prevState: string | undefined,
  userDetails: any
) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: userDetails?.email,
      password: userDetails?.password,
      options: {
        userAttributes: {
          email: userDetails?.email,
          "custom:subscription": "FREE",
          "custom:onboarded": "false",
          "custom:credits": "15",
        },
      },
    });
  } catch (error) {
    console.error("Error during sign-up:", error);

    handleError(error);
  }
}

export async function handleSendEmailVerificationCode(
  prevState: { message: string; errorMessage: string },
  formData: { email: string }
) {
  let currentState;
  try {
    await resendSignUpCode({
      username: String(formData.email),
    });
    currentState = {
      ...prevState,
      message: "Code sent successfully",
    };
  } catch (error) {
    currentState = {
      ...prevState,
      errorMessage: getErrorMessage(error),
    };
  }

  return currentState;
}

export async function handleConfirmSignUp(
  prevState: string | undefined,
  formData: { email: string; code: string }
) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: formData.email,
      confirmationCode: formData.code,
    });
  } catch (error) {
    handleError(error);
  }
}

export async function handleSignIn(
  prevState: string | undefined,
  formData: { email: string; password: string }
) {
  try {
    let redirectLink = "/overview";
    const { isSignedIn, nextStep } = await signIn({
      username: String(formData.email),
      password: String(formData.password),
    });
    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: String(formData.email),
      });
      redirectLink = `/confirm-signup?email=${formData.email}`;
    }
    return redirectLink;
  } catch (error) {
    handleError(error);
  }
}

export async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    handleError(error);
  }
}

export async function handleUpdateUserAttribute(
  prevState: string,
  formData: FormData
) {
  let attributeKey = "name";
  let attributeValue;
  let currentAttributeValue;

  if (formData.get("email")) {
    attributeKey = "email";
    attributeValue = formData.get("email");
    currentAttributeValue = formData.get("current_email");
  } else {
    attributeValue = formData.get("name");
    currentAttributeValue = formData.get("current_name");
  }

  if (attributeValue === currentAttributeValue) {
    return "";
  }

  try {
    const output = await updateUserAttribute({
      userAttribute: {
        attributeKey: String(attributeKey),
        value: String(attributeValue),
      },
    });
    return handleUpdateUserAttributeNextSteps(output);
  } catch (error) {
    return "error";
  }
}

function handleUpdateUserAttributeNextSteps(output: UpdateUserAttributeOutput) {
  const { nextStep } = output;

  switch (nextStep.updateAttributeStep) {
    case "CONFIRM_ATTRIBUTE_WITH_CODE":
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      return `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`;
    case "DONE":
      return "success";
  }
}

export async function handleUpdateOnboarding() {
  try {
    await updateUserAttribute({
      userAttribute: {
        attributeKey: "custom:onboarded",
        value: "true",
      },
    });
  } catch (error) {
    handleError(error);
  }

  return "success";
}
export async function handleUpdateCredits(credits: number) {
  try {
    await updateUserAttribute({
      userAttribute: {
        attributeKey: "custom:credits",
        value: String(credits),
      },
    });
  } catch (error) {
    handleError(error);
    return null;
  }
}
//   FUNCTION HANDLE UPDATE
export async function handleUpdateProfile(
  prevState: "success" | "error" | undefined,
  formData: {
    fullName: string;
    profilePic: any;
  }
) {
  const name = formData?.fullName;
  const profilePic = formData?.profilePic;

  if (!name && !profilePic) {
    return;
  }

  try {
    if (name) {
      await updateUserAttribute({
        userAttribute: {
          attributeKey: "given_name",
          value: String(name),
        },
      });
    }

    if (profilePic) {
      await updateUserAttribute({
        userAttribute: {
          attributeKey: "picture",
          value: String(profilePic),
        },
      });
    }
  } catch (error) {
    handleError(error);
  }

  return "success";
}

export async function handleUpdatePassword(
  prevState: "success" | "error" | undefined,
  formData: {
    currentPassword: string;
    newPassword: string;
  }
) {
  const currentPassword = formData?.currentPassword;
  const newPassword = formData?.newPassword;

  if (currentPassword === newPassword) {
    return;
  }

  try {
    await updatePassword({
      oldPassword: String(currentPassword),
      newPassword: String(newPassword),
    });
  } catch (error) {
    handleError(error);
  }

  return "success";
}

export async function handleConfirmUserAttribute(
  prevState: "success" | "error" | undefined,
  formData: FormData
) {
  const code = formData.get("code");

  if (!code) {
    return;
  }

  try {
    await confirmUserAttribute({
      userAttributeKey: "email",
      confirmationCode: String(code),
    });
  } catch (error) {
    return "error";
  }

  return "success";
}

export async function handleResetPassword(
  prevState: string | undefined,
  email: string
) {
  try {
    await resetPassword({ username: String(email) });
  } catch (error) {
    handleError(error);
  }
}

export async function handleConfirmResetPassword(
  prevState: string | undefined,
  formData: {
    email: string;
    code: string;
    password: string;
  }
) {
  try {
    await confirmResetPassword({
      username: String(formData.email),
      confirmationCode: String(formData.code),
      newPassword: String(formData.password),
    });
  } catch (error) {
    handleError(error);
  }
}
