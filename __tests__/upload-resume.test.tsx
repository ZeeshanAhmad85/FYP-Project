import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UploadResume from "@/components/onboard/upload-resume";
import { toast } from "sonner";
import { uploadData } from "aws-amplify/storage";
import { createResume } from "@/data/data";
import { useRouter } from "next/navigation";

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("aws-amplify/storage", () => ({
  uploadData: jest.fn(),
}));

jest.mock("@/data/data", () => ({
  createResume: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("UploadResume Component", () => {
  const mockRouterPush = jest.fn();
  const mockUser = { userId: "123" };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component", () => {
    render(<UploadResume user={mockUser} />);
    expect(screen.getByText("Upload Your Resume")).toBeInTheDocument();
  });

  it("handles resume title input change", () => {
    render(<UploadResume user={mockUser} />);
    const input = screen.getByPlaceholderText("Enter Resume Title");
    fireEvent.change(input, { target: { value: "My Resume" } });
    expect(input).toHaveValue("My Resume");
  });

  it("shows error for missing resume title", async () => {
    render(<UploadResume user={mockUser} />);
    const button = screen.getByText("Save & Create Link");
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText("Resume title is required.")).toBeInTheDocument();
    });
  });
});
