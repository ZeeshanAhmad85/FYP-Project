export interface Link {
  text: string;
  url: string;
  icon?: any;
}

export interface Section {
  id: string;
  title: string;
  isVisible: boolean;
  type: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  personalInfo: {
    name: string;
    title?: string;
    links: {
      [key: string]: Link;
    };
  };
  sections: Section[];
  education: any[];
  skills: {
    [key: string]: string[];
  };
  experience: any[];
  achievements?: any[];
  projects: any[];
  certificates: any[];
  custom: any[];
  customSections: CustomSection[];
}

export const initialSections: Section[] = [
  { id: "1", title: "WORK EXPERIENCE", isVisible: true, type: "experience" },
  { id: "2", title: "EDUCATION", isVisible: true, type: "education" },
  { id: "3", title: "PROJECT", isVisible: true, type: "projects" },
  { id: "4", title: "SKILLS", isVisible: true, type: "skills" },
  { id: "5", title: "Certificates", isVisible: true, type: "certificates" },
];

export const initialData: ResumeData = {
  personalInfo: {
    name: "John Doe",
    title:
      "Full Stack Developer | Integrated Dual Degree (BTech+MTech) | CSE IIT University",
    links: {
      email: {
        text: "john.doe2007@gmail.com",
        url: "john.doe2007@gmail.com",
      },
      phone: { text: "+928117244114", url: "+928117244114" },
      location: { text: "USA", url: "USA" },
      linkedin: { text: "john.doe", url: "https://linkedin.com/in/john.doe" },
    },
  },
  sections: initialSections,
  education: [
    {
      id: "1",
      institution: "IIT University",
      location: "",
      degree: "Integrated Dual Degree (BTech+Mtech) - 3.0/4",
      gpa: "",
      startDate: "2019",
      endDate: "2024",
    },
  ],
  skills: {
    languages: ["Languages: C/C++, Python, Javascript, Java, Scala"],
    frameworks: [
      "Frameworks: React.Js, Django, Vue.Js, Springboot, Flink, Spark",
    ],
    cloud: [
      "Cloud/Databases/Tech-Stack: Postgres, MS-SQL, Mysql, AWS Services, Azure Services, ELK Stack, Prometheus, Kubernetes, Docker, Aerospike, Airflow, Helm",
    ],
  },
  experience: [
    {
      id: "1",
      title: "Software Development Intern",
      company: "TechSolve Solutions",
      link: { text: "", url: "" },
      duration: "July 2024 - Dec 2024",
      startDate: "03/03/2025",
      endDate: "03/03/2026",
      points: [
        "Developed a responsive web application using React.js and TailwindCSS, improving user engagement by 15%.",
        "Collaborated with a team of 4 to implement a RESTful API using Node.js and Express, ensuring seamless data flow between the frontend and backend.",
        "Optimized database queries in MongoDB, reducing query response time by 20%.",
        "Implemented JWT-based authentication, securing user access for 500+ accounts.",
        "Participated in code reviews and followed Agile methodologies, improving code quality and development efficiency.",
        "Deployed the application on AWS S3 and EC2, ensuring scalability and 99.9% uptime.",
      ],
    },
  ],
  projects: [
    {
      id: "1",
      title: "TaskManager Pro",
      link: { text: "", url: "" },
      duration: "2019 - 2020",
      startDate: "03/03/2025",
      endDate: "03/03/2026",
      points: [
        "Developed TaskManager Pro, a task management web application to streamline daily task organization and communication.",
        "Implemented user authentication (signup, login, and password recovery) with secure JWT-based access, ensuring data protection for 1,000+ users.",
        "Designed an intuitive task management system with CRUD operations, improving task completion efficiency by 25%.",
        "Enabled team collaboration by allowing task sharing and assignments, boosting team productivity by 30%.",
        "Integrated email notifications for task updates and deadlines, reducing missed deadlines by 20%.",
        "Built using React.js, Node.js (Express), MongoDB, AWS S3/EC2, and JWT authentication, ensuring scalability and performance.",
      ],
    },
    {
      id: "2",
      title: "Portfolio Builder",
      link: { text: "", url: "" },
      duration: "2020 - 2021",
      startDate: "03/03/2025",
      endDate: "03/03/2026",
      points: [
        "Developed a dynamic web application enabling users to create and customize professional portfolios with real-time previews.",
        "Integrated drag-and-drop features using React.js, enhancing user experience and reducing portfolio creation time by 40%.",
        "Built with React.js, Node.js, and MongoDB, and deployed on AWS S3/EC2, ensuring fast load times and scalability.",
      ],
    },
  ],
  certificates: [
    {
      id: "1",
      name: "AIR 756 in JEE Advance 2019",
      link: { text: "", url: "" },
      date: "03/01/2025",
      description:
        "Achieved an All India Rank of 756 in JEE Advanced 2019, qualifying for admission to IIT University.",
    },
  ],
  custom: [],
  customSections: [],
};
