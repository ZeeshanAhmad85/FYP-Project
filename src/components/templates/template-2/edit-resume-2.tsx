"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  Check,
  LinkIcon,
  X,
  ArrowUpDown,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  ExternalLink,
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

import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

import type { ResumeData, Section, Link } from "./data";
import AiModal from "../ai-modal";
import { handleUpdateCredits } from "@/lib/cognitoActions";
import { AI_GENERATION_CREDITS_SUBTRACTED } from "@/constants/constants";
import UpgradeModal from "@/components/shared/upgrade-plan-modal";

// Add these props to the EditResume component
interface EditResumeProps {
  onDataChange?: (data: any) => void;
  initialResumeData: any;
  onSuccessfulEdit?: (autoSave: boolean) => Promise<any>;
  resumeId?: string | null;
  localCredits: number;
  setLocalCredits: (credits: number) => void;
}

const validatePersonalInfo = (personalInfo: any): boolean => {
  if (!personalInfo.name.trim()) {
    toast.error("Name cannot be empty");
    return false;
  }
  return true;
};

const MAX_CONTENT_LENGTH = 500; // Maximum character length for content fields

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
};

const DragHandle = ({ id }: any) => {
  const { attributes, listeners } = useSortable({ id });

  return (
    <div
      className="absolute left-1/2 -top-3 rounded-md transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move bg-[#E6F7F5] p-1"
      {...attributes}
      {...listeners}
    >
      <ArrowUpDown className="w-5 h-5 text-primary" />
    </div>
  );
};

