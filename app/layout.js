import "@/css/LandingPage.css";           // ✔ global CSS
import "bootstrap/dist/css/bootstrap.min.css"; //

import { ReactQueryProvider } from "@/components/ResctQueryProvider";
import Head from "next/head";
import {
  Outfit,
  Righteous,
  Manrope,
  Metal,
  
} from "next/font/google";
import MobileRedirect from "@/components/MobileRedirect";


const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});





const metal = Metal({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-metal",
});



const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-manrope",
});

export const metadata = {
  title:
    "Disblay | India's Smartest Digital Storefront | One Link to Power Your Business",
  description:
    "Create your business link with Disblay. Showcase products & services in one simple link. Perfect for homepreneurs & local shops. Start today!",

  icons: {
    icon: "/favicon.svg",
    apple: "/logo192.png",
  },

  openGraph: {
    title: "Disblay — Show What You Sell",
    description:
      "Create your business link with Disblay. Showcase products & services in one simple link.",
    url: "https://disblay.com",
    type: "website",
    images: [
      {
        url: "https://disblay.com/preview-image.png",
      },
    ],
  
  },

  twitter: {
    card: "summary_large_image",
    title: "Disblay — Show What You Sell",
    description:
      "Create your business link with Disblay. Showcase products & services in one simple link.",
    images: ["https://disblay.com/preview-image.png"],
  },
  robots:{
  index:false,
  follow:false
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* JSON-LD 1 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Disblay",
              description:
                "Create your entire business in one simple link. Showcase products, services, and combo offers with Disblay business platform.",
              url: "https://disblay.com/",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.5",
                reviewCount: "10000",
              },
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Disblay",
              url: "https://disblay.com/",
              logo: "https://disblay.com/favicon.svg",
              description:
                "Disblay helps businesses create simple links to showcase their products and services.",
              sameAs: [
                "https://www.facebook.com/yourpage",
                "https://www.instagram.com/yourpage",
                "https://www.linkedin.com/company/yourpage",
                "https://twitter.com/yourpage",
              ],
            }),
          }}
        />
      </Head>

      <body
        className={`
          ${outfit.variable}
          ${righteous.variable}
          ${metal.variable}     
          ${manrope.variable}
        `}
      >
        {/* Mobile / Desktop redirect */}
        <MobileRedirect />

        <ReactQueryProvider>{children}</ReactQueryProvider>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}
