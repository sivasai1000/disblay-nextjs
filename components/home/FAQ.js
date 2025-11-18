"use client";

import { useState } from "react";

const plusIcon = "/assets/img/plusIcon.svg";
const minusIcon = "/assets/img/minusIcon.svg";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: "What is Disblay?", answer: "Disblay is a simple digital storefront for your business. It gives you a dedicated link to showcase products/services, create offers, and share with customers — all without the hassles of websites or apps." },
    { question: "Do I need technical skills to use Disblay?", answer: "Not at all. If you can use WhatsApp, you can use Disblay. It’s designed for small business owners with zero tech background." },
    { question: "How much does Disblay cost?", answer: "Disblay costs ₹999 + GST per year. No hidden charges, no commission cuts." },
    { question: "Will I get my own business link?", answer: "Yes! You can select a business URL of your choice (yourname.disblay.com) — and it stays yours forever." },
    { question: "What can I showcase on Disblay?", answer: "You can list products, services, and even create combo offers. Each item can have a photo, name, price, and details." },
    { question: "Can I add my social media and other business links?", answer: "Yes, Disblay lets you add links to WhatsApp, Instagram, Facebook, or any other business page so customers can connect easily." },
    { question: "How do I share my Disblay page?", answer: "Simply share your URL on WhatsApp, SMS, Instagram, or Facebook. Customers can browse your offerings instantly without downloading any app." },
    { question: "Can I manage orders and payments?", answer: "Yes. Customers can place orders directly from your page. You can manage orders, payments, and shipping through your dashboard." },
    { question: "Is my data and business information safe?", answer: "Absolutely. Your data is secure and only you control what’s displayed or updated on your page." },
    { question: "Why choose Disblay over websites or free tools?", answer: "Websites are costly and complicated. Free tools like WhatsApp/Instagram get messy with no proper tracking. Disblay is built to be simple, professional, and made for Indian small businesses — at an unbeatable price." },
  ];

  const toggleFAQ = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="faq-section py-5">
      <div className="container">
        <h5 className="text-center frequent-ques mb-2">FREQUENT QUESTIONS</h5>
        <h1 className="text-center mb-5 getting-started-title">
          Got Questions? We’ve Got Answers
        </h1>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
            >
              {/* Question Section */}
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{index + 1}. {faq.question}</span>
                <span className="faq-icon">
                  <img
                    src={openIndex === index ? minusIcon : plusIcon}
                    className="faq-icon-img"
                  />
                </span>
              </div>

              {/* Answer Section ALWAYS rendered */}
              <div className={`faq-answer ${openIndex === index ? "show" : "hide"}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}

          <div className="faq-contact d-flex justify-content-between align-items-center p-3 mt-3">
            <div className="find-acc">Couldn't Find an Answer You're Looking For?</div>
            <button className="btn landing-btn-watch px-4">Contact Us</button>
          </div>
        </div>
      </div>
    </section>
  );
}
