import { NextResponse } from "next/server";
import { getCategoriesForSlider } from "@/lib/categories-slider";

export async function GET() {
  try {
    const categories = await getCategoriesForSlider();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories for slider:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}