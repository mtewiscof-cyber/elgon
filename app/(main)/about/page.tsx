import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="page-content container">
      <div className="section">
        <h1>About Us & Our Impact</h1>
        <p className="lead">
          Mt. Elgon Women in Specialty Coffee Ltd (MTEWISCOF) is dedicated to economically empowering women coffee farmers in Uganda through sustainable practices and market access.
        </p>
      </div>

      <div className="section flex" style={{ gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2>Our Story</h2>
          <p>
            Founded by a collective of passionate women farmers from the slopes of Mt. Elgon in Uganda, 
            MTEWISCOF was established to address the unique challenges faced by women in the coffee industry. 
            Despite their significant contribution to coffee production, women farmers often received little 
            recognition and inadequate compensation for their work.
          </p>
          <p>
            What began as a small cooperative has grown into a thriving enterprise that connects exceptional 
            coffee directly from women farmers to conscious consumers worldwide. Our organization combines 
            traditional farming wisdom with modern sustainable practices to produce specialty coffee of the 
            highest quality.
          </p>
        </div>
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
            <Image 
              src="/placeholder-coffee-farm.jpg" 
              alt="Mt. Elgon Coffee Farm" 
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Our Mission & Values</h2>
        <div className="flex" style={{ gap: '2rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <div className="card" style={{ flex: 1, minWidth: '250px' }}>
            <h3>Economic Empowerment</h3>
            <p>We create sustainable economic opportunities for women coffee farmers through fair compensation, education, and market access.</p>
          </div>
          <div className="card" style={{ flex: 1, minWidth: '250px' }}>
            <h3>Quality & Excellence</h3>
            <p>We are committed to producing exceptional specialty coffee through sustainable farming practices and meticulous processing methods.</p>
          </div>
          <div className="card" style={{ flex: 1, minWidth: '250px' }}>
            <h3>Environmental Stewardship</h3>
            <p>We protect the unique ecosystem of Mt. Elgon through organic farming, shade-grown coffee cultivation, and conservation efforts.</p>
          </div>
          <div className="card" style={{ flex: 1, minWidth: '250px' }}>
            <h3>Community Development</h3>
            <p>We reinvest in our communities through education programs, healthcare initiatives, and infrastructure development.</p>
          </div>
        </div>
      </div>

      <div className="section" style={{ backgroundColor: 'var(--light-bg)', padding: '2rem', borderRadius: 'var(--border-radius)' }}>
        <h2>Our Impact</h2>
        <div className="flex" style={{ gap: '2rem', flexWrap: 'wrap', marginTop: '1.5rem', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>250+</div>
            <p>Women farmers supported</p>
          </div>
          <div style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>40%</div>
            <p>Average income increase</p>
          </div>
          <div style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>500+</div>
            <p>Children receiving education</p>
          </div>
          <div style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>100%</div>
            <p>Sustainable farming methods</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Farmer Stories</h2>
        <div className="flex" style={{ gap: '2rem', flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: '1', minWidth: '300px' }}>
            <h3>Meet Esther</h3>
            <p>"Before joining MTEWISCOF, I struggled to support my family with the little income I earned from coffee. Now, I receive fair prices for my beans and have learned improved farming techniques. I've been able to send all four of my children to school and even built a new home for my family."</p>
          </div>
          <div className="card" style={{ flex: '1', minWidth: '300px' }}>
            <h3>Meet Grace</h3>
            <p>"As a young widow, I faced many challenges managing my small coffee farm. Through MTEWISCOF, I received training in organic farming methods and connected with a community of supportive women. Today, my coffee is exported internationally, and I've become a trainer helping other women improve their farming practices."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 