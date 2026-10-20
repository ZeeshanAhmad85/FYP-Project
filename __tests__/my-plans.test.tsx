import { render, screen, fireEvent } from "@testing-library/react";
import Page from "@/app/(dashboard)/my-plans/page";

describe("Page Component", () => {
  test("renders without crashing", () => {
    render(<Page />);
    expect(screen.getByText("Simple, transparent pricing")).toBeInTheDocument();
    expect(
      screen.getByText("Upgrade your plan to access more PRO features")
    ).toBeInTheDocument();
  });

  test("renders all plan cards", () => {
    render(<Page />);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Standard")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });
});
