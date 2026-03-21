import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LikeButton } from "@/components/posts/LikeButton";

// Mock useLike
const mockMutate = vi.fn();
vi.mock("@/lib/hooks/useLike", () => ({
  useLike: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

// Mock authStore — logged in by default
vi.mock("@/lib/store/authStore", () => ({
  useAuthStore: vi.fn((selector) =>
    selector({ user: { id: 1, name: "Test", email: "test@test.com" }, token: "fake-token" })
  ),
}));

// Mock likedPostsStore — not liked by default
let mockLikedState = false;
vi.mock("@/lib/store/likedPostsStore", () => ({
  useLikedPostsStore: vi.fn((selector) =>
    selector({
      isLiked: () => mockLikedState,
      toggleLike: vi.fn(),
      addLike: vi.fn(),
      removeLike: vi.fn(),
    })
  ),
}));

describe("LikeButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLikedState = false;
  });

  it("renders the likes count", () => {
    render(<LikeButton postId={1} likesCount={10} />);

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders a heart icon button", () => {
    render(<LikeButton postId={1} likesCount={3} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("calls mutate on click when authenticated", async () => {
    const user = userEvent.setup();
    render(<LikeButton postId={1} likesCount={3} />);

    await user.click(screen.getByRole("button"));

    expect(mockMutate).toHaveBeenCalled();
  });

  it("is disabled when not authenticated", async () => {
    const { useAuthStore } = await import("@/lib/store/authStore");
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector({ user: null, token: null } as any)
    );

    render(<LikeButton postId={1} likesCount={3} />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("shows filled heart when post is liked", () => {
    mockLikedState = true;

    render(<LikeButton postId={1} likesCount={5} />);

    const button = screen.getByRole("button");
    const svg = button.querySelector("svg");
    expect(svg?.classList.toString()).toContain("fill-red-500");
  });

  it("renders with zero likes", () => {
    render(<LikeButton postId={1} likesCount={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
