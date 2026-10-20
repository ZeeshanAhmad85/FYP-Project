"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TemplateCardProps {
  imageUrl: string;
  isActive?: boolean;
  id?: string;
  url: string;
}

export default function TemplateCard({
  imageUrl,
  isActive = false,
  id,
  url,
}: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div
      className="flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-md overflow-hidden shadow-sm">
        <div className="relative aspect-[3/4]">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="CV Template"
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />

          {/* Overlay with button on hover or if active */}
          {(isHovered || isActive) && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button
                className="bg-primary text-white px-6 py-2 rounded-lg"
                onClick={() => router.push(url)}
              >
                Use Template
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
