export default function About() {
  return (
    <section className="about-wrapper">
      <div className="container">

        <h1 className="about-title text-center">
          About Women Hub
        </h1>

        <div className="about-card">

          {/* Our Story */}
          <section className="about-section">
            <h2>Our Story</h2>
            <p>
              Women Hub was founded in 2024 with a mission to empower women by providing a curated selection of fashion, beauty, and lifestyle products. Our platform connects women with the latest trends, exclusive deals, and a supportive community. </p>
          </section>

          {/* What We Offer */}
          <section className="about-section">
            <h2>What We Offer</h2>
            <ul className="about-list">
              <li>Wide range of clothing, accessories, and beauty products</li>
              <li>Secure and smooth shopping experience</li>
              <li>Fast delivery & easy returns</li>
              <li>Exclusive discounts & offers</li>
              <li>24/7 customer support</li>
            </ul>
          </section>

          {/* Mission */}
          <section className="about-section highlight">
            <h2>Our Mission</h2>
            <p>
              To inspire confidence and celebrate individuality by making
              quality products accessible to every woman.
            </p>
          </section>

          {/* Team */}
          <section className="about-section">
            <h2>Meet the Team</h2>
            <ul className="about-list">
              <li>Harsh Patel – Founder & CEO</li>
              <li>Harry Porter – Head of Marketing</li>
              <li>Hermione Granger – Customer Success Lead</li>
              <li>Passionate team of developers & designers</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="about-section contact-section">
            <h2>Contact Us</h2>
            <p><strong>Email:</strong> support@womenhub.com</p>
            <p><strong>Location:</strong> Maliba, Bardoli, India</p>
          </section>

        </div>
      </div>
    </section>
  );
}