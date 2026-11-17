export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  domain: "ai" | "ml" | "fullstack";
  featured: boolean;
  year: string;
  technologies: string;
  techList: string[];
  image: string;
  secondaryImage?: string;
  description: string;
  architectureSummary: string;
  capabilities: string[];
  github: string;
  liveDemo?: string;
  link?: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  period: string;
  location: string;
  type: "Internship" | "Education";
  description: string;
  responsibilities: string[];
  technologies: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  year?: string;
  url?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  grade: string;
  details: string;
}

export const config = {
  developer: {
    name: "Narasimha",
    fullName: "Narasimha Manam",
    monogram: "NM",
    title: "Full Stack Developer & Generative AI Engineer",
    headline: "Engineering Intelligent Systems & Spatial Web Architecture",
    description:
      "I'm Narasimha Manam — a Full Stack Developer and Generative AI Engineer building Retrieval-Augmented Generation (RAG) pipelines, multi-agent LLM applications, predictive machine learning systems, and interactive 3D web experiences.",
    location: "Guntur, Andhra Pradesh, India",
    portrait: "/portrait.jpeg",
    resumeUrl:
      "https://drive.google.com/file/d/1LDugxBj8h2SxtT2SgBOz6XXlQ8gmiS5v/view?usp=drive_link",
  },
  social: {
    github: "https://github.com/Narasimhamanam",
    linkedin: "https://www.linkedin.com/in/narasimha-manam-032a9634b",
    email: "narasimhamanam6014@gmail.com",
    location: "Guntur, Andhra Pradesh, India",
    resumeUrl:
      "https://drive.google.com/file/d/1LDugxBj8h2SxtT2SgBOz6XXlQ8gmiS5v/view?usp=drive_link",
  },
  contact: {
    email: "narasimhamanam6014@gmail.com",
    github: "https://github.com/Narasimhamanam",
    linkedin: "https://www.linkedin.com/in/narasimha-manam-032a9634b",
    location: "Guntur, Andhra Pradesh, India",
    resumeUrl:
      "https://drive.google.com/file/d/1LDugxBj8h2SxtT2SgBOz6XXlQ8gmiS5v/view?usp=drive_link",
  },
  about: {
    title: "About & Academic Foundation",
    headline: "B.Tech Computer Science & Engineering Undergraduate",
    description:
      "I am an undergraduate in Computer Science & Engineering at R.V.R & J.C College of Engineering (Expected 2027) with a CGPA of 9.41. I specialize in full-stack development and generative AI architectures, building Retrieval-Augmented Generation (RAG) pipelines, interactive user interfaces, and machine-learning systems. I focus on solving real-world challenges through rigorous engineering and clean, scalable code.",
    highlights: [
      { label: "Institution", value: "R.V.R & J.C College of Engineering" },
      { label: "Degree", value: "B.Tech in Computer Science & Engineering" },
      { label: "Academic Timeline", value: "2023 – Present (Expected 2027)" },
      { label: "Cumulative GPA", value: "9.41 / 10.0" },
    ],
    interests: [
      "Full-Stack Web Application Development (MERN Stack)",
      "Generative AI & LLM-Powered Systems",
      "Retrieval-Augmented Generation (RAG) Pipelines",
      "Machine Learning & Predictive Data Analytics",
      "Interactive Frontend & 3D Web Graphics",
      "Data Structures & Algorithmic Problem Solving",
    ],
  },
  education: [
    {
      degree: "Bachelor of Technology, Computer Science & Engineering",
      institution: "R.V.R & J.C College of Engineering",
      location: "Guntur, Andhra Pradesh",
      period: "2023 – Present",
      grade: "CGPA: 9.41 / 10",
      details:
        "Department of Computer Science & Engineering. Coursework in Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, and Artificial Intelligence. Expected Graduation: 2027.",
    },
    {
      degree: "Intermediate Education (Class XII)",
      institution: "Sri Saraswathi Junior College",
      location: "Guntur, Andhra Pradesh",
      period: "2021 – 2023",
      grade: "Percentage: 97.2%",
      details:
        "Focused study in Mathematics, Physics, and Chemistry (MPC) with academic distinction.",
    },
  ] as EducationItem[],
  internships: [
    {
      role: "AICTE EduSkills Virtual Internship — MERN Stack",
      company: "AICTE EduSkills",
      period: "April 2026 – July 2026",
      description:
        "Completed hands-on virtual internship focused on full-stack web development using MERN technologies (MongoDB, Express, React, Node.js).",
    },
    {
      role: "Web Development Intern — CodSoft",
      company: "CodSoft",
      period: "May 2025 – June 2025",
      description:
        "Developed responsive web pages and interactive user interfaces using HTML, CSS, and JavaScript.",
    },
  ],
  certifications: [
    {
      title: "NPTEL Certification in Internet of Things (IoT)",
      issuer: "NPTEL / IIT",
      year: "2025",
    },
    {
      title: "Career Essentials in Generative AI",
      issuer: "Microsoft and LinkedIn",
      year: "2025",
    },
    {
      title: "GEN AI Certification",
      issuer: "Google",
      year: "2025",
    },
  ] as Certification[],
  activities: [
    "Participated in technical events, coding contests, and college hackathons.",
    "Organized technical events as an active member of the ACM Student Chapter and Computer Science Tech Club.",
    "Collaborated in student technical communities promoting innovation, leadership, and peer learning.",
  ],
  experiences: [
    {
      id: "exp-mern",
      position: "MERN Stack Virtual Intern",
      company: "AICTE EduSkills",
      period: "April 2026 – July 2026",
      location: "Virtual / India",
      type: "Internship",
      description:
        "Hands-on full-stack development specializing in MongoDB, Express.js, React, and Node.js REST API architectures.",
      responsibilities: [
        "Constructing full-stack MERN application components and stateful client interfaces",
        "Developing secure RESTful endpoints and integrating MongoDB database schemas",
        "Practicing version control workflows and modular architectural patterns",
      ],
      technologies: ["MongoDB", "Express.js", "React", "Node.js", "Git"],
    },
    {
      id: "exp-codsoft",
      position: "Web Development Intern",
      company: "CodSoft",
      period: "May 2025 – June 2025",
      location: "Virtual / India",
      type: "Internship",
      description:
        "Designed and implemented responsive web pages and interactive user experiences with clean HTML, CSS, and modern JavaScript.",
      responsibilities: [
        "Developing responsive web pages across desktop, tablet, and mobile viewports",
        "Implementing interactive interface elements and accessible DOM structures",
        "Optimizing page layout performance and cross-browser consistency",
      ],
      technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    },
    {
      id: "edu-btech",
      position: "B.Tech in Computer Science & Engineering",
      company: "R.V.R & J.C College of Engineering",
      period: "2023 – Present",
      location: "Guntur, Andhra Pradesh",
      type: "Education",
      description:
        "Undergraduate studies in Computer Science (Expected Graduation: 2027) with strong academic standing (CGPA: 9.41 / 10).",
      responsibilities: [
        "Maintained 9.41 CGPA across Data Structures, Algorithms, DBMS, and AI coursework",
        "Active member of the ACM Student Chapter and Computer Science Tech Club",
        "Participated in collegiate hackathons, technical contests, and coding competitions",
      ],
      technologies: ["Python", "SQL", "DBMS", "DSA", "Machine Learning"],
    },
    {
      id: "edu-inter",
      position: "Intermediate (Class XII - MPC)",
      company: "Sri Saraswathi Junior College",
      period: "2021 – 2023",
      location: "Guntur, Andhra Pradesh",
      type: "Education",
      description:
        "Completed pre-university education in Mathematics, Physics, and Chemistry with high academic distinction (97.2%).",
      responsibilities: [
        "Achieved 97.2% overall aggregate score",
        "Built strong mathematical, analytical, and logical problem-solving foundations",
      ],
      technologies: ["Mathematics", "Physics", "Chemistry", "Analytical Problem Solving"],
    },
  ] as Experience[],
  skills: {
    develop: {
      title: "Full Stack & Generative AI Engineering",
      description: "MERN Stack, FastAPI & Retrieval-Augmented Generation",
      details:
        "Building production-ready web applications with the MERN Stack (MongoDB, Express, React, Node.js) and FastAPI, integrating RAG vector pipelines and predictive ML models.",
      tools: [
        "Python",
        "SQL",
        "React",
        "Node.js",
        "Express.js",
        "MongoDB",
        "FastAPI",
        "HTML",
        "CSS",
        "JavaScript",
        "Machine Learning",
        "RAG Pipelines",
        "Scikit-learn",
        "Streamlit",
        "Git/GitHub",
      ],
    },
    design: {
      title: "Data Analytics & Computer Science Fundamentals",
      description: "Data Structures, DBMS & Interactive Visualization",
      details:
        "Applying core computer science fundamentals in Data Structures, Algorithms, and DBMS, backed by analytical Python libraries, Three.js WebGL graphics, and interactive visualization dashboards.",
      tools: [
        "Data Structures & Algorithms",
        "DBMS",
        "Pandas",
        "NumPy",
        "Matplotlib",
        "Seaborn",
        "Streamlit",
        "Three.js",
        "Postman",
        "Problem-Solving",
        "Team Collaboration",
        "Adaptability",
      ],
    },
  },
  projects: [
    {
      id: 1,
      slug: "adam-1-enhanced",
      title: "ADAM-1 Enhanced",
      category: "AI Research & Computational Biology",
      domain: "ai",
      featured: true,
      year: "2026",
      technologies: "React, FastAPI, PostgreSQL, pgvector, LLM Integration",
      techList: ["React", "FastAPI", "PostgreSQL", "pgvector", "LLM Integration"],
      image: "/projects/adam1-research.jpg",
      description:
        "An AI-powered Alzheimer’s disease and microbiome research platform designed to support scientific data exploration, computational analysis, and research-oriented insights.",
      architectureSummary:
        "Combines a FastAPI backend and PostgreSQL pgvector embeddings with an interactive 3D anatomical and network exploration frontend for multi-cohort biomarker synthesis.",
      capabilities: [
        "Metagenomic gut-brain axis correlation visualization network",
        "Neural biomarker distribution heatmaps and progression curves",
        "3D brain hippocampus anatomical exploration viewport",
        "pgvector similarity clustering for multi-cohort scientific datasets",
      ],
      github: "https://github.com/Narasimhamanam",
      liveDemo: "https://github.com/Narasimhamanam",
    },
    {
      id: 2,
      slug: "simha-ai",
      title: "Simha AI",
      category: "Multi-Agent LLM Platform & RAG",
      domain: "ai",
      featured: true,
      year: "2026",
      technologies: "LLaMA 3.3, FastAPI, React, MongoDB, RAG",
      techList: ["LLaMA 3.3", "FastAPI", "React", "MongoDB", "RAG"],
      image: "/projects/simha-ai-1.jpg",
      secondaryImage: "/projects/simha-ai-2.jpg",
      description:
        "An AI-powered multi-agent assistant platform combining conversational intelligence, document understanding, and automated task workflows.",
      architectureSummary:
        "Orchestrates LLaMA 3.3 agents over FastAPI and MongoDB with vector-indexed PDF retrieval, persistent session state, and multimodal OCR parsing.",
      capabilities: [
        "Context-aware response generation powered by LLaMA 3.3",
        "RAG-based PDF question answering with vector similarity retrieval",
        "Real-time streaming and persistent chat memory",
        "Intelligent task automation, calendar operations, and email drafting",
        "OCR document analysis and multimodal input workflows",
      ],
      github: "https://github.com/Narasimhamanam/Simha-AI",
      liveDemo: "https://simha-ai.vercel.app",
      link: "https://simha-ai.vercel.app",
    },
    {
      id: 3,
      slug: "resumepilot",
      title: "ResumePilot",
      category: "Generative AI & ATS Optimization",
      domain: "ai",
      featured: true,
      year: "2026",
      technologies: "React, TypeScript, Generative AI, Document Parsing",
      techList: ["React", "TypeScript", "Generative AI", "Document Parsing"],
      image: "/projects/resumepilot.jpg",
      description:
        "An AI-powered resume optimization and Applicant Tracking System (ATS) evaluation platform that analyzes candidate profiles against role requirements.",
      architectureSummary:
        "Evaluates structured resume sections against job descriptions using LLM rubric analysis, surfacing keyword alignment, clarity metrics, and actionable rewrites.",
      capabilities: [
        "Automated ATS compatibility scoring and section-level diagnostics",
        "Role-targeted keyword gap detection and semantic matching",
        "Structured bullet-point enhancement and impact phrasing suggestions",
        "Side-by-side interactive preview and export workflow",
      ],
      github: "https://github.com/Narasimhamanam/ResumePilot",
      liveDemo: "https://github.com/Narasimhamanam/ResumePilot",
    },
    {
      id: 4,
      slug: "smart-loan-approval",
      title: "Smart Loan / AI Loan Risk",
      category: "Machine Learning & Predictive Analytics",
      domain: "ml",
      featured: true,
      year: "2025",
      technologies: "Python, Scikit-learn, Pandas, Streamlit",
      techList: ["Python", "Scikit-learn", "Pandas", "Streamlit"],
      image: "/projects/smart-loan.jpg",
      description:
        "A machine-learning application that predicts loan approval outcomes and evaluates applicant financial risk factors using supervised classification algorithms.",
      architectureSummary:
        "Processes applicant credit history, debt-to-income ratios, and income distributions through Scikit-learn classification pipelines served in an interactive Streamlit analytics workbench.",
      capabilities: [
        "Loan approval prediction using supervised classification algorithms",
        "Feature engineering and exploratory data analysis (credit score, income, DTI ratio)",
        "Interactive applicant analytics visualization dashboard",
        "Real-time risk assessment and probability waterfall attribution",
      ],
      github: "https://github.com/Narasimhamanam",
      liveDemo: "https://github.com/Narasimhamanam",
    },
    {
      id: 5,
      slug: "neuroxai",
      title: "NeuroXAI",
      category: "Explainable AI & Neural Diagnostics",
      domain: "ml",
      featured: false,
      year: "2025",
      technologies: "Python, Machine Learning, Scikit-learn, NumPy, Matplotlib",
      techList: ["Python", "Machine Learning", "Scikit-learn", "NumPy", "Matplotlib"],
      image: "/projects/neuroxai-1.jpg",
      secondaryImage: "/projects/neuroxai-2.jpg",
      description:
        "An explainable machine learning exploration interface focused on interpretable model predictions and diagnostic feature attribution.",
      architectureSummary:
        "Combines statistical feature importance inspection and visual diagnostic plots to make complex classification boundaries transparent.",
      capabilities: [
        "Feature importance attribution and diagnostic distribution plots",
        "Interactive parameter sensitivity inspection across test cohorts",
        "Comparative evaluation metrics across supervised learning models",
      ],
      github: "https://github.com/Narasimhamanam",
    },
    {
      id: 6,
      slug: "cinesnap",
      title: "CineSnap",
      category: "Full-Stack Media & Discovery Web App",
      domain: "fullstack",
      featured: false,
      year: "2025",
      technologies: "React, Node.js, Express.js, MongoDB, JavaScript",
      techList: ["React", "Node.js", "Express.js", "MongoDB", "JavaScript"],
      image: "/projects/cinesnap-1.jpg",
      secondaryImage: "/projects/cinesnap-2.jpg",
      description:
        "A full-stack media catalog and film discovery web application featuring curated collections, instant search, and responsive detail views.",
      architectureSummary:
        "Built on a modular React client and Node/Express REST architecture with dynamic filtering, watchlist persistence, and responsive card layouts.",
      capabilities: [
        "Real-time media search, genre filtering, and curated watchlists",
        "Responsive detail views with cast, synopsis, and rating breakdowns",
        "RESTful API integration with clean client state management",
      ],
      github: "https://github.com/Narasimhamanam",
    },
    {
      id: 7,
      slug: "interactive-3d-portfolio",
      title: "Interactive 3D Portfolio & Chess Arena",
      category: "Spatial WebGL & Frontend Architecture",
      domain: "fullstack",
      featured: false,
      year: "2026",
      technologies: "React, TypeScript, Three.js, React Three Fiber, GSAP, Rapier",
      techList: ["React", "TypeScript", "Three.js", "React Three Fiber", "GSAP", "Rapier"],
      image: "/projects/portfolio-3d.jpg",
      description:
        "Dual-experience 3D developer portfolio combining scroll-choreographed WebGL scenes, Rapier rigid-body physics, and a WebAssembly Stockfish chess arena.",
      architectureSummary:
        "Splits desktop and mobile bundles at runtime via media queries, pairing a glass-token design system with hardware-adaptive WebGL rendering.",
      capabilities: [
        "Runtime-split DesktopExperience and MobileExperience bundles",
        "Scroll-linked 3D camera paths and interactive physics objects",
        "Embedded WebAssembly chess engine with move validation and PGN export",
      ],
      github: "https://github.com/Narasimhamanam/portfolio",
      liveDemo: "https://narasimha-manam-portfolio.vercel.app",
      link: "https://narasimha-manam-portfolio.vercel.app",
    },
  ] as Project[],
};
