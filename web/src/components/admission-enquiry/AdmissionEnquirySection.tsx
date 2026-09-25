// components/admission-enquiry/AdmissionEnquirySection.tsx
import { EnquiryForm } from "./EnquiryForm";

export function AdmissionEnquirySection() {
  return (
    <section id="book-a-visit" className="px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-lg">
        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Book a campus visit</h2>

        <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-lg font-semibold text-[#E6165C]">Tell us about your child</p>
          <p className="mt-1 text-sm text-neutral-500">
            Five fields. We map age to programme, so you don't have to guess.
          </p>

          <div className="mt-6">
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
