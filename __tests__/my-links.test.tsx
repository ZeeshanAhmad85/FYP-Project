import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "@/app/(dashboard)/my-links/page";
import { useRouter } from "next/navigation";
import useAuthUser from "@/hooks/use-auth-user";
import {
  fetchActiveLinksCount,
  fetchAverageViewTime,
  fetchLinkCount,
  fetchLinksByUserId,
} from "@/data/data";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the useAuthUser hook
jest.mock("@/hooks/use-auth-user", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the data fetching functions
jest.mock("@/data/data", () => ({
  fetchActiveLinksCount: jest.fn(),
  fetchAverageViewTime: jest.fn(),
  fetchLinkCount: jest.fn(),
  fetchLinksByUserId: jest.fn(),
}));

describe("Page Component", () => {
  beforeEach(() => {
    // Mock implementation of useRouter
    (useRouter as jest.Mock).mockReturnValue({
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    });

    // Mock implementation of useAuthUser
    (useAuthUser as jest.Mock).mockReturnValue({
      userId: "test-user-id",
      "custom:subscription": "FREE",
    });

    // Mock implementation of data fetching functions
    (fetchActiveLinksCount as jest.Mock).mockResolvedValue(5);
    (fetchAverageViewTime as jest.Mock).mockResolvedValue(3000);
    (fetchLinkCount as jest.Mock).mockResolvedValue(10);
    (fetchLinksByUserId as jest.Mock).mockResolvedValue([
      {
        id: "1",
        title: "Test Link 1",
        active: true,
        resume: { title: "Test Resume 1" },
        updatedAt: new Date(),
      },
    ]);
  });

  test("renders without crashing", () => {
    render(<Page />);
    const elements = screen.getAllByText("My Links");
    expect(elements.length).toBeGreaterThan(0);
  });

  test("renders header and static elements", () => {
    render(<Page />);
    const elements = screen.getAllByText("My Links");
    expect(elements.length).toBeGreaterThan(0);
    expect(
      screen.getByText("See how different links are performing.")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search a link by title")
    ).toBeInTheDocument();
  });

  test("search functionality works", () => {
    render(<Page />);
    const searchInput = screen.getByPlaceholderText("Search a link by title");
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(searchInput).toHaveValue("test");
  });
});
