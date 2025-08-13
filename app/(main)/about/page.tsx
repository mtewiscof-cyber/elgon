import Image from 'next/image';

const AboutPage = () => {
  // Consistent horizontal padding for all sections
  const sectionPadding = "clamp(1rem, 5vw, 2.5rem)";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center relative mb-8" 
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url('/hero2.jpg')",
          minHeight: "420px",
          padding: `${sectionPadding} 0`,
          paddingTop: "clamp(2rem, 8vw, 3.5rem)",
          paddingBottom: "clamp(2rem, 8vw, 3.5rem)",
        }}
      >
        <div className="absolute inset-0 bg-black/30 z-0 rounded-b-3xl" />
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-4 px-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-2 mt-14 drop-shadow">
            About Mt. Elgon Women in Specialty Coffee
          </h1>
          <p className="text-white text-base sm:text-lg font-medium mb-2 drop-shadow">
            Empowering women coffee farmers in Uganda through quality, sustainability, and community.
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="mb-8" style={{ padding: `0 ${sectionPadding}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h2 className="text-[var(--primary)] text-2xl sm:text-3xl font-bold leading-tight mb-2">Who We Are</h2>
        <p className="text-[var(--foreground)] text-base sm:text-lg max-w-2xl mb-4">
          Mt. Elgon Women in Specialty Coffee Ltd is a cooperative of women coffee farmers in the Mt. Elgon region of Uganda. We are committed to producing high-quality specialty coffee while empowering our members economically and socially.
        </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="mb-8" style={{ padding: `0 ${sectionPadding}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h2 className="text-[var(--primary)] text-xl sm:text-2xl font-bold leading-tight mb-2">Our Story</h2>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 min-w-[220px]">
            <p className="text-[var(--foreground)] text-base mb-2">
              Founded in 2015, Mt. Elgon Women in Specialty Coffee Ltd emerged from a shared vision among women coffee farmers in the Mt. Elgon region. Facing challenges such as limited access to markets, resources, and training, these women united to form a cooperative that would amplify their voices and improve their livelihoods. The cooperative's journey began with a small group of dedicated farmers, and through collective effort and determination, it has grown into a thriving community of over 500 members.
            </p>
          </div>
          <div className="flex-1 min-w-[220px] flex justify-center items-center">
              <div className="relative w-full h-48 sm:h-64 md:h-72 rounded-xl overflow-hidden shadow-xl border-4 border-white" style={{ boxShadow: "0 8px 32px 0 rgba(80,60,120,0.13)" }}>
              <Image 
                src="/coffee1.jpg" 
                alt="Mt. Elgon Coffee Farm" 
                fill
                style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 hover:scale-105"
              />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="mb-8" style={{ padding: `0 ${sectionPadding}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h2 className="text-[var(--primary)] text-xl sm:text-2xl font-bold leading-tight mb-2">Our Mission and Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2 rounded-xl border border-[var(--secondary)] bg-[var(--light-bg)] p-4 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[var(--primary)] text-2xl">🤝</span>
            <h3 className="text-[var(--primary)] text-base font-bold">Empowerment</h3>
            <p className="text-[var(--foreground)] text-sm">We empower women coffee farmers through economic opportunities, training, and leadership development.</p>
          </div>
            <div className="flex flex-col gap-2 rounded-xl border border-[var(--secondary)] bg-[var(--light-bg)] p-4 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[var(--primary)] text-2xl">🌱</span>
            <h3 className="text-[var(--primary)] text-base font-bold">Sustainability</h3>
            <p className="text-[var(--foreground)] text-sm">We are committed to sustainable farming practices that protect the environment and ensure long-term viability.</p>
          </div>
            <div className="flex flex-col gap-2 rounded-xl border border-[var(--secondary)] bg-[var(--light-bg)] p-4 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[var(--primary)] text-2xl">👩‍🌾</span>
            <h3 className="text-[var(--primary)] text-base font-bold">Community</h3>
            <p className="text-[var(--foreground)] text-sm">We foster a strong community of farmers, promoting collaboration and mutual support.</p>
          </div>
            <div className="flex flex-col gap-2 rounded-xl border border-[var(--secondary)] bg-[var(--light-bg)] p-4 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[var(--primary)] text-2xl">☕</span>
            <h3 className="text-[var(--primary)] text-base font-bold">Quality</h3>
            <p className="text-[var(--foreground)] text-sm">We strive to produce the highest quality specialty coffee, meeting the standards of discerning consumers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section with background image accent */}
      <section className="mb-8 relative" style={{ padding: `0 ${sectionPadding}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h2 className="text-[var(--primary)] text-xl sm:text-2xl font-bold leading-tight mb-2 z-10 relative">Our Impact</h2>
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0 rounded-xl overflow-hidden hidden md:block">
          <Image src="/coffee4.jpg" alt="Coffee Impact Accent" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 z-10 relative">
            <div className="flex flex-col items-center bg-white rounded-xl border border-[var(--secondary)] p-4 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-3xl font-bold text-[var(--primary)]">500+</span>
            <span className="text-[var(--foreground)] text-sm">Members</span>
          </div>
            <div className="flex flex-col items-center bg-white rounded-xl border border-[var(--secondary)] p-4 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-3xl font-bold text-[var(--primary)]">100 Tons</span>
            <span className="text-[var(--foreground)] text-sm">Coffee Exported Annually</span>
          </div>
            <div className="flex flex-col items-center bg-white rounded-xl border border-[var(--secondary)] p-4 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-3xl font-bold text-[var(--primary)]">30%</span>
            <span className="text-[var(--foreground)] text-sm">Average Income Increase</span>
          </div>
            <div className="flex flex-col items-center bg-white rounded-xl border border-[var(--secondary)] p-4 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-3xl font-bold text-[var(--primary)]">100%</span>
            <span className="text-[var(--foreground)] text-sm">Sustainable Farming</span>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Stories Section */}
      <section className="mb-8" style={{ padding: `0 ${sectionPadding}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h2 className="text-[var(--primary)] text-xl sm:text-2xl font-bold leading-tight mb-2">Meet Our Farmers</h2>
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-center bg-[var(--light-bg)] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-1">
              <p className="text-[var(--foreground)] text-sm">Farmer Story</p>
              <h3 className="text-[var(--primary)] text-base font-bold mb-1">Aisha's Journey</h3>
              <p className="text-[var(--foreground)] text-sm">Aisha, a mother of five, joined the cooperative in 2016. Through the cooperative's training programs, she learned improved farming techniques and increased her coffee yield by 40%. Her increased income has enabled her to send her children to school and invest in her farm.</p>
            </div>
              <div className="flex-1 min-w-[180px] h-32 sm:h-40 md:h-48 rounded-xl overflow-hidden relative shadow-lg">
              <Image 
                src="/coffee2.jpg" 
                alt="Aisha's Journey" 
                fill
                style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
            <div className="flex flex-col md:flex-row gap-4 items-center bg-[var(--light-bg)] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-1">
              <p className="text-[var(--foreground)] text-sm">Farmer Story</p>
              <h3 className="text-[var(--primary)] text-base font-bold mb-1">Fatima's Transformation</h3>
              <p className="text-[var(--foreground)] text-sm">Fatima, a widow, struggled to support her family before joining the cooperative. With the cooperative's support, she accessed credit to expand her farm and now earns a stable income. She is a leader in her community and mentors other women farmers.</p>
            </div>
              <div className="flex-1 min-w-[180px] h-32 sm:h-40 md:h-48 rounded-xl overflow-hidden relative shadow-lg">
              <Image 
                src="/coffee3.jpg" 
                alt="Fatima's Transformation" 
                fill
                style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 hover:scale-105"
              />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 