import {
  BarChart3,
  Bot,
  Code2,
  Image as ImageIcon,
  PenTool,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/*
 * Demo content for the DarlTech Academy app.
 * Everything here is sample data until the app is connected to a backend.
 * Course fees use the lower end of the ranges on the landing page — confirm real fees with the team.
 */

export type CourseKind = "Short course" | "Full programme";

export type Course = {
  id: string;
  name: string;
  kind: CourseKind;
  duration: string;
  fee: number;
  icon: LucideIcon;
  color: string;
  tutorId: string;
  summary: string;
  skills: string[];
  learn: string[];
  modules: { title: string; lessons: number; free?: boolean }[];
};

export type Tutor = {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  headline: string;
  location: string;
  rating: number;
  reviews: number;
  students: number;
  bio: string;
  skills: string[];
  courseIds: string[];
  officeHours: string[];
  experience: { title: string; place: string }[];
};

export type Post = {
  id: string;
  author: string;
  initials: string;
  color: string;
  role: "Tutor" | "Student" | "Team";
  topic: "AI" | "Design" | "Data" | "Security" | "Jobs" | "Events";
  time: string;
  text: string;
  likes: number;
  comments: number;
  quizId?: string;
  event?: { title: string; detail: string };
};

export type Material = {
  id: string;
  type: "E-book" | "Template" | "Project files" | "Video bundle";
  title: string;
  courseId: string;
  price: number;
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  answer: number;
};

export type Quiz = {
  id: string;
  title: string;
  courseId: string;
  tutorId: string;
  module: string;
  minutes: number;
  passMark: number;
  due: string;
  openToAll: boolean;
  cohorts: string[];
  questions: Question[];
};

export type Attempt = {
  id: string;
  quizId: string;
  learner: string;
  initials: string;
  color: string;
  source: string;
  score: number;
  minutes: number;
};

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  file?: string;
};

export type Conversation = {
  id: string;
  name: string;
  initials: string;
  color: string;
  subtitle: string;
  kind: "Tutors" | "Groups" | "Support" | "Students";
  messages: ChatMessage[];
};

export type Cohort = {
  id: string;
  name: string;
  courseId: string;
  students: number;
  progress: number;
  next: string;
};

export const PALETTE = {
  navy: "#0E2A54",
  navy2: "#1a3d72",
  red: "#EF4136",
  cta: "#D7372C",
  teal: "#1f6b5e",
  brown: "#8b5a2b",
  amber: "#b3741a",
};

