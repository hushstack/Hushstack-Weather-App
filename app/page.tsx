import { SearchBar } from "@/components/search-bar";
import { EmptyState } from "@/components/empty-state";

export default function Home() {
  return (
    <main className="min-h-screen px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 sm:mb-8 flex flex-col items-center gap-4 sm:gap-6">
          <h1 className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-2xl sm:text-3xl font-bold tracking-tight text-transparent lg:text-5xl">
            Weather App
          </h1>
          <SearchBar />
        </header>

        <EmptyState />
      </div>
    </main>
  );
}
