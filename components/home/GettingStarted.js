const frame1 = "/assets/img/frame1.svg";
const frame2 = "/assets/img/frame2.svg";
const frame3 = "/assets/img/frame3.svg";
const frame4 = "/assets/img/frame4.svg";

export default function GettingStarted() {
  return (
    <section className="getting-started py-5">
      <div className="container text-center">
        <h1 className="getting-started-title">
          Getting started is <span className="highlight">easier</span> than making chai ☕
        </h1>

        <div className="row mt-5 g-4">
          {[
            { img: frame1, title: "Sign Up & Setup Business", text: "Enter your business name and logo" },
            { img: frame2, title: "Add what you sell", text: "Upload items, set prices, or combos." },
            { img: frame3, title: "Share your store link", text: "Share on WhatsApp or anywhere" },
            { img: frame4, title: "Start earning", text: "Watch your phone buzz with orders" },
          ].map((item, i) => (
            <div className="col-md-3 d-flex" key={i}>
              <div className="getting-card">
                <img src={item.img} className="getting-card-img" />
                <div className="card-titles mb-2">{item.title}</div>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
