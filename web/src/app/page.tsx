import Faq from "@/components/news-events/Faq";
import { EnquiryForm } from "@/components/admission-enquiry/EnquiryForm";
import { NewsEventsHome } from "@/components/news-events/NewsEventsHome";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fdf9f2] text-[#062e5d]">
      <SiteHeader />

      <NewsEventsHome />

      <section
        id="enquiry"
        className="bg-[#ed0b82] px-5 py-16 text-white sm:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
          <div className="lg:sticky lg:top-8">
            <Faq />
          </div>
          <div>
            <div className="">
              <p className="mb-4 text-white text-4xl font-black uppercase text-[#ed0b82]">
                Book A Campus Visit
              </p>
            </div>

            <div className="rounded-3xl bg-[#fdf9f2] p-5 text-[#062e5d] shadow-2xl sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed0b82]">
                Admission enquiry
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase sm:text-4xl">
                Tell us about your child
              </h2>
              <p className="mt-2 text-slate-600">
                We will get back to you with the next steps.
              </p>
              <div className="mt-6">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
