/* eslint-disable react/display-name */
import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "@/app/(dashboard)/settings/page";
import { useTabs } from "@/context/tab-context";

jest.mock("@/context/tab-context");
jest.mock("@/components/dashboard/settings/profile-settings", () => () => (
  <div>Profile Settings</div>
));
jest.mock("@/components/dashboard/settings/manage-password", () => () => (
  <div>Manage Password</div>
));
jest.mock("@/components/dashboard/settings/delete-account", () => () => (
  <div>Delete Account</div>
));
jest.mock("@/components/dashboard/settings/vertical-tabs", () => () => (
  <div>Vertical Tabs</div>
));

describe("Page Component", () => {
  const mockUseTabs = useTabs as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    mockUseTabs.mockReturnValue({ activeTab: 1 });
    render(<Page />);
    expect(screen.getByText("Account Settings")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your account settings")
    ).toBeInTheDocument();
    expect(screen.getByText("Vertical Tabs")).toBeInTheDocument();
  });

  it("renders ProfileSettings when activeTab is 1", () => {
    mockUseTabs.mockReturnValue({ activeTab: 1 });
    render(<Page />);
    expect(screen.getByText("Profile Settings")).toBeInTheDocument();
  });

  it("renders ManagePassword when activeTab is 2", () => {
    mockUseTabs.mockReturnValue({ activeTab: 2 });
    render(<Page />);
    expect(screen.getByText("Manage Password")).toBeInTheDocument();
  });

  it("renders DeleteAccount when activeTab is 3", () => {
    mockUseTabs.mockReturnValue({ activeTab: 3 });
    render(<Page />);
    expect(screen.getByText("Delete Account")).toBeInTheDocument();
  });
});
