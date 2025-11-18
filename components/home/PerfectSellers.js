const sellers = [
  { img: "/assets/img/frame5.svg", title: "Homepreneurs", cat: "(Pickles, sweets, snacks)" },
  { img: "/assets/img/frame6.svg", title: "Local Shops", cat: "(Groceries, gifts)" },
  { img: "/assets/img/frame7.svg", title: "Creators & Freelancers", cat: "(Digital art, Courses)" },
  { img: "/assets/img/frame8.svg", title: "Service Providers", cat: "(Consultations, repairs)" },
];

export default function PerfectSellers() {
  return (
    <section className="perfect-sellers py-5">
      <div className="container text-center">
        <h1 className="getting-started-title mb-5">Perfect for Every Seller</h1>

        <div className="row g-4 justify-content-center">
          {sellers.map((item, i) => (
            <div className="col-md-3 d-flex" key={i}>
              <div className="seller-card w-100">
                <img src={item.img} className="seller-card-img" />
                <div className="mt-3 perfect-sellerstext">{item.title}</div>
                <p className="seller-category mt-1">{item.cat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
