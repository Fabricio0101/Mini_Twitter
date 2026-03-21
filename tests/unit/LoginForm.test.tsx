import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginForm } from "@/components/auth/LoginForm";

// Mock useLogin hook
const mockMutate = vi.fn();
vi.mock("@/lib/hooks/useAuth", () => ({
  useLogin: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password fields", () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("Insira o seu e-mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Insira a sua senha")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<LoginForm />);

    expect(screen.getByRole("button", { name: "Continuar" })).toBeInTheDocument();
  });

  it("renders the greeting text", () => {
    render(<LoginForm />);

    expect(screen.getByText("Olá, de novo!")).toBeInTheDocument();
    expect(
      screen.getByText("Por favor, insira os seus dados para fazer login.")
    ).toBeInTheDocument();
  });

  it("renders labels for email and password", () => {
    render(<LoginForm />);

    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("Senha")).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText("Insira a sua senha");
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find the eye toggle button (not the submit button)
    const toggleButtons = screen.getAllByRole("button");
    const eyeButton = toggleButtons.find(
      (btn) => !btn.textContent?.includes("Continuar")
    );

    if (eyeButton) {
      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      // Toggle back
      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    }
  });

  it("does not call login mutation when fields are empty", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Continuar" }));

    // Should not call mutate with empty fields
    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it("calls login mutation with valid data", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText("Insira o seu e-mail"),
      "test@test.com"
    );
    await user.type(
      screen.getByPlaceholderText("Insira a sua senha"),
      "password123"
    );
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: "test@test.com", password: "password123" },
        expect.any(Object)
      );
    });
  });

  it("renders the terms of service text", () => {
    render(<LoginForm />);

    expect(
      screen.getByText(/Termos de Serviço e Política de Privacidade/i)
    ).toBeInTheDocument();
  });
});
