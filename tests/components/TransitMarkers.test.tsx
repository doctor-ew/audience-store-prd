import { render, screen } from "@testing-library/react";
import TransitMarkers from "@/components/TransitMarkers";
import { useMartaData } from "@/hooks/useMartaData";

jest.mock("@/hooks/useMartaData");

const useMartaDataMock = useMartaData as jest.Mock;

describe("TransitMarkers", () => {
  it("should render the loading state", () => {
    useMartaDataMock.mockReturnValue({
      vehicles: undefined,
      isLoading: true,
      isError: false,
    });
    render(<TransitMarkers map={null} />);
    expect(screen.getByText("Loading transit data...")).toBeInTheDocument();
  });

  it("should render the error state", () => {
    useMartaDataMock.mockReturnValue({
      vehicles: undefined,
      isLoading: false,
      isError: true,
    });
    render(<TransitMarkers map={null} />);
    expect(screen.getByText("No transit data available.")).toBeInTheDocument();
  });

  it("should render the empty state", () => {
    useMartaDataMock.mockReturnValue({
      vehicles: [],
      isLoading: false,
      isError: false,
    });
    render(<TransitMarkers map={null} />);
    expect(screen.getByText("No transit data available.")).toBeInTheDocument();
  });

  it("should not render anything when data is available", () => {
    useMartaDataMock.mockReturnValue({
      vehicles: [{ id: "1", type: "bus", latitude: 0, longitude: 0, route: "1" }],
      isLoading: false,
      isError: false,
    });
    const { container } = render(<TransitMarkers map={null} />);
    expect(container.firstChild).toBeNull();
  });
});
