import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileSetup from "@/components/onboard/basic-details";
import { toast } from "sonner";
import { uploadData } from "aws-amplify/storage";
import { handleUpdateProfile } from "@/lib/cognitoActions";
import { useRouter } from "next/navigation";
import useAuthUser from "@/hooks/use-auth-user";

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("aws-amplify/storage", () => ({
  uploadData: jest.fn(),
}));

jest.mock("@/lib/cognitoActions", () => ({
  handleUpdateProfile: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/use-auth-user", () => jest.fn());

describe("ProfileSetup Component", () => {
  const mockRouterPush = jest.fn();
  const mockUser = { userId: "123", "custom:subscription": "basic" };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useAuthUser as jest.Mock).mockReturnValue(mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component", () => {
    render(<ProfileSetup />);
    expect(
      screen.getByText("First, tell us a bit about yourself")
    ).toBeInTheDocument();
  });

  it("handles full name input change", () => {
    render(<ProfileSetup />);
    const input = screen.getByPlaceholderText("Neha Jabeen");
    fireEvent.change(input, { target: { value: "John Doe" } });
    expect(input).toHaveValue("John Doe");
  });

  it("shows error for short full name", async () => {
    render(<ProfileSetup />);
    const button = screen.getByText("Continue");
    fireEvent.click(button);
    await waitFor(() => {
      expect(
        screen.getByText("Full name must be at least 3 characters long")
      ).toBeInTheDocument();
    });
  });

  it("handles form submission", async () => {
    (handleUpdateProfile as jest.Mock).mockResolvedValue(true);

    render(<ProfileSetup />);
    const input = screen.getByPlaceholderText("Neha Jabeen");
    fireEvent.change(input, { target: { value: "John Doe" } });

    const button = screen.getByText("Continue");
    fireEvent.click(button);

    await waitFor(() => {
      expect(handleUpdateProfile).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith("/onboarding/upload-resume");
      expect(toast.success).toHaveBeenCalledWith(
        "Profile updated successfully"
      );
    });
  });
});
