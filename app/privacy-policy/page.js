import PrivacyContent from "@/components/privacy/PrivacyContent";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import VideoModal from "@/components/home/VideoModal";
import "@/css/LandingPage.css";

export default function PrivacyPage() {
  return (
     
       <div className="landing-page">
            <Navbar/>
        
             <PrivacyContent/>
            <Footer />
            <VideoModal />
          </div>
    );
}
