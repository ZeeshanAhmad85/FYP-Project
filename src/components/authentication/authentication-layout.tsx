import Corousel from "@/components/authentication/sign-up/corousel";

import Image from "next/image";
import React from "react";

const AuthenticationLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-full lg:grid  lg:grid-cols-2  min-h-screen h-screen ">
      <div className="flex items-center justify-center h-full ">
        <div className="flex items-center flex-col space-y-8   justfiy-center  w-full max-w-full sm:w-auto ">
          <div className="relative w-[135px] h-[43px] justify-self-start">
            <Image src="/assets/logo-new.svg" alt="Logo" fill />
          </div>
          {/*  Form  */}
          {children}
        </div>
      </div>
      <div className="hidden bg-primary lg:block  ">
        <Corousel />
      </div>
    </div>
  );
};

export default AuthenticationLayout;
