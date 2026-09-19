import { connectDB } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { CitiesCategoriesProvider } from "@/context/CitiesCategoriesContext";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

const loadHomeCollections = unstable_cache(async () => {
  try {
    const db = await connectDB();
    const [citiesResult, categoriesResult] = await Promise.all([
      db.query("SELECT id, name, images FROM cities ORDER BY id ASC"),
      db.query("SELECT id, name, images FROM categories ORDER BY name ASC"),
    ]);

    return {
      cities: citiesResult[0],
      categories: categoriesResult[0],
    };
  } catch (error) {
    console.error("Unable to load home collections on the server:", error);
    return { cities: null, categories: null };
  }
}, ["home-collections"], { revalidate: 300 });

export default async function HomePage() {
  const { cities, categories } = await loadHomeCollections();

  return (
    <CitiesCategoriesProvider
      initialCities={cities}
      initialCategories={categories}
    >
      <HomeClient />
    </CitiesCategoriesProvider>
  );
}
