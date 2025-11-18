
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import VideoModal from "@/components/home/VideoModal";
import "@/css/LandingPage.css";           
import "bootstrap/dist/css/bootstrap.min.css"; 
import TermsContent from "@/components/terms/TermsContent";

export default function HomePage() {
  return (
   
     <div className="landing-page">
          <Navbar/>   
           <TermsContent/>
          <Footer />
          <VideoModal />
        </div>
  );
}
