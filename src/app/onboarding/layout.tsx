"use client";
import { usePathname } from "next/navigation";
import Steps from "@/components/onboard/steps";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Define the routes where the layout should be applied
  const validRoutes = [
    "/onboarding/basic-details",
    "/onboarding/upload-resume",
    "/onboarding/create-link",
  ];

  const shouldShowLayout = validRoutes.includes(pathname);

  return shouldShowLayout ? (
    <>
      <div className="w-full flex justify-center bg-white py-[1.6rem]">
        <div className="relative w-[135px] h-[43px]">
          <Image src="/assets/logo-new.svg" alt="Logo" fill />
        </div>
      </div>

      <Steps />
      <MaxWidthWrapper className="flex flex-col w-full justify-center items-center pb-[2.3rem]">
        <div className="w-full h-full flex justify-center">{children}</div>
      </MaxWidthWrapper>
    </>
  ) : (
    children
  );
};

export default Layout;
