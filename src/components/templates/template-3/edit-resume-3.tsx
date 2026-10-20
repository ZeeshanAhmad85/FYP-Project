/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";

import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  Check,
  LinkIcon,
  ArrowUpDown,
  Mail,
  Linkedin,
  MapPin,
  Loader2,
  Sparkles,
} from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type {
  CustomSectionItem,
  Link,
  CustomSection,
  Section,
  Education,
  Experience,
  Certificate,
  Skills,
  PersonalInfo,
  ResumeData,
  Project,
} from "./data";
import { getUrl, uploadData } from "aws-amplify/storage";
import AiModal from "../ai-modal";
import { handleUpdateCredits } from "@/lib/cognitoActions";
import { AI_GENERATION_CREDITS_SUBTRACTED } from "@/constants/constants";
import UpgradeModal from "@/components/shared/upgrade-plan-modal";

// Add these props to the EditResume component
interface EditResumeProps {
  onDataChange?: (data: any) => void;
  initialResumeData?: any;
  onSuccessfulEdit?: (autoSave: boolean) => Promise<any>;
  resumeId?: string | null;
  localCredits: number;
  setLocalCredits: (credits: number) => void;
}

// Validation constants
const MAX_POINTS = 10;
const MAX_POINT_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 300;
const MAX_SKILLS_PER_CATEGORY = 10;

// AI questions for each section
const AI_QUESTIONS = {
  personalInfo: [
    {
      text: "What is your current professional role or area of expertise (e.g., Full Stack Developer, Data Scientist)?",
    },
    {
      text: "What are your most significant educational qualifications, including degrees and majors (e.g., BTech in Computer Science, Integrated Dual Degree)?",
    },
    {
      text: "Which institutions or organizations are you affiliated with that you would like to highlight (e.g., IIT University, a notable company)?",
    },
  ],
  education: [
    {
      text: "Can you describe your educational background, including the institutions you attended, the degrees you obtained, your majors, GPAs, and the dates you attended?",
    },
    {
      text: "Did you receive any notable honors or awards during your education?",
    },
    {
      text: "Where were the institutions you attended located?",
    },
  ],
  skills: [
    { text: "What programming languages are you proficient in?" },
    { text: "What frameworks or libraries do you have experience with?" },
    { text: "What tools or software are you skilled in using?" },
    {
      text: "What platforms or environments are you comfortable working with?",
    },
    {
      text: "What soft skills do you possess that are relevant to your profession?",
    },
  ],
  experience: [
    {
      text: "What professional roles have you held, including job titles, companies, and dates?",
    },
    {
      text: "What were your key responsibilities and accomplishments in each role?",
    },
    { text: "What technologies or skills did you use in each position?" },
    { text: "Have you led any teams or projects in your professional career?" },
  ],
  projects: [
    {
      text: "Can you describe the most significant projects you have worked on, including your role, the technologies used, and the outcomes?",
    },
    {
      text: "Please provide details such as project titles, dates, and any links if available.",
    },
  ],
  certificates: [
    { text: "What relevant certifications have you obtained?" },
    { text: "Who issued each certification, and when did you receive it?" },
    {
      text: "Can you provide a brief description of what each certification entails?",
    },
  ],
  summary: [
    {
      text: "How would you describe your overall professional profile in 2-3 sentences?",
    },
    {
      text: "What makes you stand out from others in your field?",
    },
    {
      text: "What are your long-term career goals or aspirations?",
    },
  ],
  keyAchievements: [
    {
      text: "What are some of your most notable achievements in your career or academics?",
    },
    {
      text: "Have you received any awards, recognitions, or titles worth highlighting?",
    },
    {
      text: "Can you share specific results (e.g., metrics, impact) from your work that you're proud of?",
    },
  ],
};

// Validation functions
const validatePersonalInfo = (personalInfo: PersonalInfo): boolean => {
  if (!personalInfo.name.trim()) {
    toast.error("Name cannot be empty");
    return false;
  }

  // Check if at least one link has both text and URL
  const hasValidLink = Object.values(personalInfo.links).some(
    (link) => link.text.trim() && link.url.trim()
  );

  if (!hasValidLink) {
    toast.error("At least one contact method must be provided");
    return false;
  }

  return true;
};

const validateEducation = (education: Education): boolean => {
  if (!education.institution.trim()) {
    toast.error("Institution name cannot be empty");
    return false;
  }

  if (!education.degree.trim()) {
    toast.error("Degree cannot be empty");
    return false;
  }

  if (!education.startDate.trim() || !education.endDate.trim()) {
    toast.error("Start and end dates are required");
    return false;
  }

  return true;
};

const validateExperience = (experience: Experience): boolean => {
  if (!experience.title.trim()) {
    toast.error("Job title cannot be empty");
    return false;
  }

  if (!experience.company.trim()) {
    toast.error("Company name cannot be empty");
    return false;
  }

  if (!experience.startDate.trim()) {
    toast.error("Start date cannot be empty");
    return false;
  }

  if (!experience.endDate.trim()) {
    toast.error("End date cannot be empty");
    return false;
  }

  if (
    experience.points.length === 0 ||
    !experience.points.some((point) => point.trim())
  ) {
    toast.error("At least one bullet point is required");
    return false;
  }

  if (experience.points.length > MAX_POINTS) {
    toast.error(`Maximum ${MAX_POINTS} bullet points allowed`);
    return false;
  }

  for (const point of experience.points) {
    if (point.length > MAX_POINT_LENGTH) {
      toast.error(
        `Bullet points must be less than ${MAX_POINT_LENGTH} characters`
      );
      return false;
    }
  }

  return true;
};

const validateProject = (project: Project): boolean => {
  if (!project.title.trim()) {
    toast.error("Project title cannot be empty");
    return false;
  }

  if (!project.startDate.trim()) {
    toast.error("Project start date cannot be empty");
    return false;
  }

  if (!project.endDate.trim()) {
    toast.error("Project end date cannot be empty");
    return false;
  }

  if (
    project.points.length === 0 ||
    !project.points.some((point) => point.trim())
  ) {
    toast.error("At least one bullet point is required");
    return false;
  }

  if (project.points.length > MAX_POINTS) {
    toast.error(`Maximum ${MAX_POINTS} bullet points allowed`);
    return false;
  }

  for (const point of project.points) {
    if (point.length > MAX_POINT_LENGTH) {
      toast.error(
        `Bullet points must be less than ${MAX_POINT_LENGTH} characters`
      );
      return false;
    }
  }

  return true;
};

const validateCertificate = (certificate: Certificate): boolean => {
  if (!certificate.name.trim()) {
    toast.error("Certificate name cannot be empty");
    return false;
  }

  if (!certificate.description.trim()) {
    toast.error("Certificate description cannot be empty");
    return false;
  }

  if (certificate.description.length > MAX_DESCRIPTION_LENGTH) {
    toast.error(
      `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`
    );
    return false;
  }

  return true;
};

