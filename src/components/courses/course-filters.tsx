"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CourseFilters, CourseLevel, COURSE_LEVELS } from "@/types";
import { useState, useEffect } from "react";

interface CourseFiltersProps {
  filters: CourseFilters;
  categories: Array<{
    id: string;
    name: string;
    subcategories: Array<{ id: string; name: string }>;
  }>;
  onChange: (filters: CourseFilters) => void;
  onClear: () => void;
}

export function CourseFiltersComponent({
  filters,
  categories,
  onChange,
  onClear,
}: CourseFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    filters.category
  );

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== "" && value !== null
  ).length;

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  useEffect(() => {
    setSelectedCategory(filters.category);
  }, [filters.category]);

  const updateFilter = (
    key: keyof CourseFilters,
    value: string | number | boolean | undefined
  ) => {
    onChange({
      ...filters,
      [key]: value === "" ? undefined : value,
    });
  };

  const clearSingleFilter = (key: keyof CourseFilters) => {
    if (key === "category") {
      onChange({
        ...filters,
        category: undefined,
        subcategory: undefined,
      });
      setSelectedCategory(undefined);
    } else {
      updateFilter(key, undefined);
    }
  };

  const renderActiveFilters = () => {
    const activeFilters = [];

    if (filters.category) {
      const categoryData = categories.find(
        (cat) => cat.id === filters.category
      );
      activeFilters.push(
        <Badge
          key="category"
          variant="secondary"
          className="flex items-center gap-1"
        >
          Categoría: {categoryData?.name}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearSingleFilter("category")}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.subcategory && selectedCategoryData) {
      const subcategoryData = selectedCategoryData.subcategories.find(
        (sub) => sub.id === filters.subcategory
      );
      activeFilters.push(
        <Badge
          key="subcategory"
          variant="secondary"
          className="flex items-center gap-1"
        >
          Subcategoría: {subcategoryData?.name}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearSingleFilter("subcategory")}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.level) {
      activeFilters.push(
        <Badge
          key="level"
          variant="secondary"
          className="flex items-center gap-1"
        >
          Nivel: {COURSE_LEVELS[filters.level as CourseLevel]}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearSingleFilter("level")}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      const priceText = `€${filters.priceMin || 0} - €${
        filters.priceMax || "∞"
      }`;
      activeFilters.push(
        <Badge
          key="price"
          variant="secondary"
          className="flex items-center gap-1"
        >
          Precio: {priceText}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              updateFilter("priceMin", undefined);
              updateFilter("priceMax", undefined);
            }}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.featured) {
      activeFilters.push(
        <Badge
          key="featured"
          variant="secondary"
          className="flex items-center gap-1"
        >
          Solo destacados
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearSingleFilter("featured")}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    return activeFilters;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground font-sans"
          >
            Limpiar filtros
          </Button>
        )}
      </div>
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">{renderActiveFilters()}</div>
      )}
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros de búsqueda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => {
                  const newCategory = value === "all" ? undefined : value;
                  setSelectedCategory(newCategory);
                  onChange({
                    ...filters,
                    category: newCategory,
                    subcategory: undefined,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategoryData &&
              selectedCategoryData.subcategories.length > 0 && (
                <div className="space-y-2">
                  <Label>Subcategoría</Label>
                  <Select
                    value={filters.subcategory || "all"}
                    onValueChange={(value) =>
                      updateFilter(
                        "subcategory",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una subcategoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Todas las subcategorías
                      </SelectItem>
                      {selectedCategoryData.subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

            <div className="space-y-2">
              <Label>Nivel</Label>
              <Select
                value={filters.level || "all"}
                onValueChange={(value) =>
                  updateFilter("level", value === "all" ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  {Object.entries(COURSE_LEVELS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rango de precios (€)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    type="number"
                    placeholder="Precio mín."
                    value={filters.priceMin || ""}
                    onChange={(e) =>
                      updateFilter(
                        "priceMin",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    min={0}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Precio máx."
                    value={filters.priceMax || ""}
                    onChange={(e) =>
                      updateFilter(
                        "priceMax",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    min={filters.priceMin || 0}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={filters.featured || false}
                onChange={(e) =>
                  updateFilter("featured", e.target.checked ? true : undefined)
                }
                className="h-4 w-4 rounded border border-input"
              />
              <Label htmlFor="featured">Solo cursos destacados</Label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
