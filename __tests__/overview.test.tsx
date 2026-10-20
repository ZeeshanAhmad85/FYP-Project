/* eslint-disable react/display-name */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "@/app/(dashboard)/overview/page";
import { toast } from "sonner";
import useAuthUser from "@/hooks/use-auth-user";
import {
  fetchAverageViewTime,
  fetchLinkCount,
  fetchLinksByUserId,
  fetchResumeCount,
} from "@/data/data";

jest.mock("sonner");
jest.mock("@/hooks/use-auth-user");
jest.mock("@/data/data");
jest.mock("next/dynamic", () => () => () => <div>Mocked Chart</div>);

describe("Page Component", () => {
  const mockUser = { userId: "123", given_name: "Test User" };

  beforeEach(() => {
    (useAuthUser as jest.Mock).mockReturnValue(mockUser);
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(<Page />);
    expect(screen.getByText("Welcome Back,")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });

  it("fetches stats on mount", async () => {
    (fetchResumeCount as jest.Mock).mockResolvedValue(5);
    (fetchLinkCount as jest.Mock).mockResolvedValue(10);
    (fetchAverageViewTime as jest.Mock).mockResolvedValue(3000);

    render(<Page />);

    await waitFor(() => {
      expect(fetchResumeCount).toHaveBeenCalledWith(mockUser.userId);
      expect(fetchLinkCount).toHaveBeenCalledWith(mockUser.userId);
      expect(fetchAverageViewTime).toHaveBeenCalledWith(mockUser.userId);
    });

    expect(screen.getByText("Total Resumes")).toBeInTheDocument();
    expect(screen.getByText("Total Links")).toBeInTheDocument();
    expect(screen.getByText("Average View Time (sec)")).toBeInTheDocument();
  });

  it("fetches links on mount", async () => {
    const mockLinks = [{ title: "Link 1", url: "/link1", sessions: [] }];
    (fetchLinksByUserId as jest.Mock).mockResolvedValue(mockLinks);

    render(<Page />);

    await waitFor(() => {
      expect(fetchLinksByUserId).toHaveBeenCalledWith(mockUser.userId);
    });

    expect(screen.getByText("Recent Links")).toBeInTheDocument();
  });
});
