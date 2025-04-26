import TopBar from "@/components/Panel/TopBar";
import SideBar from "@/components/SideBar/SideBar";
import { Geist, Geist_Mono } from "next/font/google";
import { IconType } from "react-icons";
import { Bs0CircleFill } from "react-icons/bs";

type LayoutProps = {
    children: React.ReactNode;
    title: string;
    Icon: IconType;
};
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
export default function RootLayout({ children, title, Icon }: LayoutProps) {
    Icon = Bs0CircleFill;
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden flex`}
            >
                <div className="bg-slate-900 flex justify-center items-center p-4 w-full h-full">
                    {/* Sidebar Section */}
                    <SideBar />

                    {/* Main Panel Section */}
                    <div className="h-full bg-indigo-950 w-full mx-3 p-3 flex flex-col items-center rounded-3xl">
                        <TopBar title={title} Icon={Icon} />
                        <hr className="w-full  border-gray-700 my-2" />
                        <div className="w-full h-full bg-transparent overflow-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
