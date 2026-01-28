import TopNavigation from "@/components/TopNavigation";
import FiltersSidebar from "@/components/FiltersSidebar";
import YourSearchesSection from "@/components/YourSearchesSection";
import NewMatchesGrid from "@/components/NewMatchesGrid";
import AIAssistantPanel from "@/components/AIAssistantPanel";

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
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1000px]">
            {/* Your Searches */}
            <YourSearchesSection />

            {/* New Matches */}
            <NewMatchesGrid />
          </div>
        </main>

        {/* Right Panel - AI Assistant */}
        <AIAssistantPanel />
      </div>
    </div>
  );
};

export default Index;
