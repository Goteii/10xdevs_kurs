import { supabase } from "../db/supabase";
import { DatabaseError, UnauthorizedError } from "../lib/errors";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export class AuthService {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!data.session?.access_token || !data.user?.email) {
      throw new DatabaseError("Failed to get access token");
    }

    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  }

  async signUp(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data.session?.access_token || !data.user?.email) {
      throw new DatabaseError("Failed to get access token");
    }

    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new DatabaseError("Failed to sign out");
    }
  }

  async getCurrentUser(): Promise<{ id: string; email: string } | null> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw new DatabaseError("Failed to get current user");
    }

    if (!user || !user.email) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  async refreshToken(): Promise<string> {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      throw new UnauthorizedError("Failed to refresh token");
    }

    if (!data.session?.access_token) {
      throw new DatabaseError("Failed to get new access token");
    }

    return data.session.access_token;
  }
}
