"use client";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Linkedin,
  LinkIcon,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

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
import useDimensions from "@/hooks/use-dimension";
import { getUrl } from "aws-amplify/storage";

interface resumeDataProps {
  contentRef?: React.Ref<HTMLDivElement>;
  resumeData: ResumeData;
}

const PreviewResume3 = ({ contentRef, resumeData }: resumeDataProps) => {
  // const { resumeData } = useResumeContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef as RefObject<HTMLElement>);

  const [showUploadedPhoto, setShowUploadedPhoto] = useState(
    "/placeholder-user.jpg"
  );
  useEffect(() => {
    async function fetchUrl() {
      if (resumeData?.personalInfo?.photoUrl) {
        const url = await getUrl({
          path: resumeData.personalInfo.photoUrl,
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
  }, [resumeData?.personalInfo?.photoUrl]);

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

  const renderSectionTitle = (section: Section) => (
    <div className="flex justify-between items-center mb-1 group relative">
      <div className="flex-1">
        <h2 className="text-lg font-bold text-[#00BFA6] uppercase border-b-[1.5px] border-[#00BFA6] pb-1">
          {section.title}
        </h2>
      </div>
    </div>
  );

  const renderLink = (link: Link, section: string, id: string) => {
    return (
      <span className="inline-flex items-center gap-1">
        {link.text && link.url && (
          <>
            <a href={link.url} className="text-[#00BFA6]  ">
              {link.text}
            </a>
          </>
        )}
      </span>
    );
  };

  const renderSection = (section: Section) => {
    switch (section.type) {
      case "education":
        return (
          <div className="group relative">
            {resumeData.education.map((edu) => (
              <div
                key={edu.id}
                className="group/item relative p-2 rounded-md border-2 border-transparent break-inside-avoid"
              >
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
              </div>
            ))}
          </div>
        );
      case "languages":
        return (
          <div className="group relative">
            {resumeData.languages.map((lang) => (
              <div
                key={lang.id}
                className="group/item relative p-2 rounded-md  border-2 border-transparent break-inside-avoid"
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">{lang.name}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{lang.level}</span>
                    <ProficiencyDots level={lang.proficiency} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "skills":
        return (
          <div className="group relative">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(resumeData.skills).map(([category, skills]) =>
                skills.map((skill, index) => (
                  <div
                    key={`${category}-${index}`}
                    className="group/item relative  pl-1 break-inside-avoid"
                  >
                    <span className="text-[15px] font-medium  border-b-[1.5px] border-gray-500">
                      {skill}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case "summary":
        return (
          <div className="group relative break-inside-avoid">
            <div className="group/item relative  p-2">
              <p className="text-sm text-gray-700">{resumeData.summary}</p>
            </div>
          </div>
        );
      case "keyAchievements":
        return (
          <div className="group relative ">
            {resumeData.keyAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="group/item relative p-2 rounded-md  border-2 border-transparent  break-inside-avoid"
              >
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
              </div>
            ))}
          </div>
        );

      case "experience":
      case "projects":
      case "certificates":
        return (
          <div className="group relative mb-1">
            {Array.isArray(resumeData[section.type as keyof ResumeData]) &&
              (resumeData[section.type as keyof ResumeData] as any[]).map(
                (item: any) => (
                  <div
                    key={item.id}
                    className="group/item relative p-2 rounded-md  border-2 border-transparent break-inside-avoid"
                  >
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
                                className="text-[#26B6A5] "
                              >
                                {item?.link.text}
                              </a>
                            )}
                          </div>
                          <ul className="list-disc ml-5 mt-1 text-sm text-gray-700">
                            {item.points.map((point: string, index: number) => (
                              <li key={index}>{point}</li>
                            ))}
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
                            {item.points.map((point: string, index: number) => (
                              <li key={index}>{point}</li>
                            ))}
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
                  </div>
                )
              )}
          </div>
        );
      case "customSection":
        const customSection = resumeData.customSections.find(
          (cs) => cs.id === section.id
        );
        if (!customSection) return null;

        return (
          <div className="group relative mb-1">
            {/* Render existing items */}
            {customSection.items.map((item) => (
              <div
                key={item.id}
                className="group/item relative p-2 rounded-md  border-2 border-transparent break-inside-avoid"
              >
                <>
                  {item.title && (
                    <div className="font-bold text-gray-800">{item.title}</div>
                  )}
                  {item.content && (
                    <div className="text-sm text-gray-700 mt-1">
                      {item.content}
                    </div>
                  )}
                </>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  console.log(resumeData);

  return (
    <>
      <div
        className="aspect-[210/297] h-fit w-full bg-white "
        ref={containerRef}
      >
        <div
          className={cn("space-y-2 p-6", !width && "invisible")}
          style={{
            zoom: (1 / 794) * width,
          }}
          ref={contentRef}
          id="resumePreviewContent"
        >
          <div className=" border-b ">
            {/* Personal Info Section */}
            <div className="group relative mb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {resumeData.personalInfo.name}
                  </h1>
                  <div className="mt-1 text-[#00BFA6] font-medium">
                    {resumeData.personalInfo.title}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                    {Object.entries(resumeData.personalInfo.links).map(
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-8">
              {resumeData.sections
                .filter(
                  (section) =>
                    section.isVisible &&
                    ["experience", "education", "languages"].includes(
                      section.type
                    )
                )
                .map((section, index) => (
                  <div className="group relative  p-2 " key={index}>
                    {renderSectionTitle(section)}
                    {renderSection(section)}
                  </div>
                ))}
            </div>

            <div className="space-y-2">
              {resumeData.sections
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
                .map((section, index) => (
                  <div className="group relative p-2" key={index}>
                    {renderSectionTitle(section)}
                    {renderSection(section)}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewResume3;
