import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const FAQPage: React.FC = () => {
  const { theme } = useTheme();
  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click on Get Started or Register, fill in your details, and follow the instructions to create your account.'
    },
    {
      question: 'How does AI matching work?',
      answer: 'Our AI analyzes your profile and preferences to recommend the best job opportunities for you.'
    },
    {
          question: 'Is Munus free to use?',
    answer: 'Yes, Munus is free for job seekers. Employers may have premium options.'
    },
    {
      question: 'How do I contact support?',
      answer: 'Use the Contact Us page to send us your queries or issues.'
    },
    {
      question: 'Can I edit my resume after creating it?',
      answer: 'Yes, you can edit your resume anytime from your profile or the Resume Builder.'
    },
  ];

  return (
    <div className={`min-h-screen py-12 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' 
        : 'bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900'
    }`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-lg ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Find answers to common questions about Munus
          </p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`rounded-xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl ${
              theme === 'light' 
                ? 'bg-white border border-gray-200 shadow-gray-200 hover:shadow-gray-300' 
                : 'bg-gray-800 border border-gray-700 shadow-gray-900 hover:shadow-gray-800'
            }`}>
              <h2 className={`text-xl font-semibold mb-3 ${
                theme === 'light' ? 'text-blue-600' : 'text-cyan-400'
              }`}>
                {faq.question}
              </h2>
              <p className={`leading-relaxed ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 