const SortableItem = ({ id, children }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

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

export default function EditResume({
  onDataChange,
  initialResumeData,
  onSuccessfulEdit,
  resumeId,
  localCredits,
  setLocalCredits,
}: EditResumeProps) {
  // Initialize with initialResumeData instead of initialData
  const [data, setData] = useState(initialResumeData);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<{
    section: string;
    id: string;
  } | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingCustomSection, setEditingCustomSection] = useState<
    string | null
  >(null);
  const [isAddingCustomItem, setIsAddingCustomItem] = useState(false);
  const [activeId, setActiveId] = useState(null);

  // AI Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalSection, setAiModalSection] = useState<string>("");
  const [aiModalSectionId, setAiModalSectionId] = useState<string | null>(null);
  const [aiModalItemId, setAiModalItemId] = useState<string | null>(null);

  const [showModalButtonText, setShowModalButtonText] = useState("Continue");

  // Add state for auto-save functionality
  const [pendingSave, setPendingSave] = useState(false);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setData((prevData: any) => {
        const oldIndex = prevData.sections.findIndex(
          (section: any) => section.id === active.id
        );
        const newIndex = prevData.sections.findIndex(
          (section: any) => section.id === over.id
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
      // Proceed with opening the AI modal
      setAiModalSection(section);
      setAiModalItemId(itemId);
      setAiModalSectionId(sectionId);
      setAiModalOpen(true);
    } else {
      // Show upgrade modal or prompt to buy credits
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
        aiModalSection === "personalInfo" ? "header" : aiModalSection,
      questionAnswers: answers,
    };

    console.log("AI Request Body:", JSON.stringify(requestBody));

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
        setData((prev: any) => {
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
              const newEducation = {
                id: aiModalItemId || Math.random().toString(36).substr(2, 9),
                institution: parsedData.institution || "",
                location: parsedData.location || "",
                degree: parsedData.degree || "",
                gpa: parsedData.gpa || "",
                startDate: parsedData.startDate || "",
                endDate: parsedData.endDate || "",
              };

              console.log("AI ID", aiModalItemId);
              if (aiModalItemId) {
                // Update existing education entry
                return {
                  ...prev,
                  education: prev.education.map((edu: any) => {
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
              const newExperience = {
                id: aiModalItemId || Math.random().toString(36).substr(2, 9),
                title: parsedData.title || "",
                company: parsedData.company || "",
                link: {
                  text: parsedData.link?.text || "",
                  url: parsedData.link?.url || "",
                },
                startDate: parsedData.startDate || "",
                endDate: parsedData.endDate || "",
                points: parsedData.points || [""],
              };

              if (aiModalItemId) {
                // Update existing experience entry
                return {
                  ...prev,
                  experience: prev.experience.map((exp: any) =>
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
              const newProject = {
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
                  projects: prev.projects.map((proj: any) =>
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
              const newCertificate = {
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
                  certificates: prev?.certificates?.map((cert: any) =>
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

            case "skills": {
              // Assuming API returns { category: string, skills: string[] }
              const category =
                responseData.category?.toLowerCase() || "general";
              const skills = responseData.skills || [];

              if (!skills.length) {
                toast.error("No skills provided by AI");
                return prev;
              }

              const newSkills = {
                ...prev.skills,
                [category]: skills,
              };

              return {
                ...prev,
                skills: newSkills,
              };
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
    setData((prev: any) => ({
      ...prev,
      sections: prev.sections.map((section: any) =>
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
    setData((prev: any) => ({
      ...prev,
      [section]: prev[section].map((item: any) =>
        item.id === id ? { ...item, link } : item
      ),
    }));

    // Trigger auto-save after saving link
    triggerAutoSave();
  };

  const handleEdit = (section: string, id: string | null = null) => {
    setEditingSection(section);
    setEditingId(id);
  };

  const handleAdd = (section: string) => {
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
          duration: "",
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
          duration: "",
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
      case "skills":
        const newCategory = prompt("Enter new skill category name:");
        if (newCategory) {
          setData((prev: any) => ({
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
      case "custom":
        newItem = {
          ...newItem,
          title: "",
          content: "",
        };
        break;
      default:
        return;
    }

    setData((prev: any) => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
    setEditingSection(section);
    setEditingId(newId);

    // Trigger auto-save after adding new item
    triggerAutoSave();
  };

  const handleDelete = (section: string, id: string) => {
    setData((prev: any) => {
      const updatedSection = { ...prev };
      if (Array.isArray(updatedSection[section])) {
        updatedSection[section] = updatedSection[section].filter(
          (item: any) => item.id !== id
        );
      }
      return updatedSection;
    });
    setEditingSection(null);
    setEditingId(null);

    // Trigger auto-save after deleting item
    triggerAutoSave();
  };

  const handleSave = (section: string, newData: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: newData,
    }));

    // Trigger auto-save after saving section data
    triggerAutoSave();
  };

  const handleAddSection = () => {
    setIsAddingSection(true);
    setNewSectionTitle("");
  };

  const handleSaveNewSection = () => {
    if (!newSectionTitle.trim()) {
      toast.error("Section title cannot be empty");
      return;
    }

    if (newSectionTitle.length > 50) {
      toast.error("Section title is too long (maximum 50 characters)");
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newSection: Section = {
      id: newId,
      title: newSectionTitle,
      isVisible: true,
      type: "customSection",
    };

    setData((prev: any) => ({
      ...prev,
      sections: [...prev.sections, newSection],
      customSections: [
        ...prev.customSections,
        {
          id: newId,
          sectionTitle: newSectionTitle,
          items: [],
        },
      ],
    }));

    setNewSectionTitle("");
    setIsAddingSection(false);
    setEditingCustomSection(newId);

    // Trigger auto-save after adding new section
    triggerAutoSave();
  };

  const handleAddCustomItem = (sectionId: string) => {
    if (!editingCustomSection) {
      setEditingCustomSection(sectionId);
    }

    setIsAddingCustomItem(true);
  };

  const handleSaveCustomItem = (
    sectionId: string,
    title: string,
    content: string
  ) => {
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return false;
    }

    if (!content.trim()) {
      toast.error("Content cannot be empty");
      return false;
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      toast.error(
        `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`
      );
      return false;
    }

    const newItemId = Math.random().toString(36).substr(2, 9);

    setData((prev: any) => ({
      ...prev,
      customSections: prev.customSections.map((section: any) =>
        section.id === sectionId
          ? {
              ...section,
              items: [
                ...section.items,
                {
                  id: newItemId,
                  title,
                  content,
                },
              ],
            }
          : section
      ),
    }));

    setIsAddingCustomItem(false);

    // Trigger auto-save after saving custom item
    triggerAutoSave();

    return true;
  };

  const handleCloseEdit = () => {
    // Validate fields based on the current editing section
    if (editingSection === "education" && editingId) {
      const edu = data.education.find((item: any) => item.id === editingId);
      if (edu && !edu.institution.trim()) {
        toast.error("Institution name cannot be empty");
        return;
      }
    } else if (editingSection === "experience" && editingId) {
      const exp = data.experience.find((item: any) => item.id === editingId);
      if (exp) {
        if (!exp.title.trim()) {
          toast.error("Title cannot be empty");
          return;
        }
        if (!exp.company.trim()) {
          toast.error("Company name cannot be empty");
          return;
        }
      }
    } else if (editingSection === "projects" && editingId) {
      const proj = data.projects.find((item: any) => item.id === editingId);
      if (proj && !proj.title.trim()) {
        toast.error("Project title cannot be empty");
        return;
      }
    } else if (editingSection === "certificates" && editingId) {
      const cert = data.certificates.find((item: any) => item.id === editingId);
      if (cert && !cert.name.trim()) {
        toast.error("Certificate name cannot be empty");
        return;
      }
    }

    setEditingSection(null);
    setEditingId(null);

    // Trigger auto-save after closing edit
    triggerAutoSave();
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
                setData((prev: any) => ({
                  ...prev,
                  sections: prev.sections.map((s: any) =>
                    s.id === section.id ? { ...s, title: newTitle } : s
                  ),
                }));
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

                // Trigger auto-save after editing section title
                triggerAutoSave();
              }}
              className="p-2 mr-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
          </div>
        ) : (
          <h2 className="text-lg font-bold text-[#26B6A5] uppercase border-b-2 border-[#26B6A5] pb-1 inline-block">
            {section.title}
          </h2>
        )}
      </div>
      <div className="hidden group-hover:flex gap-2">
        {section.type === "customSection" ? (
          <button
            onClick={() => handleAddCustomItem(section.id)}
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 text-primary" />
          </button>
        ) : (
          section.type !== "skills" && (
            <button
              onClick={() => handleAdd(section.type)}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 text-primary" />
            </button>
          )
        )}
        <button
          onClick={() => handleEditSectionTitle(section.id)}
          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
        >
          <Edit2 className="w-4 h-4 text-primary" />
        </button>
        <button
          onClick={() => handleSectionVisibility(section.id)}
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
            value={link?.text}
            onChange={(e) => {
              const newLink = { ...link, text: e.target.value };
              handleSaveLink(section, id, newLink);
            }}
            className="w-20 p-2 border rounded hover-border transition-colors duration-200 text-[#26B6A5]"
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
            <a href={link.url} className="text-[#26B6A5] hover:underline">
              <ExternalLink className=" w-5 h-5 text-[#26B6A5] hover:underline" />
            </a>
            <button
              onClick={() => handleEditLink(section, id)}
              className="ml-2 p-2 hover:bg-gray-100 rounded opacity-0 group-hover/item:opacity-100"
            >
              <LinkIcon className="w-3 h-3 text-[#26B6A5]" />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleEditLink(section, id)}
            className="text-[#26B6A5] hover:underline opacity-0 group-hover/item:opacity-100"
          >
            Add link
          </button>
        )}
      </span>
    );
  };

  //<--------------------- Add AI button to individual items-------------------->
  const addAiButtonToItemControls = (section: string, itemId: string) => (
    <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
      {section !== "customItem" && (
        <button
          onClick={() => handleOpenAiModal(section, itemId)}
          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
        >
          <Sparkles className="w-4 h-4 text-[#356CB5]" />
        </button>
      )}
      <button
        onClick={() => handleEdit(section, itemId)}
        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
      >
        <Edit2 className="w-4 h-4 text-gray-600" />
      </button>
      <button
        onClick={() => handleDelete(section, itemId)}
        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </button>
    </div>
  );

  const renderSection = (section: Section) => {
    switch (section.type) {
      case "education":
        return (
          <div className="group relative mb-6">
            {data.education.map((edu: any) => (
              <div
                key={edu.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-primary"
              >
                {addAiButtonToItemControls("education", edu.id)}
                {editingSection === "education" && editingId === edu.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEducation = data.education.map((item: any) =>
                          item.id === edu.id
                            ? { ...item, institution: e.target.value }
                            : item
                        );
                        handleSave("education", newEducation);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="Institution"
                    />
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = data.education.map((item: any) =>
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
                          const newEducation = data.education.map((item: any) =>
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
                        type="date"
                        value={edu.startDate}
                        onChange={(e) => {
                          const newEducation = data.education.map((item: any) =>
                            item.id === edu.id
                              ? { ...item, startDate: e.target.value }
                              : item
                          );
                          handleSave("education", newEducation);
                        }}
                        className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="Start Date"
                      />
                      <input
                        type="date"
                        value={edu.endDate}
                        onChange={(e) => {
                          const newEducation = data.education.map((item: any) =>
                            item.id === edu.id
                              ? { ...item, endDate: e.target.value }
                              : item
                          );
                          handleSave("education", newEducation);
                        }}
                        className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="End Date"
                      />
                    </div>
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCloseEdit()}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <div className="font-bold">{edu.institution}</div>
                      {edu.startDate && (
                        <div className="text-right">
                          {formatDate(edu.startDate)} -{" "}
                          {formatDate(edu.endDate)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm">
                      {edu.degree && <span>{edu.degree}</span>}{" "}
                      {edu.gpa && <span>- GPA: {edu.gpa}</span>}
                    </div>
                  </>
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
                      value={
                        Array.isArray(skills)
                          ? skills.join(", ")
                          : (skills as
                              | string
                              | number
                              | readonly string[]
                              | undefined)
                      }
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
                  className="flex items-center gap-2 text-[#26B6A5] hover:text-[#1a8a7c]"
                >
                  <Plus className="w-4 h-4" /> Add new skill category
                </button>
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    onClick={() => handleCloseEdit()}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </div>
            ) : (
              <ul className="list-disc ml-5 space-y-1">
                {Object.entries(data.skills).map(([category, skills]) => (
                  <li
                    key={category}
                    className="group/item relative hover-border-resume pl-1"
                  >
                    <span className="font-bold capitalize">{category}:</span>{" "}
                    {(skills as string[]).join(", ")}
                    <button
                      onClick={() => handleEdit("skills")}
                      className="ml-2 p-2 hover:bg-gray-100 rounded opacity-0 group-hover/item:opacity-100"
                    >
                      <Edit2 className="w-4 h-4 text-primary" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case "experience":
      case "projects":
        return (
          <div className="group relative mb-6">
            {data[section.type].map((item: any) => (
              <div
                key={item.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-primary mb-4"
              >
                {addAiButtonToItemControls(section.type, item.id)}
                {editingSection === section.type && editingId === item.id ? (
                  <div
                    className="space-y-2"
                    data-section={section.type}
                    data-id={item.id}
                  >
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const newData = (
                            data[section.type as keyof ResumeData] as any[]
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
                      {section.type === "experience" && (
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => {
                            const newData = (
                              data[section.type as keyof ResumeData] as any[]
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
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium">Link:</span>
                      {renderLink(item.link, section.type, item.id)}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1">
                      <input
                        type="date"
                        value={item.startDate}
                        onChange={(e) => {
                          const newData = (
                            data[section.type as keyof ResumeData] as any[]
                          ).map((dataItem: any) =>
                            dataItem.id === item.id
                              ? { ...dataItem, startDate: e.target.value }
                              : dataItem
                          );
                          handleSave(section.type, newData);
                        }}
                        className="w-full sm:w-1/2 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="StartDate"
                      />
                      <input
                        type="date"
                        value={item.endDate}
                        onChange={(e) => {
                          const newData = (
                            data[section.type as keyof ResumeData] as any[]
                          ).map((dataItem: any) =>
                            dataItem.id === item.id
                              ? { ...dataItem, endDate: e.target.value }
                              : dataItem
                          );
                          handleSave(section.type, newData);
                        }}
                        className="w-full sm:w-1/2 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="EndDate"
                      />
                    </div>
                    {item.points && (
                      <textarea
                        value={item.points.join("\n")}
                        onChange={(e) => {
                          const points = e.target.value.split("\n");

                          // Check if any point exceeds the maximum length
                          const exceedsMaxLength = points.some(
                            (point) => point.length > MAX_CONTENT_LENGTH
                          );
                          if (exceedsMaxLength) {
                            toast.error(
                              `One or more points exceed maximum length of ${MAX_CONTENT_LENGTH} characters`
                            );
                            return;
                          }

                          const newData = (
                            data[section.type as keyof ResumeData] as any[]
                          ).map((dataItem: any) =>
                            dataItem.id === item.id
                              ? {
                                  ...dataItem,
                                  points: points, // Keep empty lines
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
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => {
                          // Validate required fields
                          if (section.type === "experience") {
                            if (!item.title.trim()) {
                              toast.error("Title cannot be empty");
                              return;
                            }
                            if (!item.company.trim()) {
                              toast.error("Company cannot be empty");
                              return;
                            }
                          } else if (section.type === "projects") {
                            if (!item.title.trim()) {
                              toast.error("Project title cannot be empty");
                              return;
                            }
                          }

                          // Validate points
                          if (item.points && item.points.length > 0) {
                            const emptyPoints = item.points.every(
                              (point: any) => !point.trim()
                            );
                            if (emptyPoints) {
                              toast.error("Please add at least one point");
                              return;
                            }
                          }

                          handleCloseEdit();
                        }}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="font-bold flex items-center">
                        {section.type === "experience" ? (
                          <>{item.title}</>
                        ) : (
                          <>
                            {item.title}
                            {item.link.text && (
                              <span className="ml-2 inline-flex items-center">
                                {renderLink(item.link, section.type, item.id)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="text-right">
                        {formatDate(item.startDate)} -{" "}
                        {formatDate(item.endDate)}
                      </div>
                    </div>
                    {section.type === "experience" && (
                      <div className="text-sm">{item.company}</div>
                    )}
                    {item.points && (
                      <ul className="list-disc ml-5 mt-1">
                        {item.points.map((point: string, index: number) => (
                          <li key={index} className="text-sm">
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.description && (
                      <div className="text-sm mt-1">{item.description}</div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        );
      case "certificates":
        return (
          <div className="group relative mb-6">
            {data.certificates.map((item: any) => (
              <div
                key={item.id}
                className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-primary"
              >
                {addAiButtonToItemControls("certificates", item.id)}
                {editingSection === "certificates" && editingId === item.id ? (
                  <div
                    className="space-y-2"
                    data-section="certificates"
                    data-id={item.id}
                  >
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const newData = data.certificates.map((cert: any) =>
                            cert.id === item.id
                              ? { ...cert, name: e.target.value }
                              : cert
                          );
                          handleSave("certificates", newData);
                        }}
                        className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="Certificate Name"
                      />
                      <input
                        type="date"
                        value={item.date}
                        onChange={(e) => {
                          const newData = data.certificates.map((cert: any) =>
                            cert.id === item.id
                              ? { ...cert, date: e.target.value }
                              : cert
                          );
                          handleSave("certificates", newData);
                        }}
                        className="w-32 p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="Date"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium">Link:</span>
                      {renderLink(item.link, "certificates", item.id)}
                    </div>
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const newData = data.certificates.map((cert: any) =>
                          cert.id === item.id
                            ? { ...cert, description: e.target.value }
                            : cert
                        );
                        handleSave("certificates", newData);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      rows={4}
                      placeholder="Description"
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCloseEdit()}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <div className="font-bold">
                        {item.name}
                        {item.link.text && (
                          <span className="ml-2">
                            {renderLink(item.link, "certificates", item.id)}
                          </span>
                        )}
                      </div>
                      <div>{formatDate(item.date)}</div>
                    </div>
                    {item.description && (
                      <div className="text-sm mt-1">{item.description}</div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        );
      case "custom":
        return (
          <div className="group relative mb-6">
            {data.custom.map((item: any) => (
              <div key={item.id} className="group/item relative p-2 ">
                <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
                  <button
                    onClick={() => handleEdit("custom", item.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 text-primary" />
                  </button>
                  <button
                    onClick={() => handleDelete("custom", item.id)}
                    className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                {editingSection === "custom" && editingId === item.id ? (
                  <div
                    className="space-y-2"
                    data-section="custom"
                    data-id={item.id}
                  >
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newCustom = data.custom.map((customItem: any) =>
                          customItem.id === item.id
                            ? { ...customItem, title: e.target.value }
                            : customItem
                        );
                        handleSave("custom", newCustom);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      placeholder="Title"
                    />
                    <textarea
                      value={item.content}
                      onChange={(e) => {
                        const newCustom = data.custom.map((customItem: any) =>
                          customItem.id === item.id
                            ? { ...customItem, content: e.target.value }
                            : customItem
                        );
                        handleSave("custom", newCustom);
                      }}
                      className="w-full p-2 border rounded hover-border transition-colors duration-200"
                      rows={4}
                      placeholder="Content"
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleCloseEdit()}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-bold">{item.title}</div>
                    <div className="text-sm mt-1">{item.content}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        );
      case "customSection":
        const customSection = data.customSections.find(
          (cs: any) => cs.id === section.id
        );
        return (
          <div className="group relative mb-6">
            {customSection && (
              <>
                {customSection.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="group/item relative p-2 rounded-md transition-all duration-200 border-2 border-transparent hover:border-primary mb-4"
                  >
                    <div className="absolute hidden group-hover/item:flex gap-2 -right-4 top-0">
                      <button
                        onClick={() => {
                          setEditingCustomSection(customSection.id);
                          setEditingId(item.id);
                        }}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => {
                          setData((prev: any) => ({
                            ...prev,
                            customSections: prev.customSections.map((cs: any) =>
                              cs.id === customSection.id
                                ? {
                                    ...cs,
                                    items: cs.items.filter(
                                      (i: any) => i.id !== item.id
                                    ),
                                  }
                                : cs
                            ),
                          }));
                          // Trigger auto-save after deleting custom item
                          triggerAutoSave();
                        }}
                        className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                    {editingCustomSection === customSection.id &&
                    editingId === item.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            setData((prev: any) => ({
                              ...prev,
                              customSections: prev.customSections.map(
                                (cs: any) =>
                                  cs.id === customSection.id
                                    ? {
                                        ...cs,
                                        items: cs.items.map((i: any) =>
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
                            setData((prev: any) => ({
                              ...prev,
                              customSections: prev.customSections.map(
                                (cs: any) =>
                                  cs.id === customSection.id
                                    ? {
                                        ...cs,
                                        items: cs.items.map((i: any) =>
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
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>
                            {item.content.length} / {MAX_CONTENT_LENGTH}{" "}
                            characters
                          </span>
                        </div>
                        <div className="flex justify-end mt-2 space-x-2">
                          <button
                            onClick={() => {
                              if (!item.title.trim()) {
                                toast.error("Title cannot be empty");
                                return;
                              }
                              if (!item.content.trim()) {
                                toast.error("Content cannot be empty");
                                return;
                              }
                              if (item.content.length > MAX_CONTENT_LENGTH) {
                                toast.error(
                                  `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`
                                );
                                return;
                              }
                              setEditingCustomSection(null);
                              setEditingId(null);
                              // Trigger auto-save after saving custom item
                              triggerAutoSave();
                            }}
                            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="font-bold">{item.title}</div>
                        <div className="text-sm mt-1">{item.content}</div>
                      </>
                    )}
                  </div>
                ))}

                {editingCustomSection === customSection.id &&
                isAddingCustomItem ? (
                  <div className="p-2 border-2 border-dashed border-primary rounded-md mb-4">
                    <div className="space-y-2">
                      <input
                        type="text"
                        id="new-item-title"
                        className="w-full p-2 border rounded hover-border transition-colors duration-200"
                        placeholder="Title"
                      />
                      <textarea
                        id="new-item-content"
                        className="w-full p-2 border rounded hover-border transition-colors duration-200"
                        rows={4}
                        placeholder="Content"
                      />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          onClick={() => {
                            const titleEl = document.getElementById(
                              "new-item-title"
                            ) as HTMLInputElement;
                            const contentEl = document.getElementById(
                              "new-item-content"
                            ) as HTMLTextAreaElement;

                            if (
                              handleSaveCustomItem(
                                customSection.id,
                                titleEl.value,
                                contentEl.value
                              )
                            ) {
                              titleEl.value = "";
                              contentEl.value = "";
                            }
                          }}
                          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddCustomItem(customSection.id)}
                    className="flex items-center gap-2 text-[#26B6A5] hover:text-[#1a8a7c] mb-4"
                  >
                    <Plus className="w-4 h-4" /> Add new item
                  </button>
                )}
              </>
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
          box-shadow: 0 0 0 2px rgba(38, 182, 165, 0.2);
        }
        .hover-border:hover {
          border-color: #356cb5;
          border: 2px solid #356cb5;
        }
      `}</style>
      {/* Personal Info Section */}
      <div className="group relative mb-8">
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
                  toast.error("Title cannot be empty");
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
              <Edit2 className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>
        {editingSection === "personalInfo" ? (
          <div className="space-y-4">
            <input
              type="text"
              value={data.personalInfo.name}
              onChange={(e) =>
                setData((prev: any) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, name: e.target.value },
                }))
              }
              className="w-full p-2 border rounded hover-border transition-colors duration-200 text-2xl font-bold"
              placeholder="Name"
            />
            <input
              type="text"
              value={data.personalInfo.title}
              onChange={(e) =>
                setData((prev: any) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, title: e.target.value },
                }))
              }
              className="w-full p-2 border rounded hover-border transition-colors duration-200"
              placeholder="Title/Position"
            />
            <div className="space-y-2">
              {Object.entries(data.personalInfo.links).map(([key, link]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={(link as Link).text}
                    onChange={(e) =>
                      setData((prev: any) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          links: {
                            ...prev.personalInfo.links,
                            [key]: {
                              ...(typeof link === "object" && link ? link : {}),
                              text: e.target.value,
                            },
                          },
                        },
                      }))
                    }
                    className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                    placeholder="Link text"
                  />
                  <input
                    type="text"
                    value={(link as Link)?.url || ""}
                    onChange={(e) =>
                      setData((prev: any) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          links: {
                            ...prev.personalInfo.links,
                            [key]: { ...(link || {}), url: e.target.value },
                          },
                        },
                      }))
                    }
                    className="flex-1 p-2 border rounded hover-border transition-colors duration-200"
                    placeholder="URL"
                  />
                  <button
                    onClick={() => {
                      setData((prev: any) => {
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
                      // Trigger auto-save after removing a link
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
          <div className="hover-border-resume p-2">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
              {data.personalInfo.name}
            </h1>
            <p className="text-center text-sm mb-4">
              {data.personalInfo.title}
            </p>
            <div className="flex justify-center gap-4 text-sm">
              {data.personalInfo.links.email && (
                <div className="flex items-center gap-1 text-[#26B6A5]">
                  <Mail className="w-4 h-4" />
                  <a
                    href={`mailto:${data.personalInfo.links.email.url}`}
                    className="hover:underline"
                  >
                    {data.personalInfo.links.email.text}
                  </a>
                </div>
              )}
              {data.personalInfo.links.phone && (
                <div className="flex items-center gap-1 text-[#26B6A5]">
                  <Phone className="w-4 h-4" />
                  <a
                    href={`tel:${data.personalInfo.links.phone.url}`}
                    className="hover:underline"
                  >
                    {data.personalInfo.links.phone.text}
                  </a>
                </div>
              )}
              {data.personalInfo.links.location && (
                <div className="flex items-center gap-1 text-[#26B6A5]">
                  <MapPin className="w-4 h-4" />
                  <span>{data.personalInfo.links.location.text}</span>
                </div>
              )}
              {data.personalInfo.links.linkedin && (
                <div className="flex items-center gap-1 text-[#26B6A5]">
                  <Linkedin className="w-4 h-4" />
                  <a
                    href={`https://linkedin.com/in/${data.personalInfo.links.linkedin.url}`}
                    className="hover:underline"
                  >
                    {data.personalInfo.links.linkedin.text}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.sections.map((section: any) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          {data.sections.map(
            (section: any, index: any) =>
              section.isVisible && (
                <SortableItem key={section.id} id={section.id}>
                  <div className="group relative mb-4 hover-border-resume p-2">
                    {renderSectionTitle(section)}
                    {renderSection(section)}
                  </div>
                  {index < data.sections.length - 1 && (
                    <hr className="border-t border-gray-200 my-4" />
                  )}
                </SortableItem>
              )
          )}
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-primary">
              {
                data.sections.find((section: any) => section.id === activeId)
                  ?.title
              }
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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

      {/* Add New Section button */}
      <div className="relative mt-8 pt-6 border-t border-gray-300">
        {isAddingSection ? (
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm flex items-center gap-2">
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="p-2 border rounded hover-border transition-colors duration-200"
              placeholder="Section Title"
              autoFocus
            />
            <button
              onClick={() => handleSaveNewSection()}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
            <button
              onClick={() => setIsAddingSection(false)}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddSection}
            className="absolute left-1/2 top-0 text-primary transform -translate-x-1/2 -translate-y-1/2 bg-[#E6F7F5] px-4 py-2 flex items-center gap-2 text-sm hover:text-[#1a8a7c] border border-gray-300 rounded-full shadow-sm hover:shadow transition-all duration-200"
          >
            <Plus className="w-5 h-5 text-primary" />
            Add New Section
          </button>
        )}
      </div>

      {/* Auto-save indicator */}
      {pendingSave && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving changes...</span>
        </div>
      )}

      {/*   FOR SHOWING UPGRADE MODAL */}
      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  );
}
