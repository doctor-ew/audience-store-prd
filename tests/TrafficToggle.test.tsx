import { render, screen, fireEvent } from "@testing-library/react";
import TrafficToggle from "@/components/TrafficToggle";

jest.mock("lucide-react", () => ({
  Traffic: () => <div data-testid="traffic-icon" />,
}));

describe("TrafficToggle", () => {
  it("renders the button with the correct initial state", () => {
    render(<TrafficToggle isTrafficVisible={false} onToggle={() => {}} />);
    const button = screen.getByRole("button", {
      name: /toggle traffic layer visibility/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("calls the onToggle callback when clicked", () => {
    const onToggle = jest.fn();
    render(<TrafficToggle isTrafficVisible={false} onToggle={onToggle} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("updates the aria-pressed attribute when the state changes", () => {
    const { rerender } = render(
      <TrafficToggle isTrafficVisible={false} onToggle={() => {}} />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");

    rerender(<TrafficToggle isTrafficVisible={true} onToggle={() => {}} />);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("is keyboard accessible", () => {
    const onToggle = jest.fn();
    render(<TrafficToggle isTrafficVisible={false} onToggle={onToggle} />);
    const button = screen.getByRole("button");
    button.focus();

    // fireEvent.click simulates a user clicking the element, which is
    // what happens when a user presses Enter or Space on a focused button.
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);

    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(2);
  });
});
