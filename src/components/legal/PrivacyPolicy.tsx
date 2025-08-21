import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Shield, Lock, Eye, Database, Globe, Users, Bell, Mail } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">
              Privacy Policy
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
                Munus ("we," "our," "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, and share your information when you use our products, services, websites, and applications (collectively, the "Services").
              </p>
              <p className={`mt-3 ${
                theme === 'light' ? 'text-blue-800' : 'text-blue-200'
              }`}>
                By using our Services, you agree to the terms of this Privacy Policy. If you do not agree, you should discontinue use of the Services immediately.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Database className="w-7 h-7 text-blue-600" />
              Information We Collect
            </h2>
            <p className={`mb-4 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              We collect information in the following ways:
            </p>

            <div className="grid md:grid-cols-1 gap-6">
              {/* Information You Provide */}
              <div className={`p-6 rounded-xl border ${
                theme === 'light' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-green-900/20 border-green-700/50'
              }`}>
                <h3 className={`text-lg font-semibold mb-3 flex items-center space-x-2 ${
                  theme === 'light' ? 'text-green-900' : 'text-green-300'
                }`}>
                  <Users className="w-5 h-5" />
                  <span>Information You Provide to Us</span>
                </h3>
                <ul className={`space-y-2 ${
                  theme === 'light' ? 'text-green-800' : 'text-green-200'
                }`}>
                  <li>• Account registration details (name, email address, phone number, password)</li>
                  <li>• Profile information (resume/CV, employment history, education, skills, job preferences)</li>
                  <li>• Any content or documents you upload to use our Services</li>
                </ul>
              </div>

              {/* Information We Collect Automatically */}
              <div className={`p-6 rounded-xl border ${
                theme === 'light' 
                  ? 'bg-purple-50 border-purple-200' 
                  : 'bg-purple-900/20 border-purple-700/50'
              }`}>
                <h3 className={`text-lg font-semibold mb-3 flex items-center space-x-2 ${
                  theme === 'light' ? 'text-purple-900' : 'text-purple-300'
                }`}>
                  <Eye className="w-5 h-5" />
                  <span>Information We Collect Automatically</span>
                </h3>
                <ul className={`space-y-2 ${
                  theme === 'light' ? 'text-purple-800' : 'text-purple-200'
                }`}>
                  <li>• Device information (hardware model, operating system version, device identifiers)</li>
                  <li>• Log information (IP address, browser type, pages visited, interaction data)</li>
                  <li>• Usage analytics (click patterns, search queries, session duration)</li>
                </ul>
              </div>

              {/* Information from Third Parties */}
              <div className={`p-6 rounded-xl border ${
                theme === 'light' 
                  ? 'bg-orange-50 border-orange-200' 
                  : 'bg-orange-900/20 border-orange-700/50'
              }`}>
                <h3 className={`text-lg font-semibold mb-3 flex items-center space-x-2 ${
                  theme === 'light' ? 'text-orange-900' : 'text-orange-300'
                }`}>
                  <Globe className="w-5 h-5" />
                  <span>Information from Third Parties</span>
                </h3>
                <ul className={`space-y-2 ${
                  theme === 'light' ? 'text-orange-800' : 'text-orange-200'
                }`}>
                  <li>• Employer or recruiter-provided feedback or hiring decision data</li>
                  <li>• Publicly available professional data from career platforms, where legally permissible</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Bell className="w-7 h-7 text-green-600" />
              How We Use Your Information
            </h2>
            <p className={`mb-4 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              We use your information to:
            </p>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-gray-800/50 border-gray-700/50'
            }`}>
              <ul className={`space-y-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                <li>• Provide, operate, and improve our Services</li>
                <li>• Match you with relevant job opportunities using AI algorithms</li>
                <li>• Personalize your experience and provide tailored recommendations</li>
                <li>• Communicate with you about updates, features, and support</li>
                <li>• Protect against fraudulent, unauthorized, or illegal activity</li>
                <li>• Comply with applicable laws, regulations, and legal processes</li>
              </ul>
            </div>
          </div>

          {/* How We Share Your Information */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Users className="w-7 h-7 text-purple-600" />
              How We Share Your Information
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-red-900/20 border-red-700/50'
            }`}>
              <p className={`font-semibold mb-4 ${
                theme === 'light' ? 'text-red-900' : 'text-red-300'
              }`}>
                We do not sell your personal information. We may share your data only in the following circumstances:
              </p>
              <ul className={`space-y-2 ${
                theme === 'light' ? 'text-red-800' : 'text-red-200'
              }`}>
                <li>• <strong>With Employers or Recruiters</strong> — when you apply for a role or make your profile visible</li>
                <li>• <strong>With Service Providers</strong> — for hosting, analytics, AI processing, and payment processing, under strict confidentiality agreements</li>
                <li>• <strong>For Legal Reasons</strong> — if required by law, regulation, legal process, or government request</li>
                <li>• <strong>In Business Transfers</strong> — if Munus is involved in a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction</li>
              </ul>
            </div>
          </div>

          {/* Data Retention */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Lock className="w-7 h-7 text-indigo-600" />
              Data Retention
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-indigo-50 border-indigo-200' 
                : 'bg-indigo-900/20 border-indigo-700/50'
            }`}>
              <p className={`${
                theme === 'light' ? 'text-indigo-800' : 'text-indigo-200'
              }`}>
                We retain personal information only for as long as necessary to provide Services, comply with legal obligations, resolve disputes, and enforce agreements.
              </p>
              <p className={`mt-3 ${
                theme === 'light' ? 'text-indigo-800' : 'text-indigo-200'
              }`}>
                When data is no longer needed, we securely delete or anonymize it.
              </p>
            </div>
          </div>

          {/* Your Privacy Controls */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Shield className="w-7 h-7 text-emerald-600" />
              Your Privacy Controls
            </h2>
            <p className={`mb-4 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              You have choices regarding your personal information:
            </p>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-emerald-900/20 border-emerald-700/50'
            }`}>
              <ul className={`space-y-2 ${
                theme === 'light' ? 'text-emerald-800' : 'text-emerald-200'
              }`}>
                <li>• Access, update, or delete your account data</li>
                <li>• Download a copy of your data (data portability)</li>
                <li>• Opt out of marketing communications</li>
                <li>• Restrict or object to certain processing activities</li>
                <li>• Withdraw consent where applicable</li>
              </ul>
              <p className={`mt-4 ${
                theme === 'light' ? 'text-emerald-800' : 'text-emerald-200'
              }`}>
                <strong>Requests can be made through:</strong> <a href="mailto:team@gomunus.com" className="underline hover:no-underline">team@gomunus.com</a>
              </p>
            </div>
          </div>

          {/* Security */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Lock className="w-7 h-7 text-amber-600" />
              Security of Your Information
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-amber-50 border-amber-200' 
                : 'bg-amber-900/20 border-amber-700/50'
            }`}>
              <p className={`mb-4 ${
                theme === 'light' ? 'text-amber-800' : 'text-amber-200'
              }`}>
                We use industry-standard measures to protect your information, including:
              </p>
              <ul className={`space-y-2 ${
                theme === 'light' ? 'text-amber-800' : 'text-amber-200'
              }`}>
                <li>• <strong>Encryption:</strong> TLS 1.3 in transit, AES-256 at rest</li>
                <li>• <strong>Access Controls:</strong> Role-based access and multi-factor authentication for staff</li>
                <li>• <strong>Testing:</strong> Regular security audits and penetration testing</li>
              </ul>
              <p className={`mt-4 ${
                theme === 'light' ? 'text-amber-800' : 'text-amber-200'
              }`}>
                While we take every precaution, no security system is impenetrable, and we cannot guarantee absolute security.
              </p>
            </div>
          </div>

          {/* International Data Transfers */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Globe className="w-7 h-7 text-cyan-600" />
              International Data Transfers
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-cyan-50 border-cyan-200' 
                : 'bg-cyan-900/20 border-cyan-700/50'
            }`}>
              <p className={`${
                theme === 'light' ? 'text-cyan-800' : 'text-cyan-200'
              }`}>
                Your information may be stored and processed in countries other than your own. Where data is transferred internationally, we implement safeguards such as Standard Contractual Clauses or equivalent legal mechanisms.
              </p>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Users className="w-7 h-7 text-pink-600" />
              Children's Privacy
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-pink-50 border-pink-200' 
                : 'bg-pink-900/20 border-pink-700/50'
            }`}>
              <p className={`${
                theme === 'light' ? 'text-pink-800' : 'text-pink-200'
              }`}>
                Our Services are not intended for individuals under 18. We do not knowingly collect personal information from children. If we discover such information, we will delete it promptly.
              </p>
            </div>
          </div>

          {/* Changes to Policy */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Bell className="w-7 h-7 text-blue-600" />
              Changes to This Policy
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-blue-900/20 border-blue-700/50'
            }`}>
              <p className={`${
                theme === 'light' ? 'text-blue-800' : 'text-blue-200'
              }`}>
                We may update this Privacy Policy from time to time. If we make significant changes, we will notify you by posting an updated policy on our website and, where appropriate, by other means.
              </p>
            </div>
          </div>

          {/* Contact Us */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Mail className="w-7 h-7 text-green-600" />
              Contact Us
            </h2>
            <div className={`p-6 rounded-xl border ${
              theme === 'light' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-green-900/20 border-green-700/50'
            }`}>
              <p className={`mb-4 ${
                theme === 'light' ? 'text-green-800' : 'text-green-200'
              }`}>
                If you have any questions or concerns about this Privacy Policy or our practices, please contact us at:
              </p>
              <div className={`${
                theme === 'light' ? 'text-green-800' : 'text-green-200'
              }`}>
                <p className="font-semibold">Data Protection Officer</p>
                <p>Munus Technologies Pvt. Ltd.</p>
                <p>Email: <a href="mailto:team@gomunus.com" className="underline hover:no-underline">team@gomunus.com</a></p>
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
              <strong>Last Updated:</strong> December 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
