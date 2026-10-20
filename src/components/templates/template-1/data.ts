// Define types
export interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
}

export interface Link {
  text: string;
  url: string;
  icon?: any;
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
}

export interface Section {
  id: string;
  title: string;
  isVisible: boolean;
  type: string;
}

export interface Education {
  id: string;
  institution: string;
  location: string;
  degree: string;
  gpa: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  link: Link;
  startDate: string;
  endDate: string;
  points: string[];
}

export interface Project {
  id: string;
  title: string;
  link: Link;
  startDate: string;
  endDate: string;
  points: string[];
}

export interface Certificate {
  id: string;
  name: string;
  link: Link;
  date: string;
  description: string;
}

export interface Skills {
  [key: string]: string[];
}

export interface PersonalInfo {
  name: string;
  links: {
    [key: string]: Link;
  };
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  sections: Section[];
  education: Education[];
  skills: Skills;
  experience: Experience[];
  projects: Project[];
  certificates: Certificate[];
  customSections: CustomSection[];
}

const initialSections: Section[] = [
  { id: "1", title: "EDUCATION", isVisible: true, type: "education" },
  { id: "2", title: "SKILLS SUMMARY", isVisible: true, type: "skills" },
  { id: "3", title: "WORK EXPERIENCE", isVisible: true, type: "experience" },
  { id: "4", title: "PROJECTS", isVisible: true, type: "projects" },
  { id: "5", title: "CERTIFICATES", isVisible: true, type: "certificates" },
];

export const initialData: ResumeData = {
  personalInfo: {
    name: "John Doe",
    links: {
      linkedin: {
        text: "LinkedIn",
        url: "https://www.linkedin.com/in/johndoe",
      },
      github: { text: "GitHub", url: "https://github.com/johndoe" },
      email: { text: "Email", url: "john.doe@example.com" },
      phone: { text: "Phone", url: "+1 (555) 123-4567" },
    },
  },
  sections: initialSections, // Assumed to be defined elsewhere
  education: [
    {
      id: "1",
      institution: "Vellore Institute of Technology",
      location: "Chennai, India",
      degree: "Master of Computer Application",
      gpa: "8.06",
      startDate: "June 2022",
      endDate: "August 2024",
    },
    {
      id: "2",
      institution: "University of Example",
      location: "Example City, Example Country",
      degree: "Bachelor of Science in Computer Science",
      gpa: "3.8",
      startDate: "September 2018",
      endDate: "June 2022",
    },
  ],
  skills: {
    languages: ["Python", "SQL", "JAVA", "JavaScript", "C++"],
    frameworks: ["Pandas", "Numpy", "Scikit-Learn", "Matplotlib", "React"],
    tools: [
      "Power BI",
      "Excel",
      "PowerPoint",
      "Tableau",
      "MySQL",
      "SQLite",
      "Git",
    ],
    platforms: [
      "PyCharm",
      "Jupyter Notebook",
      "Visual Studio Code",
      "IntelliJ IDEA",
      "AWS",
    ],
    softSkills: [
      "Rapport Building",
      "Strong Stakeholder Management",
      "People Management",
      "Excellent Communication",
      "Problem-Solving",
    ],
  },
  experience: [
    {
      id: "1",
      title: "BUSINESS ANALYST INTERN",
      company: "WS",
      link: { text: "LINK", url: "#" },
      startDate: "03/02/2024",
      endDate: "03/02/2024",
      points: [
        "Streamlined data collection and reporting procedures, reducing processing time by 20% enhancing efficiency.",
        "Implemented process improvements and automation solutions, resulting in 15% increase in productivity.",
        "Collaborated with 3+ cross-functional teams to gather requirements, define project scopes, and ensure alignment with business objectives.",
      ],
    },
    {
      id: "2",
      title: "Software Engineer Intern",
      company: "Tech Company",
      link: { text: "Company Website", url: "https://techcompany.com" },
      startDate: "June 2023",
      endDate: "August 2023",
      points: [
        "Developed web applications using modern frameworks, improving user experience.",
        "Assisted in debugging and optimizing code, reducing load times by 10%.",
      ],
    },
  ],
  projects: [
    {
      id: "1",
      title: "Student Performance Prediction",
      link: { text: "LINK", url: "#" },
      startDate: "03/02/2024",
      endDate: "03/02/2024",
      points: [
        "Achieved a 96% accuracy in predicting student performance using machine learning.",
        "Managed data integration from multiple sources, improving data quality by 30%.",
      ],
    },
    {
      id: "2",
      title: "Personal Portfolio Website",
      link: { text: "View Project", url: "https://johndoe.com" },
      startDate: "January 2023",
      endDate: "March 2023",
      points: [
        "Built a responsive website showcasing personal projects and skills.",
        "Integrated a contact form and dynamic content using JavaScript.",
      ],
    },
  ],
  certificates: [
    {
      id: "1",
      name: "Programming in Python (Meta)",
      link: { text: "CERTIFICATE", url: "#" },
      date: "02/27/2025",
      description:
        "Mastered fundamental Python syntax, proficiently utilizing control flow, loops, functions, and data structures.",
    },
    {
      id: "2",
      name: "Data Analysis Fundamentals",
      link: {
        text: "View Certificate",
        url: "https://example.com/certificate",
      },
      date: "October 2023",
      description:
        "Gained skills in data visualization and statistical analysis.",
    },
  ],
  customSections: [
    {
      id: "custom-section-1",
      sectionTitle: "Extracurricular Activities",
      items: [
        {
          id: "1",
          title: "Tech Club President",
          content:
            "Led a team of 20 members to organize coding workshops and hackathons.",
        },
        {
          id: "2",
          title: "Volunteer Tutor",
          content:
            "Provided free tutoring in math and science to high school students.",
        },
      ],
    },
  ],
};
