
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import VideoModal from "@/components/home/VideoModal";
import "@/css/LandingPage.css";           
import "bootstrap/dist/css/bootstrap.min.css"; 
import RefundContent from "@/components/refund/RefundContent";

export default function HomePage() {
  return (
   <div className="landing-page">
      <Navbar/>
      <RefundContent/>
      <Footer />
      <VideoModal />
    </div>
  );
}
