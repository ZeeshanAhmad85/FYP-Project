import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePublicLink from "@/components/onboard/create-link";
import { createLink, generateUniqueLink } from "@/data/data";
import { toast } from "sonner";
import useAuthUser from "@/hooks/use-auth-user";
import { useRouter } from "next/navigation";

jest.mock("@/data/data");
jest.mock("sonner");
jest.mock("@/hooks/use-auth-user");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CreatePublicLink", () => {
  const mockResume = { id: "1", title: "Test Resume", userId: "123" };
  const mockUser = { "custom:subscription": "PRO", given_name: "Test User" };
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    (useAuthUser as jest.Mock).mockReturnValue(mockUser);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(<CreatePublicLink resume={mockResume} />);
    expect(screen.getByText("Create a Public Link")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("MRS Technologies Internship 2024")
    ).toBeInTheDocument();
  });

  it("validates form inputs", async () => {
    render(<CreatePublicLink resume={mockResume} />);
    fireEvent.click(screen.getByText("Publish the Link"));
    expect(screen.getByText("Link Title is required.")).toBeInTheDocument();
  });

  it("handles state changes", async () => {
    render(<CreatePublicLink resume={mockResume} />);
    fireEvent.change(
      screen.getByPlaceholderText("MRS Technologies Internship 2024"),
      {
        target: { value: "New Link Title" },
      }
    );
    expect(screen.getByDisplayValue("New Link Title")).toBeInTheDocument();
  });

  it("generates a unique link on mount", async () => {
    (generateUniqueLink as jest.Mock).mockResolvedValue("unique-link");
    render(<CreatePublicLink resume={mockResume} />);
    await waitFor(() =>
      expect(screen.getByDisplayValue(/unique-link/)).toBeInTheDocument()
    );
  });

  it("handles regenerate link", async () => {
    (generateUniqueLink as jest.Mock).mockResolvedValue("new-unique-link");
    render(<CreatePublicLink resume={mockResume} />);
    fireEvent.click(screen.getByText("Regenerate"));
    await waitFor(() =>
      expect(screen.getByDisplayValue(/new-unique-link/)).toBeInTheDocument()
    );
  });
});
