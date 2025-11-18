import { Navbar } from "@/components/Navbar";
import { Globe3D } from "@/components/Globe3D";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Search bar overlay */}
      <div className="fixed top-24 left-0 right-0 z-40 px-4">
        <SearchBar />
      </div>

      {/* 3D Globe Map */}
      <Globe3D />
    </div>
  );
}
