"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";

interface Portfolio {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export default function HomePage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPortfolios();
    }
  }, [user]);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("/api/portfolios");
      if (!response.ok) {
        throw new Error("Failed to fetch portfolios");
      }
      const data = await response.json();
      setPortfolios(data);
    } catch (error) {
      setError("Failed to load portfolios");
      console.error("Error fetching portfolios:", error);
    }
  };

  const createPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolioName.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newPortfolioName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create portfolio");
      }

      const newPortfolio = await response.json();
      setPortfolios((prev) => [newPortfolio, ...prev]);
      setNewPortfolioName("");
    } catch (error) {
      setError("Failed to create portfolio");
      console.error("Error creating portfolio:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Crypto Portfolio
                </h1>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">{user?.email}</span>
                <button
                  onClick={signOut}
                  className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold mb-8">My Portfolios</h1>

            <form onSubmit={createPortfolio} className="mb-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  placeholder="Enter portfolio name"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isCreating || !newPortfolioName.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Creating..." : "Create Portfolio"}
                </button>
              </div>
            </form>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {portfolio.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Created:{" "}
                    {new Date(portfolio.created_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => router.push(`/portfolios/${portfolio.id}`)}
                    className="cursor-pointer mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {portfolios.length === 0 && !error && (
              <div className="text-center text-gray-500 mt-8">
                No portfolios yet. Create your first one!
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
