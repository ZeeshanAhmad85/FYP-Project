"use client";
import React, { useCallback } from "react";
import {
  DotButton,
  useDotButton,
} from "../../shared/embla-corousel-dot-button";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

//   SLIDES DATA TO BE SHOWN on SIGN UP SCREENS
const SLIDES = [
  {
    img: "/assets/overview-3.png",
    stars: 5,
    review:
      " Rezlink has been a game-changer for my job search.Uploading my resume and generating a shareable link made it so much easier to connect with recruiters.",
    author: "Sarah Khan ",
    profile: "/assets/profile.png",
    designation: "Software Engineer",
  },
  {
    img: "/assets/second.png",
    stars: 4,
    review:
      "Rezlinks simplifies the job application process. The detailed insights have helped me get noticed by more employers!",
    author: "John D.",
    profile: "/assets/profile1.jpg",
    designation: "Software Engineer",
  },
  {
    img: "/assets/third.png",
    stars: 5,
    review:
      "Managing multiple resumes used to be a headache, but Rezlinks made it seamless. The unique tracking links are so helpful!",
    author: "Mike R.",
    profile: "/assets/profile2.jpg",
    designation: "Graphic Designer",
  },
];

const EmblaCorousel = (props: any) => {
  const { options, slides } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi: any) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );
  return (
    <section className="embla h-full">
      <div className="embla__viewport h-[95%] " ref={emblaRef}>
        <div className="embla__container">
          {slides.map((item: any, i: any) => (
            <div className="embla__slide " key={i}>
              <div className="embla__slide__number relative w-[100%] ">
                <div className="flex flex-col justify-between  space-y-5 2xl:space-y-8  py-4 pl-10 ">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      {Array(item.stars)
                        .fill(null)
                        .map((_, index) => (
                          <Image
                            src={"/assets/star.svg"}
                            alt="Star"
                            width={30}
                            height={30}
                            key={index}
                          />
                        ))}
                    </div>
                    <p className="text-white text-[16px] font-medium ">
                      {item?.review}
                    </p>
                    <div className="flex items-center gap-2">
                      <Image
                        src={item?.profile}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full w-[40px] h-[40px] object-fill"
                      />
                      <div className="flex flex-col">
                        <p className="text-white text-lg font-normal">
                          {item?.author}
                        </p>
                        <span className="text-sm font-normal text-white">
                          {item?.designation}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center h-full w-full">
                    <div className="relative  w-full   h-[56vh]   max-w-full 2xl:w-full  2xl:h-[450px] 2xl:min-h-full ">
                      <Image
                        src={item?.img}
                        alt={i}
                        fill
                        className=" w-full h-full  absolute object-cover object-top shadow-signup  rounded-l-[8px] "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Corousel = () => {
  const OPTIONS = { loop: true };

  return <EmblaCorousel slides={SLIDES} options={OPTIONS} />;
};

export default Corousel;
