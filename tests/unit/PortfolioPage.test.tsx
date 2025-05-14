import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PortfolioPage from "../../app/portfolios/[id]/page";
import React from "react";
import { vi } from "vitest";
// Change the mock for useAuth to include a user object
vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user1" } }), // Ensure user is defined
}));

// Update the fetch mock to handle the response correctly
global.fetch = vi.fn((url) => {
  if (url.includes("positions")) {
    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      json: async () => [
        {
          id: "1",
          portfolio_id: "portfolio123",
          cryptocurrency_id: "BTC",
          total_amount: 2,
          average_buy_price: 100,
          transactions: [
            { price: 100, amount: 1 },
            { price: 100, amount: 1 },
          ],
        },
      ],
    });
  }
  return Promise.reject(new Error("Fetch failed")); // Handle other URLs
});

// Ensure the AddCoinModal mock is correctly set up
vi.mock("../../components/portfolio/AddCoinModal", () => ({
  __esModule: true,
  default: (props: {
    onAdd: (data: { ticker: string; price: number; amount: number }) => void;
    onClose: () => void;
  }) => (
    <div data-testid="add-coin-modal">
      <button
        onClick={() => props.onAdd({ ticker: "ETH", price: 200, amount: 1 })} // Change to ETH for testing
      >
        Add Coin
      </button>
      <button onClick={props.onClose}>Close</button>
    </div>
  ),
}));

describe("PortfolioPage", () => {
  const params = { id: "portfolio123" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders portfolio header and summary cards", async () => {
    // Mock fetch response for positions
    //@ts-expect-error "Mocking fetch response for testing"
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<PortfolioPage params={params} />);
    expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
    expect(screen.getByText(/Portfolio description/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Positions/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Invested/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Value/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/No coins added yet/i)).toBeInTheDocument();
    });
  });

  it("fetches and displays coins", async () => {
    const mockData = [
      {
        id: "1",
        cryptocurrency_id: "BTC",
        total_amount: 2,
        average_buy_price: 100,
        transactions: [
          { price: 100, amount: 1 },
          { price: 100, amount: 1 },
        ],
      },
    ];
    //@ts-expect-error "Mocking fetch response for testing"
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<PortfolioPage params={params} />);
    await waitFor(() => {
      expect(screen.getByText("BTC")).toBeInTheDocument();
      expect(screen.getByText("2 BTC")).toBeInTheDocument();
      expect(screen.getByText("$100.00 USDT")).toBeInTheDocument();
    });
  });

  it("opens and closes the Add Coin dialog", async () => {
    //@ts-expect-error "Mocking fetch response for testing"
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<PortfolioPage params={params} />);
    const editButton = screen.getByRole("button", { name: /Add transaction/i });
    fireEvent.click(editButton);

    expect(await screen.findByTestId("add-coin-modal")).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByTestId("add-coin-modal")).not.toBeInTheDocument();
    });
  });

  it("handles adding a coin", async () => {
    //@ts-expect-error "Mocking fetch response for testing"
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // Initial fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "2",
            cryptocurrency_id: "ETH",
            total_amount: 1,
            average_buy_price: 200,
            transactions: [{ price: 200, amount: 1 }],
          },
        ],
      }); // Add coin

    render(<PortfolioPage params={params} />);
    fireEvent.click(screen.getByRole("button", { name: /Add transaction/i }));

    // Simulate clicking "Add Coin" in the modal
    fireEvent.click(screen.getByText("Add Coin"));

    await waitFor(() => {
      expect(screen.getByText("ETH")).toBeInTheDocument();
      expect(screen.getByText("1 ETH")).toBeInTheDocument();
      expect(screen.getByText("$200.00 USDT")).toBeInTheDocument();
    });
  });

  it("shows error when fetch fails", async () => {
    //@ts-expect-error "Mocking fetch response for testing"
    fetch.mockResolvedValueOnce({ ok: false });

    // Spy on console.error to suppress error output in test
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<PortfolioPage params={params} />);
    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        "Error fetching portfolios:",
        expect.any(Error)
      );
    });

    errorSpy.mockRestore();
  });
});
