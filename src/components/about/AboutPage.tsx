import React from 'react';
import { Github, Linkedin, ArrowRight } from 'lucide-react';

interface AboutPageProps {}

export const AboutPage: React.FC<AboutPageProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 via-transparent to-transparent dark:from-blue-900/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">About Us</span>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">
                Building careers with intelligence and heart
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                Munus connects ambitious talent with forward‑thinking companies using AI‑driven matching and modern tooling. Our mission is to automate the painful parts of hiring so people can focus on what matters: great work and great teams.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              {/* Illustration / Placeholder */}
              <div className="w-full max-w-md aspect-[4/3] rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 shadow-xl backdrop-blur-sm flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-80" />
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Munus Team • 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Founding Team</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
          The people behind Munus who are obsessed with improving how hiring works.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shaan card */}
          <div className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-5">
              {/* Photo: will load from public path with graceful fallback */}
              <div className="h-20 w-20 rounded-xl overflow-hidden ring-4 ring-blue-50 dark:ring-blue-900/30">
                <img
                  src="/images/founders/shaan.png"
                  alt="Shaan Soni"
                  className="h-full w-full object-cover hidden"
                  onLoad={(e) => {
                    (e.currentTarget as HTMLImageElement).classList.remove('hidden');
                    const sibling = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement | null;
                    if (sibling) sibling.style.display = 'none';
                  }}
                  onError={(e) => {
                    // keep fallback visible
                    (e.currentTarget as HTMLImageElement).classList.add('hidden');
                  }}
                />
                <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600/90 flex items-center justify-center text-white text-xl font-bold">
                  SS
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Shaan Soni</h3>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Co-founder</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  12th‑grade student (17) and entrepreneurial builder. I started Munus to automate the messy, repetitive parts of hiring—sourcing, screening, and matching—so candidates and teams get faster, fairer outcomes with less friction.
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  The vision: grow Munus into a trusted brand that powers end‑to‑end hiring—from first discovery to final offer—using transparent AI, delightful UX, and measurable results.
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href="https://github.com/ShaanSoni123"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/shaan-soni/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
            {/* CTA row */}
            <div className="mt-5 flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <span>Space reserved for photo — will be added soon</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Soham card */}
          <div className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-5">
              {/* Photo: loads from public path with fallback */}
              <div className="h-20 w-20 rounded-xl overflow-hidden ring-4 ring-blue-50 dark:ring-blue-900/30">
                <img
                  src="/images/founders/soham.png"
                  alt="Soham Patel"
                  className="h-full w-full object-cover hidden"
                  onLoad={(e) => {
                    (e.currentTarget as HTMLImageElement).classList.remove('hidden');
                    const sibling = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement | null;
                    if (sibling) sibling.style.display = 'none';
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).classList.add('hidden');
                  }}
                />
                <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600/90 flex items-center justify-center text-white text-xl font-bold">
                  S
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Soham Patel</h3>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Co-founder</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  12th‑grade student and long‑time friend of Shaan. After several months watching Shaan build and seeing the potential of Munus, he joined to help scale the product and make hiring simpler for everyone.
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Together, they’re focused on turning Munus into a brand known for speed, fairness, and great user experience in hiring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission/values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
            <h4 className="font-semibold text-gray-900 dark:text-white">Mission</h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Make hiring human and efficient by pairing great matches with great experiences.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
            <h4 className="font-semibold text-gray-900 dark:text-white">What We Build</h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              AI job matching, resume tools, and dashboards that save time for both talent and teams.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
            <h4 className="font-semibold text-gray-900 dark:text-white">How We Work</h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Fast iterations, thoughtful design, and a relentless focus on user outcomes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;


