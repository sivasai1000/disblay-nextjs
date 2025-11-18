import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import GettingStarted from "@/components/home/GettingStarted";
import PerfectSellers from "@/components/home/PerfectSellers";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/home/Footer";
import VideoModal from "@/components/home/VideoModal";
import "@/css/LandingPage.css";

export default function HomePage() {
  return (
   <div className="landing-page">
      <Navbar />
      <Hero />
      <GettingStarted />
      <PerfectSellers />
      <FAQ />
      <Footer />
      <VideoModal />
    </div>
  );
}
