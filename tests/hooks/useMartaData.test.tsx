import { renderHook, waitFor } from "@testing-library/react";
import { useMartaData } from "@/hooks/useMartaData";
import { SWRConfig } from "swr";

const mockVehicles = [
  {
    id: "1",
    type: "bus",
    latitude: 33.75,
    longitude: -84.4,
    route: "123",
  },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

const fetchMock = fetch as jest.Mock;

describe("useMartaData", () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  it("should return loading state initially", () => {
    fetchMock.mockReturnValue(new Promise(() => {})); // Never resolves
    const { result } = renderHook(() => useMartaData(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.vehicles).toBeUndefined();
  });

  it("should return vehicle data after a successful fetch", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ vehicles: mockVehicles }))
    );
    const { result } = renderHook(() => useMartaData(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(false);
    expect(result.current.vehicles).toEqual(mockVehicles);
  });

  it("should return an error state on fetch failure", async () => {
    const error = new Error("Failed to fetch");
    fetchMock.mockRejectedValue(error);
    const { result } = renderHook(() => useMartaData(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(true);
    // The error object will not be strictly equal, so we check the message
    expect(result.current.error?.message).toEqual(error.message);
    expect(result.current.vehicles).toBeUndefined();
  });

  // TODO: Add a test for the refetch functionality.
  // This is currently not possible due to limitations with SWR's timer management in Jest.
});
