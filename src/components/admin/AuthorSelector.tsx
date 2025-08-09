"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "lucide-react";

interface Author {
  id: number;
  name: string;
  email?: string;
  bio?: string;
}

interface AuthorSelectorProps {
  selectedAuthorId: number | null;
  onAuthorChange: (authorId: number | null) => void;
}

export default function AuthorSelector({ selectedAuthorId, onAuthorChange }: AuthorSelectorProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/authors");
      if (response.ok) {
        const data = await response.json() as { authors: Author[] };
        setAuthors(data.authors);
        
        // Auto-select first author (company default) if none selected
        if (!selectedAuthorId && data.authors.length > 0) {
          onAuthorChange(data.authors[0].id);
        }
      } else {
        setError("Failed to load authors");
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
      setError("Failed to load authors");
    } finally {
      setLoading(false);
    }
  }, [selectedAuthorId, onAuthorChange]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const selectedAuthor = authors.find(author => author.id === selectedAuthorId);

  if (loading) {
    return (
      <div className="animate-pulse">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author *
        </label>
        <div className="h-10 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author *
        </label>
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
        Author *
      </label>
      
      <div className="relative">
        <select
          id="author"
          value={selectedAuthorId || ""}
          onChange={(e) => onAuthorChange(e.target.value ? parseInt(e.target.value) : null)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none pr-10"
          required
        >
          <option value="">Select an author...</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <User className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      {selectedAuthor && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start space-x-2">
            <User className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">{selectedAuthor.name}</p>
              {selectedAuthor.email && (
                <p className="text-xs text-blue-700">{selectedAuthor.email}</p>
              )}
              {selectedAuthor.bio && (
                <p className="text-xs text-blue-700 mt-1">{selectedAuthor.bio}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <p className="mt-1 text-xs text-gray-500">
        The author will be credited for this content. Company default is pre-selected.
      </p>
    </div>
  );
} 