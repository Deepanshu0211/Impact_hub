import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import SolutionSection from "@/components/sections/SolutionSection";
import LiveDemoSection from "@/components/sections/LiveDemoSection";
import ImpactSection from "@/components/sections/ImpactSection";
import RoadmapSection from "@/components/sections/RoadmapSection";
import FinalCTASection from "@/components/sections/FinalCTASection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <LiveDemoSection />
      <ImpactSection />
      <RoadmapSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
