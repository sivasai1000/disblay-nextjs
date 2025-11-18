// app/s/[businessname]/page.js (SERVER COMPONENT)


import ClientDashboard from "./ClientDashboard";

export default async function Page({ params }) {
  const { businessname } = await params;

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const packageRes = await fetch(`${BASE_URL}/getpackagebylink.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      share_link: `https://disblay.com/${businessname}`,
    }),
    cache: "no-cache",
  });

  const packageData = await packageRes.json();
  const businessId = packageData?.business_id;

  const businessRes = await fetch(`${BASE_URL}/getBusinessDetails.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ business_id: businessId }),
    cache: "no-cache",
  });

  const businessData = await businessRes.json();
  return (
    <ClientDashboard
      ssrPackage={packageData}
      ssrBusiness={businessData}
      businessname={businessname}
    />
  );
}
