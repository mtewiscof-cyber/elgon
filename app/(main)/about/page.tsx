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
      <section className="mb-12" style={{ padding: `0 ${sectionPadding}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 className="text-[var(--primary)] text-2xl sm:text-3xl font-bold leading-tight mb-6">Who We Are</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[var(--foreground)] text-base sm:text-lg mb-4 leading-relaxed">
                Mt. Elgon Women in Specialty Coffee Ltd is a women-led cooperative based in Uganda's eastern region. We collaborate with 50 farmer groups, encompassing approximately 658 farmers, with 432 being women. We manage the entire coffee production process, from nurturing coffee cherries to roasting, packing, and exporting green beans.
              </p>
              <p className="text-[var(--foreground)] text-base sm:text-lg leading-relaxed">
                Our commitment extends beyond quality coffee production - we're dedicated to empowering our members economically and socially while serving both local and international markets.
              </p>
            </div>
            <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden shadow-xl">
              <Image 
                src="/about2.jpg" 
                alt="Mt. Elgon Women Coffee Farmers" 
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="mb-12" style={{ padding: `0 ${sectionPadding}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 className="text-[var(--primary)] text-2xl sm:text-3xl font-bold leading-tight mb-6">Our Leadership</h2>
          <div className="bg-[var(--light-bg)] rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-48 h-48 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <Image 
                  src="/ab1.jpg" 
                  alt="Christine Atieno Muga - CEO" 
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-[var(--primary)] text-xl sm:text-2xl font-bold mb-2">Christine Atieno Muga</h3>
                <p className="text-[var(--primary)] text-lg font-semibold mb-4">CEO & Founder</p>
                <p className="text-[var(--foreground)] text-base leading-relaxed mb-4">
                  Christine's journey into the coffee industry began in 2012 when she identified a gap in quality coffee production in her region. Despite facing setbacks, including a failed company in 2013, she persevered and established her own women-led company in 2015.
                </p>
                <p className="text-[var(--foreground)] text-base leading-relaxed mb-4">
                  Her dedication to producing exceptional coffee has gained international appreciation from buyers in the USA, Germany, France, and beyond. In recognition of her entrepreneurial achievements, Christine was among the top ten winners in dfcu Bank's Rising Woman challenge.
                </p>
                <p className="text-[var(--foreground)] text-base leading-relaxed">
                  Through her work, Christine exemplifies resilience and determination, empowering women farmers and contributing significantly to the specialty coffee industry in Uganda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Vision & Mission Section */}
      <section className="mb-12" style={{ padding: `0 ${sectionPadding}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-gradient-to-br from-[var(--light-bg)] to-white rounded-2xl p-6 md:p-8 shadow-sm border border-[var(--secondary)]">
              <div className="text-center mb-4">
                <span className="text-4xl mb-4 block">🎯</span>
                <h3 className="text-[var(--primary)] text-xl sm:text-2xl font-bold mb-4">Our Vision</h3>
              </div>
              <p className="text-[var(--foreground)] text-base sm:text-lg text-center font-medium leading-relaxed">
                "A SOCIETY WHICH IS HAPPY, HEALTHY, PRODUCTIVE AND PROSPEROUS"
              </p>
            </div>

            {/* Mission */}
            <div className="bg-gradient-to-br from-[var(--light-bg)] to-white rounded-2xl p-6 md:p-8 shadow-sm border border-[var(--secondary)]">
              <div className="text-center mb-4">
                <span className="text-4xl mb-4 block">🌟</span>
                <h3 className="text-[var(--primary)] text-xl sm:text-2xl font-bold mb-4">Our Mission</h3>
              </div>
              <p className="text-[var(--foreground)] text-base sm:text-lg text-center font-medium leading-relaxed">
                "TO PROMOTE ECONOMIC EMPOWERMENT OF WOMEN THROUGH TRAINING, ADVOCACY AND DOCUMENTATION TO ENSURE WOMEN ARE DEVELOPING THE SOCIETY IN SUSTAINABLE HEALTH AND PROFIT MINDED ENTERPRISE"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="mb-12" style={{ padding: `0 ${sectionPadding}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 className="text-[var(--primary)] text-2xl sm:text-3xl font-bold leading-tight mb-6 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--secondary)] bg-[var(--light-bg)] p-4 shadow-sm hover:shadow-md transition-shadow text-center">
              <span className="text-[var(--primary)] text-2xl">🤝</span>
              <h3 className="text-[var(--primary)] text-base font-bold">INTEGRITY</h3>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--secondary)] bg-[var(--light-bg)] p-4 shadow-sm hover:shadow-md transition-shadow text-center">
              <span className="text-[var(--primary)] text-2xl">🔍</span>
              <h3 className="text-[var(--primary)] text-base font-bold">TRANSPARENCY</h3>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--secondary)] bg-[var(--light-bg)] p-4 shadow-sm hover:shadow-md transition-shadow text-center">
              <span className="text-[var(--primary)] text-2xl">💼</span>
              <h3 className="text-[var(--primary)] text-base font-bold">JOB CREATION</h3>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--secondary)] bg-[var(--light-bg)] p-4 shadow-sm hover:shadow-md transition-shadow text-center">
              <span className="text-[var(--primary)] text-2xl">💰</span>
              <h3 className="text-[var(--primary)] text-base font-bold">VALUE FOR MONEY</h3>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--secondary)] bg-[var(--light-bg)] p-4 shadow-sm hover:shadow-md transition-shadow text-center">
              <span className="text-[var(--primary)] text-2xl">👥</span>
              <h3 className="text-[var(--primary)] text-base font-bold">TEAMWORK</h3>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--secondary)] bg-[var(--light-bg)] p-4 shadow-sm hover:shadow-md transition-shadow text-center">
              <span className="text-[var(--primary)] text-2xl">📊</span>
              <h3 className="text-[var(--primary)] text-base font-bold">ACCOUNTABILITY</h3>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--secondary)] bg-[var(--light-bg)] p-4 shadow-sm hover:shadow-md transition-shadow text-center">
              <span className="text-[var(--primary)] text-2xl">💡</span>
              <h3 className="text-[var(--primary)] text-base font-bold">CREATIVITY & INNOVATION</h3>
            </div>
          </div>
        </div>
      </section>



      {/* Our Story Section */}
      <section className="mb-12" style={{ padding: `0 ${sectionPadding}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 className="text-[var(--primary)] text-2xl sm:text-3xl font-bold leading-tight mb-6">Our Story</h2>
          <div className="bg-[var(--light-bg)] rounded-2xl p-6 md:p-8 shadow-sm">
            <p className="text-[var(--foreground)] text-base sm:text-lg leading-relaxed mb-4">
              Founded in 2015, Mt. Elgon Women in Specialty Coffee Ltd emerged from a shared vision among women coffee farmers in the Mt. Elgon region. Facing challenges such as limited access to markets, resources, and training, these women united to form a cooperative that would amplify their voices and improve their livelihoods.
            </p>
            <p className="text-[var(--foreground)] text-base sm:text-lg leading-relaxed">
              The cooperative's journey began with a small group of dedicated farmers, and through collective effort and determination, it has grown into a thriving community of over 500 members, producing exceptional specialty coffee that reaches markets across the globe.
            </p>
          </div>
        </div>
      </section>


    </div>
  );
};

export default AboutPage; 