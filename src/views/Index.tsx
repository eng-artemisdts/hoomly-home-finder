import TopNavigation from "@/components/TopNavigation";
import FiltersSidebar from "@/components/FiltersSidebar";
import YourSearchesSection from "@/components/YourSearchesSection";
import NewMatchesGrid from "@/components/NewMatchesGrid";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import AISearchModal from "@/components/AISearchModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <TopNavigation />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Filters */}
        <FiltersSidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto p-6 flex justify-center">
          <div className="w-full max-w-[1000px] xl:max-w-[1200px] 2xl:max-w-[1400px]">
            {/* Your Searches */}
            <YourSearchesSection />

            {/* New Matches */}
            <NewMatchesGrid />
          </div>
        </main>

        {/* Right Panel - AI Assistant */}
        <AIAssistantPanel />
      </div>

      {/* AI Search Modal */}
      <AISearchModal />
    </div>
  );
};

export default Index;
