"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseSortOptions, SORT_OPTIONS } from "@/types";

interface CourseSortProps {
  sortOptions: CourseSortOptions;
  onChange: (sortOptions: CourseSortOptions) => void;
  totalResults?: number;
}

export function CourseSort({
  sortOptions,
  onChange,
  totalResults,
}: CourseSortProps) {
  const currentSortValue = `${sortOptions.field}-${sortOptions.direction}`;

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split("-") as [
      CourseSortOptions["field"],
      CourseSortOptions["direction"]
    ];
    onChange({ field, direction });
  };

  const toggleSortDirection = () => {
    onChange({
      ...sortOptions,
      direction: sortOptions.direction === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-sans">
            Ordenar por:
          </span>
          <Select value={currentSortValue} onValueChange={handleSortChange}>
            <SelectTrigger className="w-auto min-w-[180px] font-sans">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="font-sans">
              {SORT_OPTIONS.map((option) =>
                option.directions.map((dir) => (
                  <SelectItem
                    key={`${option.field}-${dir.direction}`}
                    value={`${option.field}-${dir.direction}`}
                  >
                    {option.label}: {dir.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortDirection}
          className="flex items-center gap-1 font-serif text-xs"
        >
          <ArrowUpDown className="h-4 w-4" />
          {sortOptions.direction === "asc" ? "Ascendente" : "Descendente"}
        </Button>
      </div>

      {totalResults !== undefined && (
        <div className="text-sm text-muted-foreground">
          {totalResults === 0
            ? "No se encontraron cursos"
            : totalResults === 1
            ? "1 curso encontrado"
            : `${totalResults.toLocaleString()} cursos encontrados`}
        </div>
      )}
    </div>
  );
}
