import { createClient } from "@/utils/supabase/server";
import { Category } from "@/types";

export async function getCategoriesForSlider(): Promise<Category[]> {
  try {
    const supabase = await createClient();

    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      return [];
    }

    if (!categories || categories.length === 0) {
      return [];
    }

    const { data: subcategoriesData, error: subcategoriesError } =
      await supabase
        .from("subcategories")
        .select("*")
        .order("name", { ascending: true });

    if (subcategoriesError) {
      console.error("Error fetching subcategories:", subcategoriesError);
    }

    interface SubcategoryRow {
      id: string;
      name: string;
      slug: string;
      categoryId: string;
    }

    const subcategoriesWithCounts = await Promise.all(
      (subcategoriesData || []).map(async (sub: SubcategoryRow) => {
        const { count } = await supabase
          .from("courses")
          .select("*", { count: "exact", head: true })
          .eq("subcategoryId", sub.id)
          .eq("status", "PUBLISHED");

        return {
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          categoryId: sub.categoryId,
          course_count: count || 0,
        };
      })
    );

    interface CategoryRow {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      image: string | null;
    }

    const categoriesWithSubcategories = categories.map((category: CategoryRow) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      subcategories: subcategoriesWithCounts.filter(
        (sub) => sub.categoryId === category.id
      ),
    }));

    return categoriesWithSubcategories;
  } catch (error) {
    console.error("Error fetching categories for slider:", error);
    return [];
  }
}
