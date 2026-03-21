"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useSearchPosts } from "@/lib/hooks/useSearchPosts";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface SearchCommandProps {
  trigger?: React.ReactNode;
}

export function SearchCommand({ trigger }: SearchCommandProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading } = useSearchPosts(debouncedQuery);

  const posts = data?.posts ?? [];

  const handleSelect = (postTitle: string) => {
    router.replace(`/?q=${encodeURIComponent(postTitle)}`);
    setQuery("");
    setOpen(false);
  };

  const handleSearchAll = () => {
    if (query.trim()) {
      router.replace(`/?q=${encodeURIComponent(query.trim())}`);
    }
    setQuery("");
    setOpen(false);
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="size-9"
          aria-label="Buscar"
          onClick={() => setOpen(true)}
        >
          <Search className="size-5 text-foreground" />
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setQuery("");
        }}
        title="Buscar posts"
        description="Digite para buscar por posts..."
      >
        <CommandInput
          placeholder="Buscar por post..."
          value={query}
          onValueChange={setQuery}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              handleSearchAll();
            }
          }}
        />
        <CommandList>
          {isLoading && debouncedQuery.length >= 2 ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : debouncedQuery.length < 2 ? (
            <CommandEmpty>
              Digite ao menos 2 caracteres para buscar...
            </CommandEmpty>
          ) : posts.length === 0 ? (
            <CommandEmpty>
              Nenhum post encontrado para &quot;{debouncedQuery}&quot;
            </CommandEmpty>
          )	: (
            <CommandGroup heading="Posts encontrados">
              {posts.map((post) => (
                <CommandItem
                  key={post.id}
                  value={`${post.title} ${post.authorName}`}
                  onSelect={() => handleSelect(post.title)}
                  className="flex items-start gap-3 py-2.5 cursor-pointer"
                >
                  <FileText className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-foreground truncate">
                      {post.title}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      por {post.authorName}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
