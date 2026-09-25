"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What age groups do you accept?",
    answer:
      "We welcome children across different age groups. Our programs are designed according to each child's developmental stage and learning needs.",
  },
  {
    question: "What makes your learning approach different?",
    answer:
      "Our approach focuses on learning through exploration, creativity, play, and meaningful experiences rather than relying only on traditional classroom methods.",
  },
  {
    question: "How do you ensure my child is safe?",
    answer:
      "Child safety is a priority. Our environment, staff practices, and daily routines are designed to provide children with a safe and supportive space.",
  },
  {
    question: "How can parents stay updated about their child?",
    answer:
      "Parents receive regular updates about their child's activities, participation, progress, and important events through our communication channels.",
  },
  {
    question: "What does a typical day look like?",
    answer:
      "A typical day includes a balance of guided learning, creative activities, play, social interaction, outdoor experiences, and age-appropriate routines.",
  },
  {
    question: "Do you provide meals and snacks?",
    answer:
      "Meal and snack arrangements depend on the selected program. Please contact our team for details about the current menu and food policies.",
  },
  {
    question: "How do I enroll my child?",
    answer:
      "You can contact our admissions team to learn about availability, schedule a visit, understand the programs, and complete the enrollment process.",
  },
  {
    question: "Can parents visit before enrolling?",
    answer:
      "Yes. Parents are welcome to learn more about our environment and programs before making an enrollment decision. Contact us to arrange a visit.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="overflow-hidden px-0 text-white">
      <div className="">
        <p className="mb-4 text-white text-4xl font-black uppercase text-[#ed0b82]">
          Questions Parents ASK
        </p>
      </div>

      <div className="mt-8 divide-y divide-white/25 lg:mt-10">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={faq.question} className="py-2">
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between gap-4 py-2 text-left sm:gap-6"
                aria-expanded={isOpen}
              >
                <span className="pr-2 text-sm font-black  leading-snug text-white sm:text-base lg:text-md">
                  {faq.question}
                </span>

                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isOpen
                      ? "bg-white text-[#ed0b82]"
                      : " bg-transparent text-white"
                  }`}
                >
                  <span className="text-2xl font-light leading-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl pb-6 pr-12 text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
