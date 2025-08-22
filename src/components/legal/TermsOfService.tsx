import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FileText, Shield, Users, CreditCard, AlertTriangle, CheckCircle, XCircle, Mail } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-3">
            <FileText className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">
              Terms of Service
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`prose prose-lg max-w-none ${
          theme === 'light' ? 'prose-gray' : 'prose-invert'
        }`}>
          {/* Introduction */}
          <div className="mb-12">
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-blue-900/20 border-blue-700/50'
            }`}>
              <h2 className={`text-xl font-semibold mb-3 ${
                theme === 'light' ? 'text-blue-900' : 'text-blue-300'
              }`}>
                Introduction
              </h2>
              <p className={`${
                theme === 'light' ? 'text-blue-800' : 'text-blue-200'
              }`}>
                Welcome to Munus! These Terms of Service ("Terms") govern your use of our platform, services, and applications (collectively, the "Services") operated by Munus Technologies Pvt. Ltd. ("Munus," "we," "our," or "us").
              </p>
              <p className={`mt-3 ${
                theme === 'light' ? 'text-blue-800' : 'text-blue-200'
              }`}>
                By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Services.
              </p>
            </div>
          </div>

          {/* Acceptance of Terms */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <CheckCircle className="w-7 h-7 text-green-600" />
              Acceptance of Terms
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-green-900/20 border-green-700/50'
            }`}>
              <p className={`${
                theme === 'light' ? 'text-green-800' : 'text-green-200'
              }`}>
                By using our Services, you represent that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are using our Services on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms.
              </p>
            </div>
          </div>

          {/* Description of Services */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Users className="w-7 h-7 text-blue-600" />
              Description of Services
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-blue-900/20 border-blue-700/50'
            }`}>
              <p className={`mb-4 ${
                theme === 'light' ? 'text-blue-800' : 'text-blue-200'
              }`}>
                Munus provides a comprehensive job matching and career development platform that includes:
              </p>
              <ul className={`space-y-2 ${
                theme === 'light' ? 'text-blue-800' : 'text-blue-200'
              }`}>
                <li>• AI-powered job matching and recommendations</li>
                <li>• Professional profile creation and management</li>
                <li>• Resume building and optimization tools</li>
                <li>• Job application and tracking systems</li>
                <li>• Employer candidate search and hiring tools</li>
                <li>• Career development resources and guidance</li>
              </ul>
            </div>
          </div>

          {/* User Accounts */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Shield className="w-7 h-7 text-purple-600" />
              User Accounts
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-purple-50 border-purple-200' 
                : 'bg-purple-900/20 border-purple-700/50'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'light' ? 'text-purple-900' : 'text-purple-300'
              }`}>
                Account Creation and Security
              </h3>
              <ul className={`space-y-2 mb-4 ${
                theme === 'light' ? 'text-purple-800' : 'text-purple-200'
              }`}>
                <li>• You must provide accurate, current, and complete information when creating an account</li>
                <li>• You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>• You must notify us immediately of any unauthorized use of your account</li>
                <li>• You are responsible for all activities that occur under your account</li>
              </ul>
              
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'light' ? 'text-purple-900' : 'text-purple-300'
              }`}>
                Account Types
              </h3>
              <ul className={`space-y-2 ${
                theme === 'light' ? 'text-purple-800' : 'text-purple-200'
              }`}>
                <li>• <strong>Job Seekers:</strong> Access to job search, profile creation, and career tools</li>
                <li>• <strong>Employers:</strong> Access to candidate search, job posting, and hiring tools</li>
              </ul>
            </div>
          </div>

          {/* Acceptable Use */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <CheckCircle className="w-7 h-7 text-emerald-600" />
              Acceptable Use
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-emerald-900/20 border-emerald-700/50'
            }`}>
              <p className={`mb-4 ${
                theme === 'light' ? 'text-emerald-800' : 'text-emerald-200'
              }`}>
                You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className={`space-y-2 ${
                theme === 'light' ? 'text-emerald-800' : 'text-emerald-200'
              }`}>
                <li>• Violate any applicable laws or regulations</li>
                <li>• Infringe upon the rights of others</li>
                <li>• Upload or transmit malicious code, viruses, or harmful content</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Use the Services for spam, harassment, or fraudulent activities</li>
                <li>• Reverse engineer or attempt to extract source code from our Services</li>
                <li>• Interfere with or disrupt the Services or servers</li>
              </ul>
            </div>
          </div>

          {/* Content and Intellectual Property */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <FileText className="w-7 h-7 text-indigo-600" />
              Content and Intellectual Property
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-indigo-50 border-indigo-200' 
                : 'bg-indigo-900/20 border-indigo-700/50'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'light' ? 'text-indigo-900' : 'text-indigo-300'
              }`}>
                Your Content
              </h3>
              <p className={`mb-4 ${
                theme === 'light' ? 'text-indigo-800' : 'text-indigo-200'
              }`}>
                You retain ownership of content you submit to our Services. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content in connection with providing our Services.
              </p>
              
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'light' ? 'text-indigo-900' : 'text-indigo-300'
              }`}>
                Our Intellectual Property
              </h3>
              <p className={`${
                theme === 'light' ? 'text-indigo-800' : 'text-indigo-200'
              }`}>
                The Services and their original content, features, and functionality are owned by Munus and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </div>
          </div>

          {/* Privacy and Data Protection */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Shield className="w-7 h-7 text-cyan-600" />
              Privacy and Data Protection
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-cyan-50 border-cyan-200' 
                : 'bg-cyan-900/20 border-cyan-700/50'
            }`}>
              <p className={`${
                theme === 'light' ? 'text-cyan-800' : 'text-cyan-200'
              }`}>
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our Services, you consent to our collection and use of information as described in our Privacy Policy.
              </p>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <CreditCard className="w-7 h-7 text-amber-600" />
              Payment Terms
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-amber-50 border-amber-200' 
                : 'bg-amber-900/20 border-amber-700/50'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'light' ? 'text-amber-900' : 'text-amber-300'
              }`}>
                Premium Services
              </h3>
              <p className={`mb-4 ${
                theme === 'light' ? 'text-amber-800' : 'text-amber-200'
              }`}>
                Some features of our Services may require payment. By purchasing premium services, you agree to pay all applicable fees and taxes.
              </p>
              
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'light' ? 'text-amber-900' : 'text-amber-300'
              }`}>
                Billing and Cancellation
              </h3>
              <ul className={`space-y-2 ${
                theme === 'light' ? 'text-amber-800' : 'text-amber-200'
              }`}>
                <li>• Fees are billed in advance on a recurring basis</li>
                <li>• You may cancel your subscription at any time</li>
                <li>• No refunds will be provided for partial billing periods</li>
                <li>• We reserve the right to change our pricing with 30 days' notice</li>
              </ul>
            </div>
          </div>

          {/* Disclaimers and Limitations */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <AlertTriangle className="w-7 h-7 text-orange-600" />
              Disclaimers and Limitations
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-orange-900/20 border-orange-700/50'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'light' ? 'text-orange-900' : 'text-orange-300'
              }`}>
                Service Availability
              </h3>
              <p className={`mb-4 ${
                theme === 'light' ? 'text-orange-800' : 'text-orange-200'
              }`}>
                Our Services are provided "as is" and "as available" without warranties of any kind. We do not guarantee that the Services will be uninterrupted, secure, or error-free.
              </p>
              
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'light' ? 'text-orange-900' : 'text-orange-300'
              }`}>
                Limitation of Liability
              </h3>
              <p className={`${
                theme === 'light' ? 'text-orange-800' : 'text-orange-200'
              }`}>
                To the maximum extent permitted by law, Munus shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.
              </p>
            </div>
          </div>

          {/* Termination */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <XCircle className="w-7 h-7 text-red-600" />
              Termination
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-red-900/20 border-red-700/50'
            }`}>
              <p className={`mb-4 ${
                theme === 'light' ? 'text-red-800' : 'text-red-200'
              }`}>
                You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
              </p>
              <p className={`${
                theme === 'light' ? 'text-red-800' : 'text-red-200'
              }`}>
                We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </div>
          </div>

          {/* Governing Law */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <FileText className="w-7 h-7 text-gray-600" />
              Governing Law and Disputes
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-gray-800/50 border-gray-700/50'
            }`}>
              <p className={`mb-4 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
              <p className={`${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Any disputes arising from these Terms or your use of our Services shall be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996.
              </p>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <AlertTriangle className="w-7 h-7 text-blue-600" />
              Changes to Terms
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-blue-900/20 border-blue-700/50'
            }`}>
              <p className={`${
                theme === 'light' ? 'text-blue-800' : 'text-blue-200'
              }`}>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on our website and updating the "Last Updated" date. Your continued use of the Services after such changes constitutes acceptance of the new Terms.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Mail className="w-7 h-7 text-green-600" />
              Contact Information
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-green-900/20 border-green-700/50'
            }`}>
              <p className={`mb-4 ${
                theme === 'light' ? 'text-green-800' : 'text-green-200'
              }`}>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className={`${
                theme === 'light' ? 'text-green-800' : 'text-green-200'
              }`}>
                <p className="font-semibold">Munus Technologies Pvt. Ltd.</p>
                <p>Email: <a href="mailto:team@gomunus.com" className="underline hover:no-underline">team@gomunus.com</a></p>
                <p>Address: [Your Company Address]</p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className={`text-center p-6 rounded-xl border ${
            theme === 'light' 
              ? 'bg-gray-50 border-gray-200' 
              : 'bg-gray-800/50 border-gray-700/50'
          }`}>
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              <strong>Last Updated:</strong> August 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
