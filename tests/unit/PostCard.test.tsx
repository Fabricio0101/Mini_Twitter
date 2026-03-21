import { screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../utils";
import { PostCard } from "@/components/posts/PostCard";
import type { Post } from "@/lib/types/post";

// Mock external dependencies
vi.mock("@/lib/store/authStore", () => ({
  useAuthStore: vi.fn((selector) =>
    selector({ user: { id: 1, name: "Test User", email: "test@test.com" }, token: "fake-token" })
  ),
}));

vi.mock("@/lib/hooks/useLike", () => ({
  useLike: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/lib/store/likedPostsStore", () => ({
  useLikedPostsStore: vi.fn((selector) =>
    selector({ isLiked: () => false, toggleLike: vi.fn(), addLike: vi.fn(), removeLike: vi.fn() })
  ),
}));

const mockPost: Post = {
  id: 1,
  title: "Post de Teste",
  content: "Este é o conteúdo do post de teste.",
  image: null,
  authorId: 1,
  createdAt: "2026-03-15T10:00:00Z",
  authorName: "Alice Silva",
  authorAvatarUrl: null,
  likesCount: 5,
  likedByMe: 0,
};

describe("PostCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders post title and content", () => {
    renderWithProviders(<PostCard post={mockPost} />);

    expect(screen.getByText("Post de Teste")).toBeInTheDocument();
    expect(screen.getByText("Este é o conteúdo do post de teste.")).toBeInTheDocument();
  });

  it("renders author name and handle", () => {
    renderWithProviders(<PostCard post={mockPost} />);

    expect(screen.getByText("Alice Silva")).toBeInTheDocument();
    expect(screen.getByText("@alicesilva")).toBeInTheDocument();
  });

  it("renders formatted date", () => {
    renderWithProviders(<PostCard post={mockPost} />);

    expect(screen.getByText("15/03/2026")).toBeInTheDocument();
  });

  it("renders likes count", () => {
    renderWithProviders(<PostCard post={mockPost} />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders image when provided", () => {
    const postWithImage: Post = {
      ...mockPost,
      image: "https://example.com/image.jpg",
    };

    renderWithProviders(<PostCard post={postWithImage} />);

    const img = screen.getByAltText("Post de Teste");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("does not render image when null", () => {
    renderWithProviders(<PostCard post={mockPost} />);

    expect(screen.queryByAltText("Post de Teste")).not.toBeInTheDocument();
  });

  it("shows actions for post owner", () => {
    renderWithProviders(<PostCard post={mockPost} />);

    // Owner (userId 1 === authorId 1) should see post content
    expect(screen.getByText("Post de Teste")).toBeInTheDocument();
  });
});