const validateSkills = (skills: Skills): boolean => {
  if (Object.keys(skills).length === 0) {
    toast.error("At least one skill category is required");
    return false;
  }

  for (const [category, skillList] of Object.entries(skills)) {
    if (skillList.length === 0) {
      toast.error(`Skill category '${category}' cannot be empty`);
      return false;
    }

    if (skillList.length > MAX_SKILLS_PER_CATEGORY) {
      toast.error(
        `Maximum ${MAX_SKILLS_PER_CATEGORY} skills allowed per category`
      );
      return false;
    }
  }

  return true;
};

const validateCustomItem = (item: CustomSectionItem): boolean => {
  if (!item.title.trim()) {
    toast.error("Item title cannot be empty");
    return false;
  }

  if (!item.content.trim()) {
    toast.error("Item content cannot be empty");
    return false;
  }

  if (item.content.length > MAX_DESCRIPTION_LENGTH) {
    toast.error(
      `Content must be less than ${MAX_DESCRIPTION_LENGTH} characters`
    );
    return false;
  }

  return true;
};

const validateLanguage = (language: {
  name: string;
  level: string;
}): boolean => {
  if (!language.name.trim()) {
    toast.error("Language name cannot be empty");
    return false;
  }

  if (!language.level.trim()) {
    toast.error("Proficiency level cannot be empty");
    return false;
  }

  return true;
};

const validateKeyAchievement = (achievement: {
  title: string;
  description: string;
}): boolean => {
  if (!achievement.title.trim()) {
    toast.error("Achievement title cannot be empty");
    return false;
  }

  if (!achievement.description.trim()) {
    toast.error("Achievement description cannot be empty");
    return false;
  }

  if (achievement.description.length > MAX_DESCRIPTION_LENGTH) {
    toast.error(
      `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`
    );
    return false;
  }

  return true;
};

const DragHandle = ({ id }: { id: string }) => {
  const { attributes, listeners } = useSortable({ id });

  return (
    <div
      className="absolute left-1/2 -top-3 rounded-md transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move bg-[#E6ECF8] p-1"
      {...attributes}
      {...listeners}
    >
      <ArrowUpDown className="w-5 h-5 text-primary" />
    </div>
  );
};

const SortableItem = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

