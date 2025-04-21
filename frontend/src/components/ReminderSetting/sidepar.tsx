// src/components/Sidebar.tsx
'use client';

import {
  Home,
  ListChecks,
  FolderKanban,
  MessageCircle,
  Settings,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-[350px] min-h-screen bg-[#111827] text-white flex flex-col justify-between px-4 py-6">
      {/* Top Logo and Navigation */}
      <div>
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-2 rounded-full">
            <Settings size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold leading-4 px-5 py-5">Taskaty</h1>
            <p className="text-lg text-gray-400">Project Management</p>
          </div>
        </div>

       

        {/* Connected Apps */}
        <div className="mt-10">
          <p className="text-2xl text-gray-400 uppercase mb-4">Connected Apps</p>
          <div className="flex flex-col gap-3 ">
            {[
              { src: '/assets/logos/slackpay.png', name: 'Slackpay App' },
              { src: '/assets/logos/paypal.png', name: 'PayPal App' },
              { src: '/assets/logos/mobilepoint.png', name: 'Mobile Point' },
              { src: '/assets/logos/youtube.png', name: 'Youtube' },
            ].map((app, index) => (
              <div key={index} className="flex items-center gap-2 text-xl text-white ">
                <Image src={app.src} alt={app.name} width={24} height={24} />
                <span>{app.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Box */}
      <div className="bg-[#1F2937] p-4 rounded-lg  mt-6 py-5 px-5">
        <p className="font-medium text-2xl">Lets start!</p>
        <p className="text-gray-400 mt-1 text-xl">Creating or editing new tasks couldnt be easier.</p>
      </div>
    </div>
  );
};

const SidebarItem = ({
  icon,
  text,
  active = false,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) => (
  <Link
    href="#"
    className={`flex items-center gap-3 px-3 py-2 rounded-md ${
      active ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
    }`}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Sidebar;
