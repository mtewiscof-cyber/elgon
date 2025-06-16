import Image from 'next/image';
import Link from 'next/link';

const blogImages = [
  '/coffee1.jpg',
  '/coffee2.jpg',
  '/coffee3.jpg',
  '/coffee4.jpg',
];

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Journey of Mt. Elgon Coffee: From Farm to Cup",
      excerpt: "Follow the journey of our specialty coffee beans from the fertile slopes of Mt. Elgon through harvesting, processing, and roasting.",
      date: "May 15, 2023",
      author: "Sarah Namono",
      category: "Coffee Production",
      image: blogImages[0],
    },
    {
      id: 2,
      title: "Women's Economic Empowerment Through Specialty Coffee",
      excerpt: "How our cooperative model is creating sustainable economic opportunities for women coffee farmers across the Mt. Elgon region.",
      date: "April 28, 2023",
      author: "Grace Atuhaire",
      category: "Social Impact",
      image: blogImages[1],
    },
    {
      id: 3,
      title: "Sustainable Farming Practices at High Altitudes",
      excerpt: "Discover the unique challenges and benefits of growing coffee at the high elevations of Mt. Elgon, and how our farmers address them sustainably.",
      date: "April 10, 2023",
      author: "Elizabeth Wanyama",
      category: "Sustainable Farming",
      image: blogImages[2],
    },
    {
      id: 4,
      title: "The Distinct Flavor Profile of Mt. Elgon Coffee",
      excerpt: "What makes Mt. Elgon coffee unique? Explore the flavor characteristics that set our beans apart in the specialty coffee world.",
      date: "March 22, 2023",
      author: "Mary Chemutai",
      category: "Coffee Education",
      image: blogImages[3],
    },
  ];

  const featuredPost = {
    id: 5,
    title: "Annual Impact Report: How Coffee Sales Changed Lives in 2023",
    excerpt: "Our 2023 Impact Report shows how your coffee purchases have directly improved the lives of women farmers and their communities through economic empowerment, education, and healthcare initiatives.",
    date: "June 2, 2023",
    author: "Janet Nabutuwa, CEO",
    category: "Impact Report",
    image: '/coffee2.jpg',
  };

  return (
    <div className="min-h-screen bg-white font-[Newsreader, Noto Sans, sans-serif]">
      {/* Hero Section */}
      <section className="w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center px-2 py-10 md:py-20 relative" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url('/coffee3.jpg')"}}>
        <div className="absolute inset-0 bg-black/30 z-0 rounded-b-3xl" />
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-4 px-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-2 mt-16 drop-shadow">Blog & News</h1>
          <h2 className="text-white text-base sm:text-lg font-medium mb-2 drop-shadow">Stories, updates, and insights from Mt. Elgon Women in Specialty Coffee.</h2>
          <Link href="#latest" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 md:h-12 md:px-5 bg-[#f1d7cf] text-[#171312] text-sm font-bold leading-normal tracking-[0.015em] md:text-base md:font-bold md:leading-normal md:tracking-[0.015em]">Explore</Link>
        </div>
      </section>

      {/* Featured Post Section */}
      <section className="max-w-4xl mx-auto w-full px-2 sm:px-4 py-8 md:py-12">
        <h2 className="text-[#171312] text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 pb-3 pt-2">Featured Post</h2>
        <div className="flex flex-col xl:flex-row gap-6 bg-[var(--light-bg)] rounded-xl overflow-hidden shadow-md">
          <div className="relative w-full xl:w-1/2 min-h-[220px] h-64 xl:h-auto">
            <Image src={featuredPost.image} alt={featuredPost.title} fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-2 p-6 xl:w-1/2">
            <span className="text-[var(--secondary)] font-bold text-sm">{featuredPost.category}</span>
            <h3 className="text-[#171312] text-lg md:text-2xl font-bold leading-tight tracking-[-0.015em]">{featuredPost.title}</h3>
            <p className="text-[#826e68] text-base font-normal leading-normal">{featuredPost.excerpt}</p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
              <span className="text-[#826e68] text-sm">{featuredPost.date} | By {featuredPost.author}</span>
              <Link href={`/blog/${featuredPost.id}`} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1d7cf] text-[#171312] text-sm font-medium leading-normal">Read More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Stories Grid */}
      <section id="latest" className="max-w-5xl mx-auto w-full px-2 sm:px-4 py-8 md:py-12">
        <h2 className="text-[#171312] text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 pb-3 pt-2">Latest Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogPosts.map((post, idx) => (
            <div key={post.id} className="flex flex-col gap-3 bg-[var(--light-bg)] rounded-xl overflow-hidden shadow-sm">
              <div className="relative w-full aspect-video">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-1 p-4">
                <span className="text-[var(--secondary)] font-bold text-xs">{post.category}</span>
                <h3 className="text-[#171312] text-base font-semibold leading-tight">{post.title}</h3>
                <p className="text-[#826e68] text-sm font-normal leading-normal line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[#826e68] text-xs">{post.date}</span>
                  <Link href={`/blog/${post.id}`} className="flex min-w-[64px] max-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-3 bg-[#f1d7cf] text-[#171312] text-xs font-medium leading-normal">Read More</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-4xl mx-auto w-full px-2 sm:px-4 py-8 md:py-12">
        <h2 className="text-[#171312] text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 pb-3 pt-2">Categories</h2>
        <div className="flex flex-wrap gap-3 p-2">
          <Link href="/blog/category/coffee-production" className="flex h-8 items-center justify-center gap-x-2 rounded-xl bg-[#f4f2f1] px-4 text-[#171312] text-sm font-medium">Coffee Production</Link>
          <Link href="/blog/category/social-impact" className="flex h-8 items-center justify-center gap-x-2 rounded-xl bg-[#f4f2f1] px-4 text-[#171312] text-sm font-medium">Social Impact</Link>
          <Link href="/blog/category/sustainable-farming" className="flex h-8 items-center justify-center gap-x-2 rounded-xl bg-[#f4f2f1] px-4 text-[#171312] text-sm font-medium">Sustainable Farming</Link>
          <Link href="/blog/category/coffee-education" className="flex h-8 items-center justify-center gap-x-2 rounded-xl bg-[#f4f2f1] px-4 text-[#171312] text-sm font-medium">Coffee Education</Link>
          <Link href="/blog/category/farmer-stories" className="flex h-8 items-center justify-center gap-x-2 rounded-xl bg-[#f4f2f1] px-4 text-[#171312] text-sm font-medium">Farmer Stories</Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-3xl mx-auto w-full px-2 sm:px-4 py-8 md:py-12">
        <div className="bg-[var(--light-bg)] rounded-xl shadow-md p-6 flex flex-col items-center gap-4">
          <h2 className="text-[#171312] text-2xl font-bold leading-tight mb-2">Stay Updated</h2>
          <p className="text-[#171312] text-base font-normal leading-normal mb-2 text-center">Get the latest news and stories delivered to your inbox.</p>
          <form className="w-full flex flex-col sm:flex-row gap-3 items-center justify-center">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 min-w-0 rounded-xl border border-[#f1d7cf] bg-white px-4 py-3 text-[#171312] placeholder:text-[#826e68] focus:outline-none focus:ring-2 focus:ring-[#f1d7cf]"
            />
            <button type="submit" className="flex min-w-[120px] max-w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#f1d7cf] text-[#171312] text-base font-bold leading-normal tracking-[0.015em]">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BlogPage; 