const ProficiencyDots = ({ level }: { level: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={`w-2 h-2 rounded-full ${
            dot <= level ? "bg-gray-800" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default function EditResume({
  onDataChange,
  initialResumeData,
  onSuccessfulEdit,
  resumeId,
  localCredits,
  setLocalCredits,
}: EditResumeProps) {
  const [data, setData] = useState<ResumeData>(initialResumeData);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<{
    section: string;
    id: string;
  } | null>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [newCustomSection, setNewCustomSection] =
    useState<CustomSection | null>(null);
  const [newCustomItem, setNewCustomItem] = useState<{
    sectionId: string;
    item: CustomSectionItem;
  } | null>(null);

  // AI Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalSection, setAiModalSection] = useState<string>("");
  const [aiModalSectionId, setAiModalSectionId] = useState<string | null>(null);
  const [aiModalItemId, setAiModalItemId] = useState<string | null>(null);

  const [showModalButtonText, setShowModalButtonText] = useState("Continue");

  // Add state for auto-save functionality
  const [pendingSave, setPendingSave] = useState(false);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const [showUploadedPhoto, setShowUploadedPhoto] = useState(
    "/placeholder-user.jpg"
  );

  // Notify parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [data, onDataChange]);

  // Auto-save functionality with debounce
  useEffect(() => {
    if (pendingSave && onSuccessfulEdit) {
      const timer = setTimeout(() => {
        onSuccessfulEdit(true);
        setPendingSave(false);
      }, 2000); // 2-second debounce

      return () => clearTimeout(timer);
    }
  }, [pendingSave, onSuccessfulEdit]);

  // Function to trigger auto-save
  const triggerAutoSave = useCallback(() => {
    if (onSuccessfulEdit) {
      setPendingSave(true);
    }
  }, [onSuccessfulEdit]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    async function fetchUrl() {
      if (data?.personalInfo?.photoUrl) {
        const url = await getUrl({
          path: data.personalInfo.photoUrl,
          options: {
            validateObjectExistence: false,
            expiresIn: 900,
            useAccelerateEndpoint: false,
          },
        });
        setShowUploadedPhoto(url?.url?.href);
      }
    }

    fetchUrl();
  }, [data?.personalInfo?.photoUrl]);

  const handlePhotoUpload = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (validTypes.includes(file.type)) {
        try {
          setIsUploading(true);
          // Generate a timestamp
          const timestamp = Date.now();
          // Create a new file name with the timestamp appended before the file extension
          const fileNameParts = file.name.split(".");
          const baseName = fileNameParts.slice(0, -1).join(".");
          const extension = fileNameParts.pop();
          const newFileName = `${baseName}-${timestamp}.${extension}`;
          const result = await uploadData({
            path: `profile-pictures/${newFileName}`,
            data: file,
            options: {
              contentType: file.type,
            },
          }).result;

          setData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              photoUrl: result?.path,
            },
          }));

          // Trigger auto-save after photo upload
          triggerAutoSave();
        } catch (error) {
          console.error("Error uploading profile picture: ", error);
          toast.error("Error uploading profile picture");
        } finally {
          setIsUploading(false);
        }
      } else {
        toast.error("Please upload a jpg, jpeg, or png file.");
      }
    }
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setData((prevData) => {
        const oldIndex = prevData.sections.findIndex(
          (section) => section.id === active.id
        );
        const newIndex = prevData.sections.findIndex(
          (section) => section.id === over.id
        );

        return {
          ...prevData,
          sections: arrayMove(prevData.sections, oldIndex, newIndex),
        };
      });

      // Trigger auto-save after reordering sections
      triggerAutoSave();
    }

    setActiveId(null);
  };

  const handleOpenAiModal = (
    section: string,
    itemId: string | null = null,
    sectionId: string | null = null
  ) => {
    if (localCredits > 0) {
      setAiModalSection(section);
      setAiModalItemId(itemId);
      setAiModalSectionId(sectionId);
      setAiModalOpen(true);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleCloseAiModal = () => {
    setAiModalOpen(false);
  };

  //       AI Processing Logic
  const handleAiContinue = (answers: Record<string, string>) => {
    setShowModalButtonText("Generating...");

    // Close the modal

    // Prepare the request body for the API
    const requestBody = {
      sectionName:
        aiModalSection === "personalInfo"
          ? "header"
          : aiModalSection === "keyAchievements"
          ? "achievements"
          : aiModalSection,
      questionAnswers: answers,
    };

    //   AI API------------------------------->
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/generate_resume_section`;

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch resume section content");
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Generated Resume Section:", responseData);

        const parsedData = responseData.sectionData[0];
        const parsedDataCertificate = responseData.sectionData;

        // Update state based on section type
        setData((prev) => {
          switch (aiModalSection) {
            case "personalInfo": {
              const newPersonalInfo = {
                ...prev.personalInfo,
                title:
                  [
                    parsedDataCertificate?.role,
                    parsedDataCertificate?.education,
                    parsedDataCertificate?.affiliation,
                  ]
                    .filter((attr) => attr && attr.trim())
                    .join(" | ") || prev.personalInfo.title,
              };
              return { ...prev, personalInfo: newPersonalInfo };
            }
            case "education": {
              const newEducation: Education = {
                id: aiModalItemId || Math.random().toString(36).substr(2, 9),
                institution: parsedData?.institution || "",
                location: parsedData?.location || "",
                degree: parsedData.degree || "",
                gpa: parsedData.gpa || "",
                startDate: parsedData.startDate || "",
                endDate: parsedData.endDate || "",
              };

              if (aiModalItemId) {
                // Update existing education entry
                return {
                  ...prev,
                  education: prev.education.map((edu) => {
                    console.log("AI ID", aiModalItemId, edu.id);
                    return edu.id === aiModalItemId ? newEducation : edu;
                  }),
                };
              } else {
                // Add new education entry
                return {
                  ...prev,
                  education: [...prev.education, newEducation],
                };
              }
            }

            case "experience": {
              const newExperience: Experience = {
                id: aiModalItemId || Math.random().toString(36).substr(2, 9),
                title: parsedData?.title || "",
                company: parsedData?.company || "",
                link: {
                  text: parsedData.link?.text || "",
                  url: parsedData.link?.url || "",
                },
                startDate: parsedData?.startDate || "",
                endDate: parsedData?.endDate || "",
                points: parsedData?.points || [""],
              };

              if (aiModalItemId) {
                // Update existing experience entry
                return {
                  ...prev,
                  experience: prev.experience.map((exp) =>
                    exp.id === aiModalItemId ? newExperience : exp
                  ),
                };
              } else {
                // Add new experience entry
                return {
                  ...prev,
                  experience: [...prev.experience, newExperience],
                };
              }
            }

            case "projects": {
              const newProject: Project = {
                id: aiModalItemId || Math.random().toString(36).substr(2, 9),
                title: parsedData.projectTitle || "",
                link: {
                  text: parsedData.link?.text || "",
                  url: parsedData.link?.url || "",
                },
                startDate: parsedData.startDate || "",
                endDate: parsedData.endDate || "",
                points: parsedData?.description
                  ? [parsedData.description]
                  : [""],
              };

              if (aiModalItemId) {
                // Update existing project entry
                return {
                  ...prev,
                  projects: prev.projects.map((proj) =>
                    proj.id === aiModalItemId ? newProject : proj
                  ),
                };
              } else {
                // Add new project entry
                return {
                  ...prev,
                  projects: [...prev.projects, newProject],
                };
              }
            }

            case "certificates": {
              const newCertificate: Certificate = {
                id: aiModalItemId || Math.random().toString(36).substr(2, 9),
                name: parsedDataCertificate?.name || "",
                link: {
                  text: parsedDataCertificate?.link?.text || "",
                  url: parsedDataCertificate?.link?.url || "",
                },
                date: parsedDataCertificate?.date || "",
                description: parsedDataCertificate?.description || "",
              };

              if (aiModalItemId) {
                // Update existing certificate entry

                return {
                  ...prev,
                  certificates: prev?.certificates?.map((cert) =>
                    cert.id === aiModalItemId ? newCertificate : cert
                  ),
                };
              } else {
                // Add new certificate entry
                return {
                  ...prev,
                  certificates: [...prev?.certificates, newCertificate],
                };
              }
            }

            case "summary": {
              const newSummary = {
                ...prev,
                summary: parsedData.summary || "",
              };

              return newSummary;
            }
            case "keyAchievements": {
              const newKeyAchievement = {
                id: aiModalItemId || Math.random().toString(36).substr(2, 9),
                title: parsedData?.title || "",
                description: parsedData?.description || "",
                icon: parsedData?.icon || "heart",
              };

              if (aiModalItemId) {
                // Update existing key achievement entry
                return {
                  ...prev,
                  keyAchievements: prev.keyAchievements.map((achievement) =>
                    achievement.id === aiModalItemId
                      ? newKeyAchievement
                      : achievement
                  ),
                };
              } else {
                // Add new key achievement entry
                return {
                  ...prev,
                  keyAchievements: [...prev.keyAchievements, newKeyAchievement],
                };
              }
            }

            default:
              toast.error("Unknown section type");
              return prev;
          }
        });

        // Subtract credits after content generation is successful
        const updatedCredits = localCredits - AI_GENERATION_CREDITS_SUBTRACTED;
        if (updatedCredits < 0) {
          toast.error("Not enough credits to generate content");
          return;
        }
        handleUpdateCredits(updatedCredits)
          .then(() => {
            setLocalCredits(updatedCredits);
          })
          .catch((error) => {
            console.error("Error updating credits:", error);
            toast.error("Failed to update credits after AI generation");
          });
        setAiModalOpen(false);
        setShowModalButtonText("Continue");
        // // Trigger auto-save after successful update
        // triggerAutoSave();
      })
      .catch((error) => {
        console.error("Error:", error);
        setShowModalButtonText("Continue");
        setAiModalOpen(false);
        toast.error(`Failed to process AI suggestions: ${error.message}`);
      });
  };

  const handleSectionVisibility = (sectionId: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, isVisible: !section.isVisible }
          : section
      ),
    }));

    // Trigger auto-save after changing section visibility
    triggerAutoSave();
  };

  const handleEditSectionTitle = (sectionId: string) => {
    setEditingTitle(sectionId);
  };

  const handleEditLink = (section: string, id: string) => {
    setEditingLink({ section, id });
  };

  const handleSaveLink = (section: string, id: string, link: Link) => {
    setData((prev: ResumeData) => ({
      ...prev,
      [section]: (prev[section as keyof ResumeData] as any).map((item: any) =>
        item.id === id ? { ...item, link } : item
      ),
    }));

    // Trigger auto-save after saving link
    triggerAutoSave();
  };

  const handleEdit = (
    section: string,
    id: string | null = null,
    sectionId: string | null = null
  ) => {
    setEditingSection(section);
    setEditingId(id);
    setEditingSectionId(sectionId);
  };

  const handleAdd = (section: string, sectionId: string | null = null) => {
    const newId = Math.random().toString(36).substr(2, 9);
    let newItem: any = { id: newId };

    switch (section) {
      case "education":
        newItem = {
          ...newItem,
          institution: "",
          location: "",
          degree: "",
          gpa: "",
          startDate: "",
          endDate: "",
        };
        break;
      case "experience":
        newItem = {
          ...newItem,
          title: "",
          company: "",
          link: { text: "", url: "" },
          startDate: "",
          endDate: "",
          points: [""],
        };
        break;
      case "projects":
        newItem = {
          ...newItem,
          title: "",
          link: { text: "", url: "" },
          startDate: "",
          endDate: "",
          points: [""],
        };
        break;
      case "certificates":
        newItem = {
          ...newItem,
          name: "",
          link: { text: "", url: "" },
          date: "",
          description: "",
        };
        break;
      case "languages":
        newItem = {
          ...newItem,
          name: "",
          level: "",
          proficiency: 3,
        };
        break;
      case "keyAchievements":
        newItem = {
          ...newItem,
          title: "",
          description: "",
          icon: "star",
        };
        break;
      case "skills":
        const newCategory = prompt("Enter new skill category name:");
        if (newCategory) {
          setData((prev) => ({
            ...prev,
            skills: {
              ...prev.skills,
              [newCategory.toLowerCase()]: [],
            },
          }));

          // Trigger auto-save after adding skill category
          triggerAutoSave();
        }
        return;
      case "customItem":
        if (sectionId) {
          const newCustomItem: CustomSectionItem = {
            id: newId,
            title: "",
            content: "",
          };
          setNewCustomItem({
            sectionId,
            item: newCustomItem,
          });
          setEditingSection("customItem");
          setEditingId(newId);
          setEditingSectionId(sectionId);
        }
        return;
      default:
        return;
    }

    setData((prev) => ({
      ...prev,
      [section]: [...(prev[section as keyof ResumeData] as any[]), newItem],
    }));
    setEditingSection(section);
    setEditingId(newId);

    // Trigger auto-save after adding new item
    triggerAutoSave();
  };

  const handleDelete = (
    section: string,
    id: string,
    sectionId: string | null = null
  ) => {
    if (section === "customItem" && sectionId) {
      setData((prev: ResumeData) => {
        const updatedCustomSections = prev.customSections.map(
          (customSection) => {
            if (customSection.id === sectionId) {
              return {
                ...customSection,
                items: customSection.items.filter((item) => item.id !== id),
              };
            }
            return customSection;
          }
        );
        return {
          ...prev,
          customSections: updatedCustomSections,
        };
      });
    } else if (section === "customSection") {
      setData((prev: ResumeData) => ({
        ...prev,
        customSections: prev.customSections.filter(
          (section) => section.id !== id
        ),
        sections: prev.sections.filter((section) => section.id !== id),
      }));
    } else {
      setData((prev: ResumeData) => {
        const updatedSection = { ...prev };
        if (Array.isArray(updatedSection[section as keyof ResumeData])) {
          (updatedSection[section as keyof ResumeData] as any) = (
            updatedSection[section as keyof ResumeData] as any[]
          ).filter((item: any) => item.id !== id);
        }
        return updatedSection;
      });
    }
    setEditingSection(null);
    setEditingId(null);
    setEditingSectionId(null);

    // Trigger auto-save after deleting item
    triggerAutoSave();
  };

  const handleSave = (section: string, newData: any) => {
    setData((prev) => ({
      ...prev,
      [section]: newData,
    }));

    // Trigger auto-save after saving section data
    triggerAutoSave();
  };

  const handleAddSection = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setNewCustomSection({
      id: newId,
      sectionTitle: "New Section",
      items: [],
    });
    setEditingSection("customSection");
    setEditingId(newId);
  };

  const handleCloseEdit = (confirm = false) => {
    if (newCustomSection && confirm && editingSection === "customSection") {
      if (!newCustomSection.sectionTitle.trim()) {
        toast.error("Section title cannot be empty");
        return;
      }

      const newSection: Section = {
        id: newCustomSection.id,
        title: newCustomSection.sectionTitle,
        isVisible: true,
        type: "customSection",
      };

      setData((prev) => ({
        ...prev,
        sections: [...prev.sections, newSection],
        customSections: [...prev.customSections, newCustomSection],
      }));
      setNewCustomSection(null);

      // Trigger auto-save after adding new section
      triggerAutoSave();
    } else if (newCustomItem && confirm && editingSection === "customItem") {
      if (!validateCustomItem(newCustomItem.item)) {
        return;
      }

      setData((prev: ResumeData) => {
        const updatedCustomSections = prev.customSections.map((section) => {
          if (section.id === newCustomItem.sectionId) {
            return {
              ...section,
              items: [...section.items, newCustomItem.item],
            };
          }
          return section;
        });
        return {
          ...prev,
          customSections: updatedCustomSections,
        };
      });
      setNewCustomItem(null);

      // Trigger auto-save after adding new custom item
      triggerAutoSave();
    } else if (editingSection && editingId && confirm) {
      // Validate the edited item before closing
      let isValid = true;

      switch (editingSection) {
        case "personalInfo":
          const personalInfo = data.personalInfo;
          isValid = validatePersonalInfo(personalInfo);
          break;

        case "education":
          const education = data.education.find((e) => e.id === editingId);
          if (education) {
            isValid = validateEducation(education);
          }
          break;
        case "experience":
          const experience = data.experience.find((e) => e.id === editingId);
          if (experience) {
            isValid = validateExperience(experience);
          }
          break;
        case "projects":
          const project = data.projects.find((p) => p.id === editingId);
          if (project) {
            isValid = validateProject(project);
          }
          break;
        case "certificates":
          const certificate = data.certificates.find((c) => c.id === editingId);
          if (certificate) {
            isValid = validateCertificate(certificate);
          }
          break;
        case "languages":
          const language = data.languages.find((l) => l.id === editingId);
          if (language) {
            isValid = validateLanguage(language);
          }
          break;
        case "keyAchievements":
          const achievement = data.keyAchievements.find(
            (a) => a.id === editingId
          );
          if (achievement) {
            isValid = validateKeyAchievement(achievement);
          }
          break;
        case "skills":
          isValid = validateSkills(data.skills);
          break;
        case "customItem":
          if (editingSectionId) {
            const customSection = data.customSections.find(
              (cs) => cs.id === editingSectionId
            );
            if (customSection) {
              const item = customSection.items.find((i) => i.id === editingId);
              if (item) {
                isValid = validateCustomItem(item);
              }
            }
          }
          break;
        case "personalInfo":
          isValid = validatePersonalInfo(data.personalInfo);
          break;
      }

      if (!isValid) {
        return;
      }

      // Trigger auto-save after closing edit
      triggerAutoSave();
    }

    setEditingSection(null);
    setEditingId(null);
    setEditingSectionId(null);
  };

  const renderSectionTitle = (section: Section) => (
    <div className="flex justify-between items-center mb-4 group relative">
      <DragHandle id={section.id} />
      <div className="flex-1">
        {editingTitle === section.id ? (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={section.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setData((prev) => ({
                  ...prev,
                  sections: prev.sections.map((s) =>
                    s.id === section.id ? { ...s, title: newTitle } : s
                  ),
                  // Also update the custom section title if this is a custom section
                  customSections:
                    section.type === "customSection"
                      ? prev.customSections.map((cs) =>
                          cs.id === section.id
                            ? { ...cs, sectionTitle: newTitle }
                            : cs
                        )
                      : prev.customSections,
                }));

                // Trigger auto-save after editing section title
                triggerAutoSave();
              }}
              className="w-full p-2 border rounded hover-border transition-colors duration-200 text-center font-bold text-lg"
              autoFocus
            />
            <button
              onClick={() => {
                if (!section.title.trim()) {
                  toast.error("Section title cannot be empty");
                  return;
                }
                setEditingTitle(null);

                // Trigger auto-save after saving section title
                triggerAutoSave();
              }}
              className="p-2 mr-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
          </div>
        ) : (
          <h2 className="text-lg font-bold text-[#00BFA6] uppercase border-b-[1.5px] border-[#00BFA6] pb-1">
            {section.title}
          </h2>
        )}
      </div>
      <div className="hidden group-hover:flex gap-2">
        {section.type !== "skills" && section.type !== "summary" && (
          <button
            onClick={() =>
              section.type === "customSection"
                ? handleAdd("customItem", section.id)
                : handleAdd(section.type)
            }
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        )}
        <button
          onClick={() => handleEditSectionTitle(section.id)}
          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
        >
          <Edit2 className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() =>
            section.type === "customSection"
              ? handleDelete("customSection", section.id)
              : handleSectionVisibility(section.id)
          }
          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );

  const renderLink = (link: Link, section: string, id: string) => {
    if (editingLink?.section === section && editingLink?.id === id) {
      return (
        <div className="inline-flex items-center gap-2">
          <input
            type="text"
            value={link.text}
            onChange={(e) => {
              const newLink = { ...link, text: e.target.value };
              handleSaveLink(section, id, newLink);
            }}
            className="w-20 p-2 border rounded hover-border transition-colors duration-200 text-blue-600"
          />
          <input
            type="text"
            value={link.url}
            onChange={(e) => {
              const newLink = { ...link, url: e.target.value };
              handleSaveLink(section, id, newLink);
            }}
            className="w-32 p-2 border rounded hover-border transition-colors duration-200"
            placeholder="URL"
          />
          <button
            onClick={() => {
              setEditingLink(null);
              // Trigger auto-save after editing link
              triggerAutoSave();
            }}
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
          >
            <Check className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={() => {
              handleSaveLink(section, id, { text: "", url: "" });
              setEditingLink(null);
              // Trigger auto-save after removing link
              triggerAutoSave();
            }}
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      );
    }

    return (
      <span className="inline-flex items-center gap-1">
        {link.text && link.url ? (
          <>
            <a href={link.url} className="text-[#00BFA6]  hover:underline">
              {link.text}
            </a>
            <button
              onClick={() => handleEditLink(section, id)}
              className="ml-2 p-2 hover:bg-gray-100 rounded opacity-0 group-hover/item:opacity-100"
            >
              <LinkIcon className="w-3 h-3 text-gray-600" />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleEditLink(section, id)}
            className="text-[#00BFA6] hover:underline opacity-0 group-hover/item:opacity-100"
          >
            Add link
          </button>
        )}
      </span>
    );
  };

  //<--------------------- Add AI button to individual items-------------------->
  const addAiButtonToItemControls = (
    section: string,
    itemId: string,
    sectionId: string | null = null,
    showDelete: boolean = true
  ) => (
    <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
      {section !== "customItem" && (
        <button
          onClick={() => handleOpenAiModal(section, itemId, sectionId)}
          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
        >
          <Sparkles className="w-4 h-4 text-[#356CB5]" />
        </button>
      )}

      <button
        onClick={() => handleEdit(section, itemId, sectionId)}
        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
      >
        <Edit2 className="w-4 h-4 text-gray-600" />
      </button>
      {showDelete && (
        <button
          onClick={() => handleDelete(section, itemId, sectionId)}
          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      )}
    </div>
  );

  const renderSection = (section: Section) => {
    switch (section.type) {
      case "education":
        return (
          <div className="group relative mb-6">
            {data.education.map((edu) => (
              <div
                key={edu.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-primary mb-3"
              >
                {addAiButtonToItemControls("education", edu.id)}
                {editingSection === "education" && editingId === edu.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEducation = data.education.map((item) =>
                          item.id === edu.id
                            ? { ...item, institution: e.target.value }
                            : item
                        );
                        handleSave("education", newEducation);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="Institution"
                    />
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => {
                        const newEducation = data.education.map((item) =>
                          item.id === edu.id
                            ? { ...item, location: e.target.value }
                            : item
                        );
                        handleSave("education", newEducation);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="Location"
                    />
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = data.education.map((item) =>
                            item.id === edu.id
                              ? { ...item, degree: e.target.value }
                              : item
                          );
                          handleSave("education", newEducation);
                        }}
                        className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="Degree"
                      />
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => {
                          const newEducation = data.education.map((item) =>
                            item.id === edu.id
                              ? { ...item, gpa: e.target.value }
                              : item
                          );
                          handleSave("education", newEducation);
                        }}
                        className="w-20 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="GPA"
                      />
                    </div>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => {
                          const newEducation = data.education.map((item) =>
                            item.id === edu.id
                              ? { ...item, startDate: e.target.value }
                              : item
                          );
                          handleSave("education", newEducation);
                        }}
                        className="max-w-full w-32 p-2  border rounded hover-border transition-colors duration-200"
                        placeholder="Start Date (MM/YYYY)"
                      />
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => {
                          const newEducation = data.education.map((item) =>
                            item.id === edu.id
                              ? { ...item, endDate: e.target.value }
                              : item
                          );
                          handleSave("education", newEducation);
                        }}
                        className="max-w-full  w-32 p-2 border  rounded hover-border transition-colors duration-200"
                        placeholder="End Date (MM/YYYY)"
                      />
                    </div>
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCloseEdit(true)}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-bold text-gray-800">{edu.degree}</div>
                    <div className="flex justify-between text-sm">
                      <div className="text-[#00BFA6]">{edu.institution}</div>
                      <div className="text-gray-600">{edu.location}</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {edu.startDate} - {edu.endDate}{" "}
                      <span>{edu.gpa && ` (GPA: ${edu.gpa})`} </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        );
      case "languages":
        return (
          <div className="group relative mb-6">
            {data.languages.map((lang) => (
              <div
                key={lang.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-primary mb-3"
              >
                <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
                  <button
                    onClick={() => handleEdit("languages", lang.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete("languages", lang.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                {editingSection === "languages" && editingId === lang.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={lang.name}
                      onChange={(e) => {
                        const newLanguages = data.languages.map((item) =>
                          item.id === lang.id
                            ? { ...item, name: e.target.value }
                            : item
                        );
                        handleSave("languages", newLanguages);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="Language"
                    />
                    <input
                      type="text"
                      value={lang.level}
                      onChange={(e) => {
                        const newLanguages = data.languages.map((item) =>
                          item.id === lang.id
                            ? { ...item, level: e.target.value }
                            : item
                        );
                        handleSave("languages", newLanguages);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="Level (e.g., Native, Advanced, Intermediate)"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Proficiency:</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={lang.proficiency}
                        onChange={(e) => {
                          const newLanguages = data.languages.map((item) =>
                            item.id === lang.id
                              ? {
                                  ...item,
                                  proficiency: Number.parseInt(e.target.value),
                                }
                              : item
                          );
                          handleSave("languages", newLanguages);
                        }}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCloseEdit(true)}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{lang.name}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {lang.level}
                      </span>
                      <ProficiencyDots level={lang.proficiency} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case "skills":
        return (
          <div className="group relative mb-6">
            {editingSection === "skills" ? (
              <div className="space-y-4" data-section="skills">
                {Object.entries(data.skills).map(([category, skills]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium capitalize">
                        {category}
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newSkills = { ...data.skills };
                            delete newSkills[category];
                            handleSave("skills", newSkills);
                          }}
                          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={skills.join(", ")}
                      onChange={(e) => {
                        const newSkills = {
                          ...data.skills,
                          [category]: e.target.value
                            .split(",")
                            .map((skill) => skill.trim())
                            .filter(Boolean),
                        };
                        handleSave("skills", newSkills);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      rows={3}
                      placeholder="Enter skills separated by commas"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleAdd("skills")}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <Plus className="w-4 h-4 text-primary" /> Add new skill
                  category
                </button>
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    onClick={() => handleCloseEdit(true)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {Object.entries(data.skills).map(([category, skills]) =>
                  skills.map((skill, index) => (
                    <div
                      key={`${category}-${index}`}
                      className="group/item relative hover-border-resume pl-1"
                    >
                      <span className="text-[15px] font-medium  border-b-[1.5px] border-gray-500">
                        {skill}
                      </span>
                    </div>
                  ))
                )}
                <button
                  onClick={() => handleEdit("skills")}
                  className="absolute top-0 right-0 p-2 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        );
      case "summary":
        return (
          <div className="group relative mb-6">
            {editingSection === "summary" ? (
              <div className="space-y-2">
                <textarea
                  value={data.summary}
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      summary: e.target.value,
                    }));

                    // Trigger auto-save after editing summary
                    triggerAutoSave();
                  }}
                  className="w-full p-2 border rounded hover-border transition-colors duration-200"
                  rows={4}
                  placeholder="Enter your professional summary"
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    onClick={() => handleCloseEdit(true)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="group/item relative hover-border-resume p-2">
                <p className="text-sm text-gray-700">{data.summary}</p>
                {addAiButtonToItemControls("summary", "", null, false)}
              </div>
            )}
          </div>
        );
      case "keyAchievements":
        return (
          <div className="group relative mb-6">
            {data.keyAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-primary mb-3"
              >
                {addAiButtonToItemControls("keyAchievements", achievement.id)}
                {editingSection === "keyAchievements" &&
                editingId === achievement.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={achievement.title}
                      onChange={(e) => {
                        const newAchievements = data.keyAchievements.map(
                          (item) =>
                            item.id === achievement.id
                              ? { ...item, title: e.target.value }
                              : item
                        );
                        handleSave("keyAchievements", newAchievements);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="Achievement Title"
                    />
                    <textarea
                      value={achievement.description}
                      onChange={(e) => {
                        const newAchievements = data.keyAchievements.map(
                          (item) =>
                            item.id === achievement.id
                              ? { ...item, description: e.target.value }
                              : item
                        );
                        handleSave("keyAchievements", newAchievements);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      rows={3}
                      placeholder="Achievement Description"
                    />
                    <select
                      value={achievement.icon}
                      onChange={(e) => {
                        const newAchievements = data.keyAchievements.map(
                          (item) =>
                            item.id === achievement.id
                              ? { ...item, icon: e.target.value }
                              : item
                        );
                        handleSave("keyAchievements", newAchievements);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                    >
                      <option value="star">Star</option>
                      <option value="trending-up">Trending Up</option>
                      <option value="pie-chart">Pie Chart</option>
                      <option value="heart">Heart</option>
                      <option value="award">Award</option>
                      <option value="zap">Lightning</option>
                    </select>
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCloseEdit(true)}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00BFA6]/20 flex items-center justify-center text-[#00BFA6]">
                      {achievement.icon === "star" && <span>★</span>}
                      {achievement.icon === "trending-up" && <span>↗</span>}
                      {achievement.icon === "pie-chart" && <span>◔</span>}
                      {achievement.icon === "heart" && <span>♥</span>}
                      {achievement.icon === "award" && <span>🏆</span>}
                      {achievement.icon === "zap" && <span>⚡</span>}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {achievement.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "experience":
      case "projects":
      case "certificates":
        return (
          <div className="group relative mb-6">
            {Array.isArray(data[section.type as keyof ResumeData]) &&
              (data[section.type as keyof ResumeData] as any[]).map(
                (item: any) => (
                  <div
                    key={item.id}
                    className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-primary mb-3"
                  >
                    {addAiButtonToItemControls(section.type, item.id)}
                    {editingSection === section.type &&
                    editingId === item.id ? (
                      <div
                        className="space-y-2"
                        data-section={section.type}
                        data-id={item.id}
                      >
                        <div className="flex gap-4">
                          {(section.type === "projects" ||
                            section.type === "experience") && (
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const newData = (
                                  data[
                                    section.type as keyof ResumeData
                                  ] as any[]
                                ).map((dataItem: any) =>
                                  dataItem.id === item.id
                                    ? {
                                        ...dataItem,
                                        title: e.target.value,
                                      }
                                    : dataItem
                                );
                                handleSave(section.type, newData);
                              }}
                              className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                              placeholder={"Title"}
                            />
                          )}
                          {section.type === "certificates" && (
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const newData = (
                                  data[
                                    section.type as keyof ResumeData
                                  ] as any[]
                                ).map((dataItem: any) =>
                                  dataItem.id === item.id
                                    ? {
                                        ...dataItem,
                                        name: e.target.value,
                                      }
                                    : dataItem
                                );
                                handleSave(section.type, newData);
                              }}
                              className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                              placeholder={"Name"}
                            />
                          )}
                          {section.type === "experience" && (
                            <input
                              type="text"
                              value={item.company}
                              onChange={(e) => {
                                const newData = (
                                  data[
                                    section.type as keyof ResumeData
                                  ] as any[]
                                ).map((dataItem: any) =>
                                  dataItem.id === item.id
                                    ? { ...dataItem, company: e.target.value }
                                    : dataItem
                                );
                                handleSave(section.type, newData);
                              }}
                              className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                              placeholder="Company"
                            />
                          )}
                        </div>

                        {(section.type === "projects" ||
                          section.type === "experience") && (
                          <div className="flex gap-4">
                            <input
                              type="text"
                              value={item.startDate}
                              placeholder="Start Date"
                              onChange={(e) => {
                                const newData = (
                                  data[
                                    section.type as keyof ResumeData
                                  ] as any[]
                                ).map((dataItem: any) =>
                                  dataItem.id === item.id
                                    ? { ...dataItem, startDate: e.target.value }
                                    : dataItem
                                );
                                handleSave(section.type, newData);
                              }}
                              className="w-32 p-2 border rounded hover-border transition-colors duration-200"
                            />
                            <input
                              type="text"
                              value={item.endDate}
                              placeholder="End Date"
                              onChange={(e) => {
                                const newData = (
                                  data[
                                    section.type as keyof ResumeData
                                  ] as any[]
                                ).map((dataItem: any) =>
                                  dataItem.id === item.id
                                    ? { ...dataItem, endDate: e.target.value }
                                    : dataItem
                                );
                                handleSave(section.type, newData);
                              }}
                              className="w-32 p-2 border rounded hover-border transition-colors duration-200"
                            />
                          </div>
                        )}

                        <div className="flex gap-2 items-center">
                          <span className="text-sm font-medium">Link:</span>
                          {renderLink(item.link, section.type, item.id)}
                        </div>

                        {(section.type === "projects" ||
                          section.type === "experience") && (
                          <textarea
                            value={item.points.join("\n")}
                            onChange={(e) => {
                              const newData = (
                                data[section.type as keyof ResumeData] as any[]
                              ).map((dataItem: any) =>
                                dataItem.id === item.id
                                  ? {
                                      ...dataItem,
                                      points: e.target.value.split("\n"), // Keep empty lines
                                    }
                                  : dataItem
                              );
                              handleSave(section.type, newData);
                            }}
                            className="w-full p-2 border rounded hover-border transition-colors duration-200"
                            rows={4}
                            placeholder="Enter points (one per line)"
                          />
                        )}
                        {section.type === "certificates" && (
                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              const newData = (
                                data[section.type as keyof ResumeData] as any[]
                              ).map((dataItem: any) =>
                                dataItem.id === item.id
                                  ? { ...dataItem, description: e.target.value }
                                  : dataItem
                              );
                              handleSave(section.type, newData);
                            }}
                            className="w-full p-2 border rounded hover-border transition-colors duration-200"
                            rows={4}
                            placeholder="Description"
                          />
                        )}
                        <div className="flex justify-end mt-2 space-x-2">
                          <button
                            onClick={() => handleCloseEdit(true)}
                            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {section.type === "experience" && (
                          <>
                            <div className="flex justify-between">
                              <div className="font-bold text-gray-800">
                                {item.title}
                              </div>
                              <div className="text-gray-600 text-sm">
                                {item.startDate} - {item.endDate}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <div className="text-[#00BFA6] mb-1">
                                {item.company}
                              </div>
                              {item?.link && item?.link?.url && "|"}
                              {item?.link && item?.link?.url && (
                                <a
                                  href={item?.link.url}
                                  className="text-[#26B6A5] hover:underline"
                                >
                                  {item?.link.text}
                                </a>
                              )}
                            </div>
                            <ul className="list-disc ml-5 mt-1 text-sm text-gray-700">
                              {item.points.map(
                                (point: string, index: number) => (
                                  <li key={index}>{point}</li>
                                )
                              )}
                            </ul>
                          </>
                        )}
                        {section.type === "projects" && (
                          <>
                            <div className="flex justify-between">
                              <div className="font-bold text-gray-800">
                                {item.title}
                                {(item.link.text || item.link.url) && " | "}
                                {renderLink(item.link, section.type, item.id)}
                              </div>
                              <div className="text-gray-600 text-sm">
                                {item.startDate} - {item.endDate}
                              </div>
                            </div>
                            <ul className="list-disc ml-5 mt-1 text-sm text-gray-700">
                              {item.points.map(
                                (point: string, index: number) => (
                                  <li key={index}>{point}</li>
                                )
                              )}
                            </ul>
                          </>
                        )}
                        {section.type === "certificates" && (
                          <>
                            <div className="font-bold text-gray-800">
                              {item.name}
                              {(item.link.text || item.link.url) && " | "}
                              {renderLink(item.link, section.type, item.id)}
                            </div>
                            <div className="text-sm text-gray-700 mt-1">
                              {item.description}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )
              )}
          </div>
        );
      case "customSection":
        const customSection = data.customSections.find(
          (cs) => cs.id === section.id
        );
        if (!customSection) return null;

        return (
          <div className="group relative mb-6">
            {/* Render existing items */}
            {customSection.items.map((item) => (
              <div
                key={item.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-primary mb-3"
              >
                <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
                  <button
                    onClick={() =>
                      handleEdit("customItem", item.id, section.id)
                    }
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete("customItem", item.id, section.id)
                    }
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                {editingSection === "customItem" &&
                editingId === item.id &&
                editingSectionId === section.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          customSections: prev.customSections.map((cs) =>
                            cs.id === section.id
                              ? {
                                  ...cs,
                                  items: cs.items.map((i) =>
                                    i.id === item.id
                                      ? { ...i, title: e.target.value }
                                      : i
                                  ),
                                }
                              : cs
                          ),
                        }));

                        // Trigger auto-save after editing custom item title
                        triggerAutoSave();
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="Title"
                    />
                    <textarea
                      value={item.content}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          customSections: prev.customSections.map((cs) =>
                            cs.id === section.id
                              ? {
                                  ...cs,
                                  items: cs.items.map((i) =>
                                    i.id === item.id
                                      ? { ...i, content: e.target.value }
                                      : i
                                  ),
                                }
                              : cs
                          ),
                        }));

                        // Trigger auto-save after editing custom item content
                        triggerAutoSave();
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      rows={4}
                      placeholder="Content"
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCloseEdit(true)}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {item.title && (
                      <div className="font-bold text-gray-800">
                        {item.title}
                      </div>
                    )}
                    {item.content && (
                      <div className="text-sm text-gray-700 mt-1">
                        {item.content}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Render new item being added */}
            {newCustomItem &&
              newCustomItem.sectionId === section.id &&
              editingSection === "customItem" &&
              editingId === newCustomItem.item.id && (
                <div className="space-y-2 p-2 border-2 border-dashed border-primary rounded-md">
                  <input
                    type="text"
                    value={newCustomItem.item.title}
                    onChange={(e) => {
                      setNewCustomItem({
                        ...newCustomItem,
                        item: {
                          ...newCustomItem.item,
                          title: e.target.value,
                        },
                      });
                    }}
                    className="w-full p-2 border rounded hover-border transition-colors duration-200"
                    placeholder="Title"
                  />
                  <textarea
                    value={newCustomItem.item.content}
                    onChange={(e) => {
                      setNewCustomItem({
                        ...newCustomItem,
                        item: {
                          ...newCustomItem.item,
                          content: e.target.value,
                        },
                      });
                    }}
                    className="w-full p-2 border rounded hover-border transition-colors duration-200"
                    rows={4}
                    placeholder="Content"
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button
                      onClick={() => handleCloseEdit(true)}
                      className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                </div>
              )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[850px] mx-auto p-8 bg-white mb-4 shadow-lg rounded-lg">
      <style jsx global>{`
        input:focus,
        textarea:focus {
          outline: none;
          border-color: #356cb5;
          box-shadow: 0 0 0 2px rgba(0, 191, 166, 0.2);
        }
        .hover-border:hover {
          border-color: #356cb5;
          border: 2px solid #356cb5;
        }
      `}</style>

      {/* Resume Preview */}
      <div className="mb-8 border-b pb-8">
        {/* Personal Info Section */}
        <div className="group relative mb-6">
          <div className="absolute hidden group-hover:flex gap-2 -right-4 -top-2">
            <button
              onClick={() => handleOpenAiModal("personalInfo", " ")}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <Sparkles className="w-4 h-4 text-[#356CB5]" />
            </button>
            <button
              onClick={() => {
                if (editingSection === "personalInfo") {
                  if (validatePersonalInfo(data.personalInfo)) {
                    // Trigger auto-save after saving personal info
                    triggerAutoSave();
                  } else {
                    toast.error("Name cannot be empty");
                    return;
                  }
                }

                setEditingSection(
                  editingSection === "personalInfo" ? null : "personalInfo"
                );
              }}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
            >
              {editingSection === "personalInfo" ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Edit2 className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
          {editingSection === "personalInfo" ? (
            <div className="space-y-4">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={data.personalInfo.name}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        name: e.target.value,
                      },
                    }))
                  }
                  className="w-full p-2 border rounded hover-border transition-colors duration-200 text-2xl font-bold"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={data.personalInfo.title}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        title: e.target.value,
                      },
                    }))
                  }
                  className="w-full p-2 border rounded hover-border transition-colors duration-200"
                  placeholder="Professional Title"
                />
              </div>
              <div className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full p-2 border rounded hover-border transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                {Object.entries(data.personalInfo.links).map(([key, link]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link.text}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            links: {
                              ...prev.personalInfo.links,
                              [key]: { ...link, text: e.target.value },
                            },
                          },
                        }))
                      }
                      className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="Link text"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            links: {
                              ...prev.personalInfo.links,
                              [key]: { ...link, url: e.target.value },
                            },
                          },
                        }))
                      }
                      className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="URL"
                    />
                    <button
                      onClick={() => {
                        setData((prev) => {
                          const newLinks = { ...prev.personalInfo.links };
                          delete newLinks[key];
                          return {
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              links: newLinks,
                            },
                          };
                        });

                        // Trigger auto-save after removing link
                        triggerAutoSave();
                      }}
                      className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900">
                  {data.personalInfo.name}
                </h1>
                <div className="mt-1 text-[#00BFA6] font-medium">
                  {data.personalInfo.title}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                  {Object.entries(data.personalInfo.links).map(
                    ([key, link]) => (
                      <div key={key} className="flex items-center gap-1">
                        {key === "email" && (
                          <Mail className="text-gray-500 size-4 " />
                        )}
                        {key === "linkedin" && (
                          <Linkedin className="text-gray-500 size-4 " />
                        )}
                        {key === "location" && (
                          <MapPin className="text-gray-500 size-4 " />
                        )}
                        {link.text}
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#00BFA6]">
                <img
                  src={showUploadedPhoto}
                  alt="Profile"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              {data.sections
                .filter(
                  (section) =>
                    section.isVisible &&
                    ["experience", "education", "languages"].includes(
                      section.type
                    )
                )
                .map((section) => (
                  <SortableItem key={section.id} id={section.id}>
                    <div className="group relative hover-border-resume p-2">
                      {renderSectionTitle(section)}
                      {renderSection(section)}
                    </div>
                  </SortableItem>
                ))}
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-primary">
                  {
                    data.sections.find((section) => section.id === activeId)
                      ?.title
                  }
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        <div className="space-y-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              {data.sections
                .filter(
                  (section) =>
                    section.isVisible &&
                    [
                      "summary",
                      "keyAchievements",
                      "skills",
                      "certificates",
                      "customSection",
                    ].includes(section.type)
                )
                .map((section) => (
                  <SortableItem key={section.id} id={section.id}>
                    <div className="group relative hover-border-resume p-2">
                      {renderSectionTitle(section)}
                      {renderSection(section)}
                    </div>
                  </SortableItem>
                ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* <---------------------------AI Modal Component--------------------------> */}
      <AiModal
        isOpen={aiModalOpen}
        onClose={handleCloseAiModal}
        onContinue={handleAiContinue}
        sectionTitle={aiModalSection}
        showModalButtonText={showModalButtonText}
        credits={localCredits}
        questions={
          AI_QUESTIONS[aiModalSection as keyof typeof AI_QUESTIONS] || []
        }
      />

      {/* New custom section being added */}
      {newCustomSection && editingSection === "customSection" && (
        <div className="space-y-2 p-4 border-2 border-primary rounded-md my-6">
          <input
            type="text"
            value={newCustomSection.sectionTitle}
            onChange={(e) => {
              setNewCustomSection({
                ...newCustomSection,
                sectionTitle: e.target.value,
              });
            }}
            className="w-full p-2 border rounded hover-border transition-colors duration-200 text-xl font-bold"
            placeholder="Section Title"
          />
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => handleCloseEdit(true)}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
          </div>
        </div>
      )}

      {/* Add New Section button */}
      <div className="relative mt-8 pt-6 border-t border-gray-300">
        <button
          onClick={handleAddSection}
          className="absolute left-1/2 top-0 text-primary transform -translate-x-1/2 -translate-y-1/2 bg-[#E6F7F5] px-4 py-2 flex items-center gap-2 text-sm hover:text-primary/90 border border-primary rounded-full shadow-sm hover:shadow transition-all duration-200"
        >
          <Plus className="w-5 h-5 text-primary" />
          Add New Section
        </button>
      </div>

      {/* Auto-save indicator */}
      {!isUploading && pendingSave && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving changes...</span>
        </div>
      )}
      {isUploading && !pendingSave && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading Picture...</span>
        </div>
      )}

      {/*   FOR SHOWING UPGRADE MODAL */}
      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  );
}
