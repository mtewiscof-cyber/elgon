import Image from 'next/image';
import Link from 'next/link';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Journey of Mt. Elgon Coffee: From Farm to Cup",
      excerpt: "Follow the journey of our specialty coffee beans from the fertile slopes of Mt. Elgon through harvesting, processing, and roasting.",
      date: "May 15, 2023",
      author: "Sarah Namono",
      category: "Coffee Production",
      image: "/placeholder-blog1.jpg"
    },
    {
      id: 2,
      title: "Women's Economic Empowerment Through Specialty Coffee",
      excerpt: "How our cooperative model is creating sustainable economic opportunities for women coffee farmers across the Mt. Elgon region.",
      date: "April 28, 2023",
      author: "Grace Atuhaire",
      category: "Social Impact",
      image: "/placeholder-blog2.jpg"
    },
    {
      id: 3,
      title: "Sustainable Farming Practices at High Altitudes",
      excerpt: "Discover the unique challenges and benefits of growing coffee at the high elevations of Mt. Elgon, and how our farmers address them sustainably.",
      date: "April 10, 2023",
      author: "Elizabeth Wanyama",
      category: "Sustainable Farming",
      image: "/placeholder-blog3.jpg"
    },
    {
      id: 4,
      title: "The Distinct Flavor Profile of Mt. Elgon Coffee",
      excerpt: "What makes Mt. Elgon coffee unique? Explore the flavor characteristics that set our beans apart in the specialty coffee world.",
      date: "March 22, 2023",
      author: "Mary Chemutai",
      category: "Coffee Education",
      image: "/placeholder-blog4.jpg"
    }
  ];

  const featuredPost = {
    id: 5,
    title: "Annual Impact Report: How Coffee Sales Changed Lives in 2023",
    excerpt: "Our 2023 Impact Report shows how your coffee purchases have directly improved the lives of women farmers and their communities through economic empowerment, education, and healthcare initiatives.",
    date: "June 2, 2023",
    author: "Janet Nabutuwa, CEO",
    category: "Impact Report",
    image: "/placeholder-featured.jpg"
  };

  return (
    <div className="page-content container">
      {/* Hero Section */}
      <div className="section">
        <h1>Blog & News</h1>
        <p className="lead">
          Stories, updates, and insights from Mt. Elgon Women in Specialty Coffee.
        </p>
      </div>

      {/* Featured Post Section */}
      <div className="section">
        <h2>Featured Story</h2>
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="flex" style={{ gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <div style={{ position: 'relative', width: '100%', height: '250px', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
                <Image 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            <div style={{ flex: '2', minWidth: '300px' }}>
              <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{featuredPost.category}</span>
              <h3 style={{ marginTop: '0.5rem' }}>{featuredPost.title}</h3>
              <p>{featuredPost.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ color: 'var(--foreground)', opacity: '0.8' }}>{featuredPost.date} | By {featuredPost.author}</span>
                <Link href={`/blog/${featuredPost.id}`} className="btn btn-accent">Read More</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="section">
        <h2>Latest Stories</h2>
        <div className="flex" style={{ gap: '2rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          {blogPosts.map(post => (
            <div key={post.id} className="card" style={{ flex: '1', minWidth: '280px', maxWidth: '400px' }}>
              <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: 'var(--border-radius)', overflow: 'hidden', marginBottom: '1rem' }}>
                <Image 
                  src={post.image} 
                  alt={post.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{post.category}</span>
              <h3 style={{ marginTop: '0.5rem' }}>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ color: 'var(--foreground)', opacity: '0.8' }}>{post.date}</span>
                <Link href={`/blog/${post.id}`} className="btn btn-secondary">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="section" style={{ backgroundColor: 'var(--light-bg)', padding: '2rem', borderRadius: 'var(--border-radius)' }}>
        <h2>Explore by Category</h2>
        <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem', justifyContent: 'center' }}>
          <Link href="/blog/category/coffee-production" className="btn btn-primary">Coffee Production</Link>
          <Link href="/blog/category/social-impact" className="btn btn-primary">Social Impact</Link>
          <Link href="/blog/category/sustainable-farming" className="btn btn-primary">Sustainable Farming</Link>
          <Link href="/blog/category/coffee-education" className="btn btn-primary">Coffee Education</Link>
          <Link href="/blog/category/farmer-stories" className="btn btn-primary">Farmer Stories</Link>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="section">
        <div className="card">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Stay updated with our latest stories, product releases, and impact reports delivered directly to your inbox.</p>
          <div className="flex" style={{ gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <input 
              type="email" 
              placeholder="Your email address" 
              style={{ 
                flex: '1',
                minWidth: '200px',
                padding: '0.8rem 1rem',
                borderRadius: '9999px',
                border: '1px solid var(--primary)',
                outline: 'none'
              }} 
            />
            <button className="btn btn-secondary" style={{ minWidth: '150px' }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 