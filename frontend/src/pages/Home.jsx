import { useState, useEffect } from 'react';
import API_BASE_URL from '../api/config';


const SVG_ICONS = {
  code: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
  award: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>,
  book: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
  graduation: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>,
  arrowRight: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
  github: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
};

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <a href="/" className="nav-brand">SANJAY.</a>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#education">Education</a>
          <a href="#certificates">Certificates</a>
          <a href="#contact">Contact</a>
        </div>
        <a href="/admin" className="admin-logo-btn" title="Admin Panel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container">
        <h1 className="animate-up">
          Java Backend<br/>
          <span className="gradient-text">Developer</span>
        </h1>
        <p className="animate-up delay-1">
          I am a <strong>Java Backend Fresher</strong> specializing in building robust, high-performance distributed systems. 
          I engineer scalable APIs, manage complex data architectures, and ensure 
          seamless system integrations with a focus on clean code and reliability.
        </p>
        <div className="animate-up delay-2" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#projects" className="btn btn-primary">
            View My Projects {SVG_ICONS.arrowRight}
          </a>
          <a href="#contact" className="btn btn-outline">
            Let's Connect
          </a>
        </div>
      </div>
    </section>
  );
}

function Section({ id, title, highlight, items, iconKey }) {
  if (!items || items.length === 0) return null;
  return (
    <section id={id} className="section">
      <div className="container">
        <h2 className="section-title">{title} <span>{highlight}</span></h2>
        <div className="grid">
          {items.map((item, idx) => (
            <div key={idx} style={{ animationDelay: `${idx * 0.1}s` }} className={`glass-card animate-up`} >
              <div className="card-icon">
                {SVG_ICONS[iconKey]}
              </div>
              {item.imageUrl && (
                <div className="card-image-container" style={{ margin: '-2.5rem -2.5rem 1.5rem -2.5rem', height: '200px', overflow: 'hidden' }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <h3 className="card-title">{item.name || item.title}</h3>
              {id !== 'skills' && <p className="card-desc">{item.description || item.desc}</p>}
              {(item.badge || item.proficiency || item.issuer || item.platform) && (
                <span className="badge">{item.badge || item.proficiency || item.issuer || item.platform}</span>
              )}
              {(item.projectLink || item.certificateUrl) && (
                <a href={item.projectLink || item.certificateUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  {item.projectLink ? 'View Project' : 'View Certificate'}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="container">
        <h2 className="section-title">About <span>Me</span></h2>
        <div className="glass-card animate-up" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p className="card-desc" style={{ fontSize: '1.1rem' }}>
            As a dedicated Java Backend Developer, I have a deep passion for solving complex problems through efficient code. 
            My expertise lies in Spring Boot, Microservices, and Cloud Technologies. I am committed to continuous learning 
            and delivering high-quality solutions that drive business value.
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title">Get In <span>Touch</span></h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="glass-card animate-up" style={{ textAlign: 'center' }}>
            <h3 className="card-title">Email</h3>
            <p className="card-desc" style={{ wordBreak: 'break-all', textAlign: 'justify', textAlignLast: 'center' }}>
              <a href="mailto:sanjaycsanjayc@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>sanjaycsanjayc@gmail.com</a>
            </p>
          </div>
          <div className="glass-card animate-up" style={{ textAlign: 'center', animationDelay: '0.1s' }}>
            <h3 className="card-title">LinkedIn</h3>
            <p className="card-desc" style={{ wordBreak: 'break-all', textAlign: 'justify', textAlignLast: 'center' }}>
              <a href="https://www.linkedin.com/in/sanjayc12082004" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>sanjayc12082004</a>
            </p>
          </div>
          <div className="glass-card animate-up" style={{ textAlign: 'center', animationDelay: '0.2s' }}>
            <h3 className="card-title">GitHub</h3>
            <p className="card-desc" style={{ wordBreak: 'break-all', textAlign: 'justify', textAlignLast: 'center' }}>
              <a href="https://github.com/sanjayc12" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>sanjayc12</a>
            </p>
          </div>
          <div className="glass-card animate-up" style={{ textAlign: 'center', animationDelay: '0.3s' }}>
            <h3 className="card-title">Location</h3>
            <p className="card-desc" style={{ fontSize: '0.85rem', textAlign: 'justify', textAlignLast: 'center' }}>
              7/55A, North Kannakurichi, Ganapathi puram (p.o), Kanyakumari dist, Tamil Nadu, 629502.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      const categories = ['skills', 'projects', 'certificates'];
      
      const loadCategory = async (cat) => {
        try {
          const res = await fetch(`${API_BASE_URL}/${cat}/visible`);
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem(`portfolio_${cat}`, JSON.stringify(data));
            return data;
          }
          throw new Error('Offline');
        } catch (e) {
          const local = localStorage.getItem(`portfolio_${cat}`);
          return local ? JSON.parse(local).filter(i => i.visible) : [];
        }
      };

      try {
        const [s, p, e, c] = await Promise.all(['skills', 'projects', 'education', 'certificates'].map(loadCategory));
        setSkills(s);
        setProjects(p);
        setEducation(e);
        setCertificates(c);
      } catch (error) {
        console.error("Critical fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      
      {loading ? (
        <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
          <p className="gradient-text">Loading content...</p>
        </div>
      ) : (
        <>
          <Section id="skills" title="My" highlight="Expertise" items={skills} iconKey="code" />
          <Section id="projects" title="Featured" highlight="Projects" items={projects} iconKey="arrowRight" />
          <AboutSection />
          <Section id="education" title="My" highlight="Education" 
            items={education.map(e => ({
              name: e.institution,
              desc: `${e.degree} in ${e.fieldOfStudy}`,
              badge: `${e.startDate} - ${e.endDate}`,
              platform: e.score ? `Score: ${e.score}` : null
            }))} 
            iconKey="graduation" 
          />
          <Section id="certificates" title="My" highlight="Certifications" 
            items={certificates.map(c => ({
              ...c,
              desc: c.description
            }))} 
            iconKey="award" 
          />
          <ContactSection />
        </>
      )}
    </>
  );
}
