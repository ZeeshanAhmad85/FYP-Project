"use client";
import TemplateCard from "@/components/templates/template-card";
import { handleUpdateOnboarding } from "@/lib/cognitoActions";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ChooseTemplate = ({
  showBackButton = true,
  template1Url = "/onboarding/templates/template-1",
  template2Url = "/onboarding/templates/template-2",
  template3Url = "/onboarding/templates/template-3",
}: {
  showBackButton?: boolean;
  template1Url?: string;
  template2Url?: string;
  template3Url?: string;
}) => {
  const router = useRouter();

  const TEMPLATES_DATA = [
    {
      id: "template-1",
      image: "/assets/templates/template-1.jpg",
      url: template1Url,
    },
    {
      id: "template-2",
      image: "/assets/templates/template-2.jpg",
      url: template2Url,
    },
    {
      id: "template-3",
      image: "/assets/templates/template-3.jpg",
      url: template3Url,
    },
  ];
  // Add this to debug and verify props are received correctly
  useEffect(() => {}, [template1Url, template2Url, template3Url]);

  return (
    <>
      <nav className="flex items-center justify-center px-2 sm:max-w-7xl sm:px-4 py-4">
        <div className="flex gap-2">
          <Image
            src={"/assets/logo-new.svg"}
            alt="Logo"
            width={135}
            height={40}
          />{" "}
        </div>
      </nav>
      {showBackButton && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 w-full  max-w-screen-xl mx-auto">
          <Link
            href="/onboarding/upload-resume"
            className="flex items-center gap-2 uppercase"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <button
            onClick={async () => {
              await handleUpdateOnboarding();
              router?.push("/overview");
            }}
            className="flex items-center gap-2 uppercase"
          >
            <span>Skip</span>
          </button>
        </div>
      )}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Choose Your CV Template
          </h1>
          <p className="text-foreground text-lg max-w-3xl mx-auto">
            Select a template that best represents your professional style. Each
            template is fully customizable to showcase your unique skills and
            experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES_DATA.map((template, index) => (
            <TemplateCard
              key={index}
              imageUrl={template.image}
              id={template?.id}
              url={template?.url}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default ChooseTemplate;
