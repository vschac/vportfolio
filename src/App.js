import './index.css';
import Chat from './components/Chat'
import { useState, useEffect, useRef } from 'react';
import AsteroidGame from './components/AsteroidGame';

function App() {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [, setLastScrollY] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const projectsGridRef = useRef(null);

  // Enhanced smooth scrolling function for projects
  const scrollProjects = (direction) => {
    if (projectsGridRef.current) {
      const container = projectsGridRef.current;
      const scrollAmount = container.clientWidth * 0.8; // Scroll by 80% of visible width
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
      
      // Smooth scroll with custom easing
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (projectsGridRef.current) {
      const container = projectsGridRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        // Show navbar only when:
        // 1. Near the top (currentScrollY < 100)
        // 2. At the very top (currentScrollY === 0)
        setIsNavVisible(true);
      } else {
        // Hide navbar when scrolled down
        setIsNavVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    const handleMouseMove = (e) => {
      if (e.clientY <= 50) { // Mouse near top of screen
        setIsNavVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Add scroll listener to projects grid
  useEffect(() => {
    const projectsGrid = projectsGridRef.current;
    if (projectsGrid) {
      projectsGrid.addEventListener('scroll', checkScrollPosition, { passive: true });
      projectsGrid.addEventListener('resize', checkScrollPosition);
      
      // Initial check
      checkScrollPosition();

      return () => {
        projectsGrid.removeEventListener('scroll', checkScrollPosition);
        projectsGrid.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

  const internship = {
    title: "Software Engineer",
    company: "NASA Funded Cosmology Research at Northeastern University",
    duration: "January 2025 - July 2025",
    role: "Lead Software Engineer",
    description: "While working at the Cosmology Research Lab, I was given the task of refactoring the codebase for the Fast-PT algorithm to be more memory efficient and user friendly. Fast-PT helps create accurate models of the universe for cosmology research and data calculation pipelines. We published version 4.0 of the software during my co-op and I continued to work on my own version of the code, Jax-PT, for the remainder of the summer.",
    achievements: [
      "Accelerated all Fast-PT computations by 2-3x through a multi-tiered caching system.",
      "Redesigned and modernized the API to enable seamless integration with cosmology software ecosystems (e.g., CLASS, CAMB).",
      "Authored comprehensive documentation and implemented a unit testing framework (pytest) to improve maintainability and scientific reproducibility."
    ]
  };

  return (
    <div className="App">
      <div className="navbar-trigger" />
      <nav className={`navbar ${isNavVisible ? 'visible' : 'hidden'}`}>
        <div className="nav-content">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#gallery">Photos</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      <section id="home" className="hero-section">
        <AsteroidGame />
        <div className="hero-content">
          <div className="hero-title">
            <h1 className="glowing-text">Welcome! I'm Vince</h1>
          </div>
          <div className="text-container">
            <div className="typing-container">
              <h2 className="typewriter">Aspiring Software Developer</h2>
            </div>
            <p className="fade-in">Building creative solutions through code</p>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <h2>About Me</h2>
        <div className="split-section">
          <div className="about-content">
            <p>Hello and welcome to my portfolio! Check out my projects and experience below. If you have any questions, feel free to ask VinceGPT!</p>
          </div>
          <div className="photo-container">
            <img src="/me.png" alt="Me" className="photo"/>
          </div>
          <div className="chatbot-container">
            <Chat />
          </div>
        </div>
      </section>

      <section id="projects" className="projects-section">
        <h2>Projects
          <div className="tooltip-container">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="30"
                height="30"
              >
                <path
                  d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.518 0-10-4.482-10-10s4.482-10 10-10 10 4.482 10 10-4.482 10-10 10zm-1-16h2v6h-2zm0 8h2v2h-2z"
                ></path>
              </svg>
            </div>
            <div className="tooltip">
              <p>Click on the project card!</p>
            </div>
          </div>
        </h2>
        <div className="projects-wrapper">
          <button 
            className={`scroll-arrow left ${!canScrollLeft ? 'hidden' : ''}`} 
            onClick={() => scrollProjects('left')}
            disabled={!canScrollLeft}
          >
            <svg viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <div className="projects-grid" ref={projectsGridRef}>
          <ProjectCard 
            title="Vit"
            date="July 2025 - August 2025"
            concept="Vit is an AI powered version control software that follows the Git object model. It includes features such as AI PR reviews, commit splitting for large commits, and a swappable AI client (OpenAI API or locally run model)"
            tech="OpenAI API, Curl (C++), Ollama, CMake"
            future="Add more features of the Git object model, such as cloning and a staging area"
            githubLink="https://github.com/vschac/vit"
          />

          <ProjectCard 
            title="JAX-PT"
            date="April 2025 - August 2025"
            concept="JAX-PT is a differential perturbation theory calculator for cosmology. It is a re-write of the FAST-PT codebase to be compatible with Jax's autodifferentiation and JIT compilation."
            tech="Jax, JIT compilation, differential programming"
            future="Continue to develop the codebase to better utilize Jax's capabilities and remain up to date with the latest developments on Fast-PT"
            githubLink="https://github.com/vschac/jax-pt"
          />

          <ProjectCard 
            title="Spotify Hotkey"
            date="Jul 2024"
            concept="Developed a desktop application that allows the user to assign hotkeys that will add the user's currently playing song on Spotify to a selected playlist, greatly improves efficiency when building playlists"
            tech="Electron/Electron Forge, Spotify Web API"
            future="Create a deliverable application of the project that can be distributed to Windows and Mac users while keeping sensitive data secure"
            githubLink="https://github.com/vschac/Electron_Spotify_App"
          />
    
          <ProjectCard 
            title="NEAT AI Game"
            date="June 2024"
            concept="Created a simple space invaders style game then used the NEAT algorithm to train an AI model to play the game endlessly"
            tech="Neat, Pygame, Pickle"
            future="Create my own neural network to apply to the bots, not relying on the Neat python library"
            githubLink="https://github.com/vschac/NEAT_AI_Game"
          />

          <ProjectCard 
            title="BallWatch"
            date="July 2025"
            concept="Data driven application that provides useful insights into the NBA for fans, coaches, and managers. This was a collaborative final project for Intro to Databases at Northeastern University"
            tech="Docker, MySQL, Flask, Streamlit"
            future="Add the functionality for data to be uploaded automatically as seasons progress"
            githubLink="https://github.com/dishantbudhi/BallWatch"
          />

          <ProjectCard 
            title="Clubhub"
            date="October 2024 - December 2024"
            concept="A centralized platform for managing and discovering university clubs and organizations. This was a collaborative project with 27 other students at Northeastern University."
            tech="React, Next.js, Flask, Supabase, TailwindCSS"
            future="Accumulate current Northeastern clubs and organizations into the database"
            githubLink="https://github.com/ktp-alpha-class/clubhub/tree/main"
          />
          </div>
          <button 
            className={`scroll-arrow right ${!canScrollRight ? 'hidden' : ''}`} 
            onClick={() => scrollProjects('right')}
            disabled={!canScrollRight}
          >
            <svg viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </div>
      </section>

      <section id="experience" className="experience-section">
        <h2>Experience</h2>
        
        <div className="internship-showcase">
          <div className="mission-banner">
            <div className="mission-icon">🚀</div>
            <div className="mission-primary">
              <h3>{internship.title}</h3>
              <div className="mission-meta">
                <span className="company">{internship.company}</span>
                <span className="duration">{internship.duration}</span>
                <span className="role">{internship.role}</span>
              </div>
            </div>
          </div>

          <div className="mission-content">
            <div className="content-section">
              <h4>🏆 Key Achievements</h4>
              <ul className="achievements-list">
                {internship.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>

            <div className="content-section mission-brief-expanded">
              <h4>Description</h4>
              <p>{internship.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <h2>Photos</h2>
        <div className="gallery-container">
          <div className="photo-collage">
            <div className="photo-item large">
              <img src="/coolphotos/IMG_1092.jpeg" alt="" />
            </div>
            <div className="photo-item medium">
              <img src="/coolphotos/IMG_1169.jpeg" alt="" />
            </div>
            <div className="photo-item small">
              <img src="/coolphotos/IMG_1240.jpeg" alt="" />
            </div>
            <div className="photo-item medium">
              <img src="/coolphotos/IMG_2878.jpeg" alt="" />
            </div>
            <div className="photo-item large">
              <img src="/coolphotos/IMG_2904.jpeg" alt="" />
            </div>
            <div className="photo-item small">
              <img src="/coolphotos/IMG_3092.jpeg" alt="" />
            </div>
            <div className="photo-item medium">
              <img src="/coolphotos/IMG_3100.jpeg" alt="" />
            </div>
            <div className="photo-item small">
              <img src="/coolphotos/IMG_3170.jpeg" alt="" />
            </div>
            <div className="photo-item large">
              <img src="/coolphotos/IMG_3242.jpeg" alt="" />
            </div>
            <div className="photo-item medium">
              <img src="/coolphotos/IMG_4150.jpeg" alt="" />
            </div>
            <div className="photo-item small">
              <img src="/coolphotos/IMG_4173.jpeg" alt="" />
            </div>
            <div className="photo-item medium">
              <img src="/coolphotos/IMG_4189.jpeg" alt="" />
            </div>
            <div className="photo-item large">
              <img src="/coolphotos/IMG_4469.JPG" alt="" />
            </div>
            <div className="photo-item small">
              <img src="/coolphotos/IMG_4578.jpeg" alt="" />
            </div>
            <div className="photo-item medium">
              <img src="/coolphotos/IMG_4616.jpeg" alt="" />
            </div>
            <div className="photo-item small">
              <img src="/coolphotos/IMG_4642.jpeg" alt="" />
            </div>
            <div className="photo-item large">
              <img src="/coolphotos/IMG_4979.jpeg" alt="" />
            </div>
            <div className="photo-item medium">
              <img src="/coolphotos/IMG_5230.jpeg" alt="" />
            </div>
            <div className="photo-item small">
              <img src="/coolphotos/IMG_5328.jpeg" alt="" />
            </div>
            <div className="photo-item medium">
              <img src="/coolphotos/IMG_5505.jpeg" alt="" />
            </div>
            <div className="photo-item large">
              <img src="/coolphotos/IMG_5646.jpeg" alt="" />
            </div>
            <div className="photo-item small">
              <img src="/coolphotos/IMG_5694.jpeg" alt="" />
            </div>
            <div className="photo-item medium">
              <img src="/coolphotos/IMG_5795.jpeg" alt="" />
            </div>
            <div className="photo-item small">
              <img src="/coolphotos/IMG_5822.jpeg" alt="" />
            </div>
            <div className="photo-item medium">
              <img src="/coolphotos/IMG_5858.jpeg" alt="" />
            </div>
            <div className="photo-item large">
              <img src="/coolphotos/IMG_5998.jpeg" alt="" />
            </div>
            <div className="photo-item small">
              <img src="/coolphotos/IMG_8115.jpeg" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container">
          <a href="https://github.com/vschac" target="_blank" rel="noopener noreferrer">
            <div data-text="Github" style={{ "--r": "-15" }} className="glass">
              <svg viewBox="0 0 496 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                ></path>
              </svg>
            </div>
          </a>

          <a href="https://www.linkedin.com/in/vschacknies/" target="_blank" rel="noopener noreferrer">
            <div data-text="LinkedIn" style={{ "--r": "5" }} className="glass">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="1em">
                <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
              </svg>
            </div>
          </a>

          <a href="mailto:vincent.schacknies@icloud.com">
            <div data-text="Email" style={{ "--r": "25" }} className="glass">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="1em">
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
              </svg>
            </div>
          </a>

          <a href="/Vincent_Schacknies_Resume.pdf" download>
            <div data-text="Resume" style={{ "--r": "35" }} className="glass">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="1em">
                <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232V334.1l31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31V232c0-13.3 10.7-24 24-24s24 10.7 24 24z"/>
              </svg>
            </div>
          </a>
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} Vincent Schacknies. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;


const ProjectCard = ({ title, date, concept, tech, future, githubLink }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = (e) => {
    // Don't flip if clicking any link
    if (e.target.closest('.github-link') || e.target.closest('.info-link')) {
      return;
    }
    setIsFlipped(!isFlipped);
  };

  // Custom info text and links based on project title
  const getInfoButton = (title) => {
    if (title === "Spotify Hotkey") {
      return (
        <div className="info-link">
          <p>Download Coming Soon!</p>
        </div>
      );
    } else if (title === "NEAT AI Game") {
      return (
        <a 
          href="/neat_work_sample.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="info-link"
          onClick={(e) => e.stopPropagation()}
        >
          <p>Read Project Writeup</p>
        </a>
      );
    } else if (title === "JAX-PT") {
      return (
        <a 
          href="https://pypi.org/project/jax-pt/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="info-link"
          onClick={(e) => e.stopPropagation()}
        >
          <p>View on PyPI</p>
        </a>
      );
    }
  };

  return (
    <div className="project-container">
      <div 
        className={`project-card ${isFlipped ? 'flipped' : ''}`} 
        onClick={handleClick}
      >
        <div className="project-front">
          <div className="project-header">
            <h3>
              <a href={githubLink} target="_blank" rel="noopener noreferrer" className="project-title-link">
                {title}
              </a>
            </h3>
            <span className="project-date">{date}</span>
          </div>
          <div className="project-content">
            <div className="project-section">
              <h4>Concept</h4>
              <p>{concept}</p>
            </div>
            <div className="project-section">
              <h4>Technologies</h4>
              <p>{tech}</p>
            </div>
            <div className="project-section">
              <h4>Future Development</h4>
              <p>{future}</p>
            </div>
          </div>
        </div>
        <div className="project-back">
          <div className="back-content">
            <h3>View Project Code</h3>
            <a 
              href={githubLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
              onClick={(e) => e.stopPropagation()}
            >
              <svg height="32" viewBox="0 0 16 16" width="32">
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="currentColor"/>
              </svg>
            </a>
            {getInfoButton(title)}
            <p>Click anywhere to flip back</p>
          </div>
        </div>
      </div>
    </div>
  );
};



