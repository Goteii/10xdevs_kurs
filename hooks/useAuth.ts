import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth", {
        method: "GET",
      });

      if (response.ok) {
        const user = await response.json();
        setState({ user, isLoading: false, error: null });
      } else {
        setState({ user: null, isLoading: false, error: null });
      }
    } catch {
      setState({
        user: null,
        isLoading: false,
        error: "Failed to check authentication",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to sign in");
      }

      const { user } = await response.json();
      setState({ user, isLoading: false, error: null });
      return user;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to sign in",
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch("/api/auth", {
        method: "DELETE",
      });

      if (response.redirected) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setState({ user: null, isLoading: false, error: null });
    }
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    signIn,
    signOut,
  };
}
