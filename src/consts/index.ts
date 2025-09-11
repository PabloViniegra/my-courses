export const NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "About" },
];

export const FORM_VALIDATION = {
  COURSE_TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100,
  },
  COURSE_SHORT_DESC: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 200,
  },
  COURSE_DESCRIPTION: {
    MIN_LENGTH: 50,
    MAX_LENGTH: 2000,
  },
} as const;

export const COURSE_INCLUDES_FEATURES = [
  {
    icon: "PlayCircle",
    label: "Videos en alta definición",
  },
  {
    icon: "BookOpen", 
    label: "Material descargable",
  },
  {
    icon: "Clock",
    label: "Acceso de por vida",
  },
  {
    icon: "Users",
    label: "Acceso en móvil y TV",
  },
] as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 12,
} as const;
