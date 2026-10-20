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
  title: string;
  photoUrl: string;
  photoFile?: any;
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
  summary: string;
  keyAchievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  languages: {
    id: string;
    name: string;
    level: string;
    proficiency: number;
  }[];
}

export const initialSections: Section[] = [
  { id: "1", title: "EXPERIENCE", isVisible: true, type: "experience" },
  { id: "2", title: "EDUCATION", isVisible: true, type: "education" },
  { id: "3", title: "LANGUAGES", isVisible: true, type: "languages" },
  { id: "4", title: "SUMMARY", isVisible: true, type: "summary" },
  {
    id: "5",
    title: "KEY ACHIEVEMENTS",
    isVisible: true,
    type: "keyAchievements",
  },
  { id: "6", title: "SKILLS", isVisible: true, type: "skills" },
  { id: "7", title: "CERTIFICATION", isVisible: true, type: "certificates" },
];

export const initialData: ResumeData = {
  personalInfo: {
    name: "ELLEN JOHNSON",
    title: "Digital Marketing Manager | Growth Hacking | Data Analysis",
    photoUrl: "",
    links: {
      email: { text: "help@ellenhohnson.com", url: "help@ellenhohnson.com" },
      linkedin: {
        text: "https://linkedin.com/in/ellenjohnson",
        url: "https://linkedin.com/in/ellenjohnson",
      },
      location: {
        text: "San Francisco, California",
        url: "San Francisco, California",
      },
    },
  },
  sections: initialSections,
  education: [
    {
      id: "1",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      degree: "Master of Science in Marketing Analytics",
      gpa: "",
      startDate: "01/2015",
      endDate: "01/2017",
    },
    {
      id: "2",
      institution: "San Francisco State University",
      location: "San Francisco, CA",
      degree: "Bachelor of Science in Business Administration",
      gpa: "",
      startDate: "01/2011",
      endDate: "01/2015",
    },
  ],
  skills: {
    "data analysis": ["Data Analysis", "Paid Acquisition"],
    marketing: ["Retargeting", "ROAS Optimization"],
    collaboration: ["Cross-Functional Collaboration"],
    tools: ["Google Analytics", "Looker", "Appsflyer"],
    platforms: ["Meta Advertising", "Google Ads"],
    other: ["TikTok Ads", "Snapchat Ads", "SQL"],
  },
  experience: [
    {
      id: "1",
      title: "Senior Digital Marketing Specialist",
      company: "Tech Innovate",
      link: { text: "", url: "" },
      startDate: "01/2022",
      endDate: "Present",
      points: [
        "Led the development and execution of comprehensive digital marketing campaigns across Meta, Google, and TikTok, increasing user acquisition by 45% within 12 months.",
        "Managed a $500K quarterly budget for paid acquisition channels, optimizing spend for a 30% improvement in ROAS.",
        "Implemented advanced targeting and retargeting strategies that reduced CPA by 20%, while increasing conversion rates by 15%.",
        "Conducted A/B testing on over 100 ad creatives, identifying top performers that led to a 25% increase in engagement.",
        "Collaborated with cross-functional teams to align marketing efforts with product launches, resulting in a 40% increase in product adoption.",
        "Analyzed campaign data to provide actionable insights, leading to a strategic pivot that captured a new user segment and contributed to a 35% increase in market share.",
      ],
    },
    {
      id: "2",
      title: "Digital Marketing Manager",
      company: "MarketGuru",
      link: { text: "", url: "" },
      startDate: "06/2019",
      endDate: "12/2021",
      points: [
        "Managed and scaled paid search and social campaigns across Facebook, Snapchat and Apple Search Ads, achieving a 50% increase in leads.",
        "Designed and executed a landing page optimization strategy that lifted conversion rates by 18%.",
        "Utilized Looker and Google Analytics to monitor campaign performance, driving a 10% decrease in bounce rates.",
        "Orchestrated the creative testing process, enhancing ad performance and contributing to a 22% increase in CTR.",
        "Collaborated with engineering to integrate new tracking systems, improving data accuracy and campaign efficiency.",
      ],
    },
    {
      id: "3",
      title: "Performance Marketing Analyst",
      company: "AdVantage Media",
      link: { text: "", url: "" },
      startDate: "03/2017",
      endDate: "05/2019",
      points: [
        "Analyzed performance data across multiple digital channels, identifying trends that informed strategic decisions.",
        "Supported the execution of campaigns that resulted in a 15% increase in user engagement.",
        "Developed and maintained reporting dashboards for real-time performance tracking, enhancing team responsiveness.",
        "Assisted in managing a portfolio of digital ads, optimizing for a 10% improvement in ad efficiency.",
      ],
    },
  ],
  projects: [],
  certificates: [
    {
      id: "1",
      name: "Advanced Google Analytics",
      link: { text: "", url: "" },
      date: "",
      description:
        "Focused on mastering Google Analytics for deep insights into user behavior, provided by Google.",
    },
    {
      id: "2",
      name: "Effective Creative Testing",
      link: { text: "", url: "" },
      date: "",
      description:
        "Specialized in evaluating ad creative performance to maximize engagement, offered by Coursera.",
    },
  ],
  customSections: [],
  summary:
    "Motivated Digital Marketing Manager with over 3 years of experience in driving user acquisition and growth through strategic paid campaigns. Expert in data analysis, creative optimization, and cross-functional collaboration to achieve business objectives. Proven track record of scaling campaigns and enhancing ROI.",
  keyAchievements: [
    {
      id: "1",
      title: "45% User Acquisition Increase",
      description:
        "Spearheaded digital marketing initiatives at Tech Innovate that led to a 45% increase in user acquisition.",
      icon: "star",
    },
    {
      id: "2",
      title: "30% ROAS Improvement",
      description:
        "Optimized ad spend across digital platforms at Tech Innovate, resulting in a 30% improvement in ROAS.",
      icon: "trending-up",
    },
    {
      id: "3",
      title: "Market Share Expansion",
      description:
        "Identified and captured a new user segment, contributing to a 35% increase in market share.",
      icon: "pie-chart",
    },
    {
      id: "4",
      title: "Conversion Rate Optimization",
      description:
        "Implemented a successful landing page optimization strategy, lifting conversion rates by 18%.",
      icon: "heart",
    },
  ],
  languages: [
    {
      id: "1",
      name: "English",
      level: "Native",
      proficiency: 5,
    },
    {
      id: "2",
      name: "Spanish",
      level: "Advanced",
      proficiency: 3,
    },
  ],
};