export const COURSES: Course[] = [
  {
    id: "ai-automation",
    name: "AI Automation",
    kind: "Short course",
    duration: "3 months",
    fee: 150000,
    icon: Bot,
    color: PALETTE.navy,
    tutorId: "seun-adeyemi",
    summary:
      "Automate everyday business work with no-code AI tools, from invoices to customer replies.",
    skills: ["Prompt engineering", "Zapier", "Make", "AI agents"],
    learn: [
      "Write prompts that give reliable results",
      "Connect apps with no-code automation tools",
      "Build an AI assistant for a small business",
      "Automate invoices, emails and reports",
      "Measure the time and money you save",
      "Present an automation portfolio project",
    ],
    modules: [
      { title: "How AI tools work", lessons: 4, free: true },
      { title: "Prompt engineering", lessons: 5, free: true },
      { title: "No-code automation", lessons: 6 },
      { title: "AI for customer service", lessons: 5 },
      { title: "Automating finance tasks", lessons: 4 },
      { title: "Capstone project", lessons: 3 },
    ],
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    kind: "Short course",
    duration: "4 months",
    fee: 150000,
    icon: PenTool,
    color: PALETTE.red,
    tutorId: "tunde-bakare",
    summary:
      "Learn to research, design and test digital products people love, with weekly live classes and a portfolio project.",
    skills: ["Figma", "Wireframing", "User research", "Prototyping", "Design systems"],
    learn: [
      "Run user interviews and turn them into insights",
      "Map user flows and information architecture",
      "Wireframe and prototype in Figma",
      "Build a simple design system",
      "Test your designs with real users",
      "Present a portfolio-ready case study",
    ],
    modules: [
      { title: "Intro to UX & design thinking", lessons: 5, free: true },
      { title: "User research", lessons: 6, free: true },
      { title: "Information architecture", lessons: 5 },
      { title: "Wireframing", lessons: 6 },
      { title: "Visual design & UI", lessons: 7 },
      { title: "Prototyping in Figma", lessons: 6 },
      { title: "Usability testing", lessons: 4 },
      { title: "Portfolio & case study", lessons: 5 },
    ],
  },
  {
    id: "graphics-design",
    name: "Graphics Design",
    kind: "Short course",
    duration: "4 months",
    fee: 150000,
    icon: ImageIcon,
    color: PALETTE.navy2,
    tutorId: "ada-nwankwo",
    summary: "Design logos, brand kits and social media graphics that businesses will pay for.",
    skills: ["Brand identity", "Adobe Illustrator", "Canva", "Typography"],
    learn: [
      "Use colour, type and layout with confidence",
      "Design a logo and brand identity",
      "Create social media and print graphics",
      "Work with clients and handle feedback",
      "Prepare files for print and web",
      "Build a design portfolio",
    ],
    modules: [
      { title: "Design fundamentals", lessons: 5, free: true },
      { title: "Typography", lessons: 4, free: true },
      { title: "Colour theory", lessons: 4 },
      { title: "Logo & brand identity", lessons: 6 },
      { title: "Social media design", lessons: 5 },
      { title: "Portfolio", lessons: 3 },
    ],
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    kind: "Full programme",
    duration: "8 months",
    fee: 300000,
    icon: BarChart3,
    color: PALETTE.teal,
    tutorId: "seun-adeyemi",
    summary: "Go from spreadsheets to dashboards: clean data, find insights and tell the story.",
    skills: ["Excel", "SQL", "Power BI", "Python"],
    learn: [
      "Clean and organise messy data",
      "Query databases with SQL",
      "Build dashboards in Power BI",
      "Analyse data with Python",
      "Present insights to decision makers",
      "Complete a real-world capstone",
    ],
    modules: [
      { title: "Excel for analysis", lessons: 6, free: true },
      { title: "Statistics basics", lessons: 5 },
      { title: "SQL", lessons: 7 },
      { title: "Power BI", lessons: 6 },
      { title: "Python for data", lessons: 8 },
      { title: "Capstone project", lessons: 4 },
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    kind: "Full programme",
    duration: "8 months",
    fee: 300000,
    icon: ShieldCheck,
    color: PALETTE.brown,
    tutorId: "ada-nwankwo",
    summary:
      "Protect people and companies from attacks, and prepare for an entry-level security role.",
    skills: ["Network security", "Ethical hacking", "Security awareness"],
    learn: [
      "Understand how common attacks work",
      "Secure networks and devices",
      "Spot and report phishing",
      "Run basic penetration tests",
      "Respond to security incidents",
      "Prepare for entry-level certifications",
    ],
    modules: [
      { title: "Security foundations", lessons: 5, free: true },
      { title: "Networking basics", lessons: 6 },
      { title: "Threats & attacks", lessons: 6 },
      { title: "Ethical hacking", lessons: 7 },
      { title: "Incident response", lessons: 5 },
      { title: "Career prep", lessons: 3 },
    ],
  },
  {
    id: "python-development",
    name: "Python Development",
    kind: "Full programme",
    duration: "8 months",
    fee: 300000,
    icon: Code2,
    color: PALETTE.amber,
    tutorId: "kemi-olatunji",
    summary: "Learn to code from zero and build real web apps and automation scripts in Python.",
    skills: ["Python", "APIs", "Django", "Git"],
    learn: [
      "Write clean Python from scratch",
      "Work with files, APIs and databases",
      "Build a web app with Django",
      "Use Git and GitHub like a pro",
      "Automate boring tasks with scripts",
      "Ship a portfolio project",
    ],
    modules: [
      { title: "Python basics", lessons: 6, free: true },
      { title: "Functions & data", lessons: 6 },
      { title: "Working with APIs", lessons: 5 },
      { title: "Databases", lessons: 5 },
      { title: "Django web apps", lessons: 8 },
      { title: "Capstone project", lessons: 4 },
    ],
  },
];

export const TUTORS: Tutor[] = [
  {
    id: "tunde-bakare",
    name: "Tunde Bakare",
    initials: "TB",
    color: PALETTE.navy2,
    role: "UI/UX Design tutor",
    headline: "Product designer · 6 years in fintech",
    location: "Lagos",
    rating: 4.9,
    reviews: 48,
    students: 126,
    bio: "I design banking and shopping apps used by millions of Nigerians. I teach the same process I use at work: talk to users, sketch fast, test early. My students leave with a portfolio they can show in interviews.",
    skills: ["Figma", "User research", "Wireframing", "Prototyping", "Design systems"],
    courseIds: ["ui-ux-design", "graphics-design"],
    officeHours: ["Tuesday", "Thursday", "Saturday"],
    experience: [
      { title: "Senior product designer", place: "Fintech · 4 years" },
      { title: "UI designer", place: "E-commerce · 2 years" },
      { title: "DarlTech tutor", place: "UI/UX Design" },
    ],
  },
  {
    id: "ada-nwankwo",
    name: "Ada Nwankwo",
    initials: "AN",
    color: PALETTE.brown,
    role: "Graphics Design tutor",
    headline: "Brand designer · Lagos",
    location: "Lagos",
    rating: 4.8,
    reviews: 31,
    students: 74,
    bio: "Brand designer who has built identities for startups, churches and small businesses across Nigeria. I teach practical design that clients pay for.",
    skills: ["Brand identity", "Typography", "Illustrator", "Security awareness"],
    courseIds: ["graphics-design", "cybersecurity"],
    officeHours: ["Monday", "Wednesday"],
    experience: [
      { title: "Brand designer", place: "Independent studio · 5 years" },
      { title: "DarlTech tutor", place: "Graphics Design" },
    ],
  },
  {
    id: "kemi-olatunji",
    name: "Kemi Olatunji",
    initials: "KO",
    color: PALETTE.amber,
    role: "Python & product mentor",
    headline: "Engineering lead · Abuja",
    location: "Abuja",
    rating: 4.8,
    reviews: 22,
    students: 58,
    bio: "Software engineer turned team lead. I love helping complete beginners write their first working program.",
    skills: ["Python", "Django", "APIs", "Product design"],
    courseIds: ["python-development"],
    officeHours: ["Friday", "Saturday"],
    experience: [
      { title: "Engineering lead", place: "Logistics startup · 3 years" },
      { title: "Backend developer", place: "Agency · 4 years" },
    ],
  },
  {
    id: "seun-adeyemi",
    name: "Seun Adeyemi",
    initials: "SA",
    color: PALETTE.teal,
    role: "Data & AI tutor",
    headline: "Data analyst · Abuja",
    location: "Abuja",
    rating: 4.7,
    reviews: 36,
    students: 98,
    bio: "Data analyst who spends half the week automating reports with AI. I teach the shortcuts I wish I knew earlier.",
    skills: ["Power BI", "SQL", "Excel", "Prompt engineering"],
    courseIds: ["data-analysis", "ai-automation"],
    officeHours: ["Tuesday", "Friday"],
    experience: [
      { title: "Data analyst", place: "Telecoms · 5 years" },
      { title: "DarlTech tutor", place: "Data Analysis" },
    ],
  },
];

export const POSTS: Post[] = [
  {
    id: "p-quiz",
    author: "Tunde Bakare",
    initials: "TB",
    color: PALETTE.navy2,
    role: "Tutor",
    topic: "Design",
    time: "20m",
    text: "New free quiz for anyone learning UI/UX: 10 questions on wireframing. Take it, then drop your score in the comments.",
    likes: 64,
    comments: 21,
    quizId: "wireframing-basics",
  },
  {
    id: "p-portfolio",
    author: "Tunde Bakare",
    initials: "TB",
    color: PALETTE.navy2,
    role: "Tutor",
    topic: "Design",
    time: "2h",
    text: "Hiring managers told me what they look for in a junior UX portfolio: 3 case studies, the problem first, and your process (messy sketches included). Polish matters less than you think.",
    likes: 128,
    comments: 34,
  },
  {
    id: "p-ai-workshop",
    author: "Fatima Aliyu",
    initials: "FA",
    color: PALETTE.teal,
    role: "Student",
    topic: "AI",
    time: "5h",
    text: "We’re running a free hands-on session this weekend. Bring a laptop and a real business problem.",
    likes: 86,
    comments: 12,
    event: {
      title: "Automate your invoices with no-code AI",
      detail: "Live workshop · Saturday · Free for students",
    },
  },
  {
    id: "p-sms",
    author: "Ada Nwankwo",
    initials: "AN",
    color: PALETTE.brown,
    role: "Tutor",
    topic: "Security",
    time: "1d",
    text: "How to spot the fake bank-alert SMS scams going around: check the sender, never click the link, and confirm in your bank app before you release goods.",
    likes: 211,
    comments: 40,
  },
  {
    id: "p-jobs",
    author: "DarlTech Careers",
    initials: "DC",
    color: PALETTE.red,
    role: "Team",
    topic: "Jobs",
    time: "1d",
    text: "Remote internship roundup: design, data and dev roles open now. Update your profile so tutors can recommend you.",
    likes: 97,
    comments: 18,
  },
  {
    id: "p-powerbi",
    author: "Seun Adeyemi",
    initials: "SA",
    color: PALETTE.teal,
    role: "Tutor",
    topic: "Data",
    time: "2d",
    text: "5 free datasets for practising Excel and Power BI: sales, weather, football, transport and NBS population data. Pick one and build a dashboard this week.",
    likes: 143,
    comments: 27,
  },
];

export const MATERIALS: Material[] = [
  {
    id: "m-ux-guide",
    type: "E-book",
    title: "UX Research Field Guide",
    courseId: "ui-ux-design",
    price: 6500,
  },
  {
    id: "m-wire-kit",
    type: "Template",
    title: "Figma Wireframe Kit",
    courseId: "ui-ux-design",
    price: 4000,
  },
  {
    id: "m-checkout",
    type: "Project files",
    title: "Checkout Flow Case Study",
    courseId: "ui-ux-design",
    price: 3500,
  },
  {
    id: "m-powerbi",
    type: "Video bundle",
    title: "Power BI Dashboards",
    courseId: "data-analysis",
    price: 12000,
  },
  {
    id: "m-python",
    type: "E-book",
    title: "Python for Beginners",
    courseId: "python-development",
    price: 5000,
  },
  {
    id: "m-brand",
    type: "Template",
    title: "Brand Identity Pack",
    courseId: "graphics-design",
    price: 4500,
  },
  {
    id: "m-prompts",
    type: "E-book",
    title: "100 Business Prompts",
    courseId: "ai-automation",
    price: 3000,
  },
  {
    id: "m-phishing",
    type: "Video bundle",
    title: "Phishing Awareness Kit",
    courseId: "cybersecurity",
    price: 7500,
  },
];

export const QUIZZES: Quiz[] = [
  {
    id: "wireframing-basics",
    title: "Wireframing basics",
    courseId: "ui-ux-design",
    tutorId: "tunde-bakare",
    module: "Module 4 · Wireframing",
    minutes: 15,
    passMark: 70,
    due: "Friday, 11:59 pm",
    openToAll: true,
    cohorts: ["c5"],
    questions: [
      {
        id: "q1",
        text: "You want to test your app’s information architecture with users early, before any visual design. Which should you build?",
        options: [
          "High-fidelity mockups with final colours",
          "Low-fidelity wireframes or paper prototypes",
          "A finished coded prototype",
          "A mood board",
        ],
        answer: 1,
      },
      {
        id: "q2",
        text: "What should a wireframe focus on?",
        options: [
          "Brand colours",
          "Layout, hierarchy and content placement",
          "Animations",
          "Final photography",
        ],
        answer: 1,
      },
      {
        id: "q3",
        text: "Why map the user flow before drawing screens?",
        options: [
          "It makes screens prettier",
          "It shows every step a user takes, so no screen is missed",
          "It replaces user research",
          "Developers require it",
        ],
        answer: 1,
      },
      {
        id: "q4",
        text: "Which is a common wireframing mistake?",
        options: [
          "Using grey boxes for images",
          "Adding real content early",
          "Spending hours on colours and fonts",
          "Labelling buttons clearly",
        ],
        answer: 2,
      },
      {
        id: "q5",
        text: "Wireframes should include final brand colours.",
        options: ["True", "False"],
        answer: 1,
      },
      {
        id: "q6",
        text: "What is the best way to get feedback on a wireframe?",
        options: [
          "Ask friends if they like it",
          "Watch real users try to complete a task",
          "Post it on social media",
          "Wait for the developer’s opinion",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: "ux-research-methods",
    title: "UX research methods",
    courseId: "ui-ux-design",
    tutorId: "tunde-bakare",
    module: "Module 2 · User research",
    minutes: 10,
    passMark: 70,
    due: "Next Monday",
    openToAll: true,
    cohorts: ["c5", "c4"],
    questions: [
      {
        id: "r1",
        text: "Which method is best for understanding why users behave a certain way?",
        options: ["Analytics dashboard", "One-on-one interviews", "A/B testing", "Heatmaps"],
        answer: 1,
      },
      {
        id: "r2",
        text: "How many users usually reveal most usability problems in a small test?",
        options: ["1", "About 5", "50", "500"],
        answer: 1,
      },
      {
        id: "r3",
        text: "A good interview question is…",
        options: [
          "“Would you use this app?”",
          "“Tell me about the last time you paid a bill.”",
          "“Do you like blue?”",
          "“Isn’t this easy?”",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: "phishing-check",
    title: "Can you spot a phishing message?",
    courseId: "cybersecurity",
    tutorId: "ada-nwankwo",
    module: "Security awareness",
    minutes: 8,
    passMark: 60,
    due: "Open",
    openToAll: true,
    cohorts: [],
    questions: [
      {
        id: "s1",
        text: "An SMS says your account is blocked and asks you to click a link to verify. What do you do?",
        options: [
          "Click the link quickly",
          "Reply with your BVN",
          "Ignore the link and check in your bank app",
          "Forward it to friends",
        ],
        answer: 2,
      },
      {
        id: "s2",
        text: "Which sender address is most suspicious?",
        options: [
          "alerts@yourbank.com",
          "support@yourbank-verify-now.info",
          "noreply@yourbank.com",
          "Your bank’s short code",
        ],
        answer: 1,
      },
    ],
  },
];

export const SAMPLE_ATTEMPTS: Attempt[] = [
  {
    id: "a1",
    quizId: "wireframing-basics",
    learner: "Chidi Eze",
    initials: "CE",
    color: PALETTE.navy,
    source: "Cohort 5",
    score: 90,
    minutes: 8,
  },
  {
    id: "a2",
    quizId: "wireframing-basics",
    learner: "Oluwaseun L.",
    initials: "OL",
    color: PALETTE.teal,
    source: "Online · tech feed",
    score: 80,
    minutes: 11,
  },
  {
    id: "a3",
    quizId: "wireframing-basics",
    learner: "Zainab Musa",
    initials: "ZM",
    color: PALETTE.brown,
    source: "Cohort 5",
    score: 70,
    minutes: 13,
  },
  {
    id: "a4",
    quizId: "wireframing-basics",
    learner: "Grace U.",
    initials: "GU",
    color: PALETTE.amber,
    source: "Online · WhatsApp",
    score: 60,
    minutes: 15,
  },
  {
    id: "a5",
    quizId: "wireframing-basics",
    learner: "Ifeoma Okeke",
    initials: "IO",
    color: PALETTE.teal,
    source: "Cohort 5",
    score: 50,
    minutes: 14,
  },
  {
    id: "a6",
    quizId: "wireframing-basics",
    learner: "David A.",
    initials: "DA",
    color: PALETTE.red,
    source: "Online · LinkedIn",
    score: 100,
    minutes: 7,
  },
  {
    id: "a7",
    quizId: "ux-research-methods",
    learner: "Chidi Eze",
    initials: "CE",
    color: PALETTE.navy,
    source: "Cohort 5",
    score: 100,
    minutes: 5,
  },
  {
    id: "a8",
    quizId: "ux-research-methods",
    learner: "Kunle Ade",
    initials: "KA",
    color: PALETTE.brown,
    source: "Cohort 4",
    score: 67,
    minutes: 9,
  },
];

export const COHORTS: Cohort[] = [
  {
    id: "c5",
    name: "UI/UX Design · Cohort 5",
    courseId: "ui-ux-design",
    students: 24,
    progress: 58,
    next: "Thu, 6:00 pm",
  },
  {
    id: "c4",
    name: "UI/UX Design · Cohort 4",
    courseId: "ui-ux-design",
    students: 18,
    progress: 91,
    next: "Final review",
  },
  {
    id: "g2",
    name: "Graphics Design · Cohort 2",
    courseId: "graphics-design",
    students: 6,
    progress: 22,
    next: "Sat, 11:00 am",
  },
];

export const STUDENT_CONVERSATIONS: Conversation[] = [
  {
    id: "tunde",
    name: "Tunde Bakare",
    initials: "TB",
    color: PALETTE.navy2,
    subtitle: "Tutor · UI/UX Design",
    kind: "Tutors",
    messages: [
      {
        id: "1",
        from: "me",
        text: "Hi Tunde! I finished the checkout flow wireframes for Assignment 4. Could you take a look before I submit?",
        time: "10:02",
      },
      { id: "2", from: "me", text: "", time: "10:02", file: "checkout-wireframes.fig" },
      {
        id: "3",
        from: "them",
        text: "Nice work on the flows! The delivery step asks for the address twice. Merge those screens and add a progress indicator at the top.",
        time: "10:24",
      },
      {
        id: "4",
        from: "them",
        text: "Then go ahead and submit. We’ll review a few in Thursday’s live class.",
        time: "10:24",
      },
    ],
  },
  {
    id: "cohort5",
    name: "UI/UX Cohort 5",
    initials: "C5",
    color: PALETTE.teal,
    subtitle: "Group · 24 students",
    kind: "Groups",
    messages: [
      {
        id: "1",
        from: "them",
        text: "Ifeoma: Is the live class still on for Thursday?",
        time: "09:10",
      },
    ],
  },
  {
    id: "ada",
    name: "Ada Nwankwo",
    initials: "AN",
    color: PALETTE.brown,
    subtitle: "Tutor · Graphics Design",
    kind: "Tutors",
    messages: [
      {
        id: "1",
        from: "them",
        text: "Here’s the brand kit template I mentioned.",
        time: "Mon",
        file: "brand-kit.zip",
      },
    ],
  },
  {
    id: "support",
    name: "DarlTech Support",
    initials: "DS",
    color: PALETTE.red,
    subtitle: "Help desk",
    kind: "Support",
    messages: [
      {
        id: "1",
        from: "them",
        text: "Welcome to DarlTech! Reply here any time you need help.",
        time: "Sun",
      },
    ],
  },
];

export const TUTOR_CONVERSATIONS: Conversation[] = [
  {
    id: "amaka",
    name: "Amaka Obi",
    initials: "AO",
    color: PALETTE.red,
    subtitle: "Student · Cohort 5",
    kind: "Students",
    messages: [
      {
        id: "1",
        from: "them",
        text: "Hi Tunde! Could you look at my checkout wireframes before I submit?",
        time: "10:02",
      },
    ],
  },
  {
    id: "ifeoma",
    name: "Ifeoma Okeke",
    initials: "IO",
    color: PALETTE.teal,
    subtitle: "Student · Cohort 5",
    kind: "Students",
    messages: [
      {
        id: "1",
        from: "them",
        text: "I’m stuck on the Module 3 quiz. Can we talk during office hours?",
        time: "09:40",
      },
    ],
  },
  {
    id: "cohort5",
    name: "UI/UX Cohort 5",
    initials: "C5",
    color: PALETTE.teal,
    subtitle: "Group · 24 students",
    kind: "Groups",
    messages: [
      {
        id: "1",
        from: "them",
        text: "Ifeoma: Is the live class still on for Thursday?",
        time: "09:10",
      },
    ],
  },
];

export const FEATURES = [
  {
    title: "Expert instructors",
    body: "Learn directly from industry practitioners with real-world experience.",
  },
  {
    title: "Structured curriculum",
    body: "Module-by-module lessons that take you from zero to job-ready.",
  },
  {
    title: "Industry certificates",
    body: "Earn a DarlTech certificate you can share on LinkedIn.",
  },
  {
    title: "Progress dashboard",
    body: "Track completion, deadlines and quiz scores in one place.",
  },
  {
    title: "Discussion threads",
    body: "Ask questions and collaborate with tutors and classmates.",
  },
  {
    title: "Scholarship programme",
    body: "Apply for financial aid on any course with a ₦30,000 acceptance fee.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Adebayo Okafor",
    role: "Frontend Developer · Lagos",
    initials: "AO",
    color: PALETTE.navy,
    text: "DarlTech Academy completely changed my career. I went from zero coding knowledge to landing a frontend dev role in 8 months.",
  },
  {
    name: "Fatima Aliyu",
    role: "Data Analyst · Abuja",
    initials: "FA",
    color: PALETTE.red,
    text: "The Data Analysis course was incredibly well-structured. The instructors are knowledgeable and the dashboard made tracking my progress so easy.",
  },
  {
    name: "Chukwuemeka Nwosu",
    role: "UI/UX Designer · Port Harcourt",
    initials: "CN",
    color: PALETTE.navy2,
    text: "I applied for the scholarship and got in. DarlTech believed in me when I couldn’t afford the full fee. Now I’m working at a top design agency.",
  },
];

export const TRENDING_SKILLS = [
  { name: "Prompt engineering", topic: "AI", growth: "+42%" },
  { name: "Figma auto layout", topic: "Design", growth: "+31%" },
  { name: "Power BI", topic: "Data", growth: "+24%" },
  { name: "Cloud security basics", topic: "Security", growth: "+18%" },
];

export const EVENTS = [
  { month: "OCT", day: "03", title: "No-code AI workshop", detail: "Online · Free" },
  { month: "OCT", day: "10", title: "Portfolio review night", detail: "Lagos hub · Students" },
  { month: "OCT", day: "17", title: "Intro to ethical hacking", detail: "Online · Free" },
];

export const SCHOLARSHIP_FEE = 30000;
export const STUDENT_DISCOUNT = 0.1;

export const courseById = (id: string) => COURSES.find((c) => c.id === id);
export const tutorById = (id: string) => TUTORS.find((t) => t.id === id);
export const materialById = (id: string) => MATERIALS.find((m) => m.id === id);

export const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

/* A tutor’s own quizzes live only in their browser until there is a backend, so share links
 * carry the quiz itself (base64 JSON in the `d` query param) and open on any device. */
export function encodeQuiz(q: Quiz): string {
  const bytes = new TextEncoder().encode(JSON.stringify(q));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeQuiz(d: string | undefined): Quiz | undefined {
  if (!d) return undefined;
  try {
    const bin = atob(d.replace(/-/g, "+").replace(/_/g, "/"));
    const q = JSON.parse(
      new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))),
    ) as Quiz;
    return q && typeof q.id === "string" && Array.isArray(q.questions) ? q : undefined;
  } catch {
    return undefined;
  }
}

export const isBuiltInQuiz = (id: string) => QUIZZES.some((q) => q.id === id);

/* ---------- DarlTech Plus ---------- */

/** Plus prices in Naira. Leave null until the team sets them; pages then show "Coming soon". */
export const PLUS_PRICE: { monthly: number | null; annual: number | null } = {
  monthly: null,
  annual: null,
};
export const TRIAL_DAYS = 7;
export const plusAnnualSaving =
  PLUS_PRICE.monthly && PLUS_PRICE.annual
    ? Math.round((1 - PLUS_PRICE.annual / (PLUS_PRICE.monthly * 12)) * 100)
    : null;
export const PLUS_PERKS = [
  "Every short course and guided project",
  "Unlimited certificates",
  "All course materials in the store",
  "Live classes, tutor chat and community",
  "Cancel anytime",
];

/* ---------- Catalogue ---------- */

export type LearningType = "Programme" | "Course" | "Guided project";
export type Subject = "Design" | "Data" | "AI" | "Security" | "Programming";
export type CatalogItem = {
  id: string;
  title: string;
  type: LearningType;
  subject: Subject;
  level: "Beginner" | "Intermediate";
  length: string;
  /** rough length in hours, used for the duration filter and sorting */
  hours: number;
  courseId: string;
  tutorId: string;
  skills: string[];
  plus: boolean;
};

const SUBJECT_OF: Record<string, Subject> = {
  "ui-ux-design": "Design",
  "graphics-design": "Design",
  "data-analysis": "Data",
  "ai-automation": "AI",
  cybersecurity: "Security",
  "python-development": "Programming",
};
const MONTH_HOURS = 4 * 10;

/** Programmes come from COURSES; short courses are included with Plus, full programmes are not. */
export const CATALOG: CatalogItem[] = [
  ...COURSES.map<CatalogItem>((c) => ({
    id: c.id,
    title: c.name,
    type: "Programme",
    subject: SUBJECT_OF[c.id],
    level: "Beginner",
    length: c.duration,
    hours: parseInt(c.duration, 10) * MONTH_HOURS,
    courseId: c.id,
    tutorId: c.tutorId,
    skills: c.skills,
    plus: c.kind === "Short course",
  })),
  {
    id: "figma-auto-layout",
    title: "Figma Auto Layout in 2 Hours",
    type: "Guided project",
    subject: "Design",
    level: "Beginner",
    length: "2 hours",
    hours: 2,
    courseId: "ui-ux-design",
    tutorId: "tunde-bakare",
    skills: ["Figma", "Responsive design"],
    plus: true,
  },
  {
    id: "ux-portfolio",
    title: "Build Your First UX Case Study",
    type: "Course",
    subject: "Design",
    level: "Intermediate",
    length: "3 weeks",
    hours: 15,
    courseId: "ui-ux-design",
    tutorId: "tunde-bakare",
    skills: ["Case studies", "Portfolio", "Storytelling"],
    plus: true,
  },
  {
    id: "brand-identity-basics",
    title: "Brand Identity Basics",
    type: "Course",
    subject: "Design",
    level: "Beginner",
    length: "4 weeks",
    hours: 20,
    courseId: "graphics-design",
    tutorId: "ada-nwankwo",
    skills: ["Logo design", "Typography"],
    plus: true,
  },
  {
    id: "power-bi-dashboards",
    title: "Power BI Dashboards",
    type: "Course",
    subject: "Data",
    level: "Intermediate",
    length: "3 weeks",
    hours: 15,
    courseId: "data-analysis",
    tutorId: "seun-adeyemi",
    skills: ["Power BI", "Data storytelling"],
    plus: true,
  },
  {
    id: "excel-for-analysis",
    title: "Excel for Data Analysis",
    type: "Guided project",
    subject: "Data",
    level: "Beginner",
    length: "3 hours",
    hours: 3,
    courseId: "data-analysis",
    tutorId: "seun-adeyemi",
    skills: ["Excel", "Pivot tables"],
    plus: true,
  },
  {
    id: "prompting-for-business",
    title: "Prompting for Small Businesses",
    type: "Guided project",
    subject: "AI",
    level: "Beginner",
    length: "2 hours",
    hours: 2,
    courseId: "ai-automation",
    tutorId: "seun-adeyemi",
    skills: ["Prompt engineering", "ChatGPT"],
    plus: true,
  },
  {
    id: "spot-phishing",
    title: "Spot a Phishing Scam",
    type: "Course",
    subject: "Security",
    level: "Beginner",
    length: "1 week",
    hours: 5,
    courseId: "cybersecurity",
    tutorId: "ada-nwankwo",
    skills: ["Security awareness"],
    plus: true,
  },
  {
    id: "python-first-script",
    title: "Write Your First Python Script",
    type: "Guided project",
    subject: "Programming",
    level: "Beginner",
    length: "2 hours",
    hours: 2,
    courseId: "python-development",
    tutorId: "kemi-olatunji",
    skills: ["Python", "Automation"],
    plus: true,
  },
];
