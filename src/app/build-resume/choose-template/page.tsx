import ChooseTemplate from "@/components/templates/choose-template";
import React from "react";

const Page = () => {
  return (
    <ChooseTemplate
      showBackButton={false}
      template1Url="/build-resume/template-1"
      template2Url="/build-resume/template-2"
      template3Url="/build-resume/template-3"
    />
  );
};

export default Page;
