"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface CourseSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CourseSearch({
  value,
  onChange,
  placeholder = "Buscar cursos...",
}: CourseSearchProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm !== value) {
      onChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, value, onChange]);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setSearchTerm("");
    onChange("");
  }, [onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-10 font-sans"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
