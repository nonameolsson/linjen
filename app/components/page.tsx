import { useState } from "react";
import {
  HomeIcon,
  PhotographIcon,
  ViewGridIcon,
} from "@heroicons/react/outline";

import { Content } from "./content";
import { MobileMenu } from "./mobile-menu";
import { Sidebar } from "./sidebar";

// TODO: Move to type file
export type SidebarNavigationItem = {
  name: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  current: boolean;
};

const sidebarNavigation: SidebarNavigationItem[] = [
  { name: "Timelines", to: "/timelines", icon: HomeIcon, current: false },
  { name: "Events", to: "/events", icon: ViewGridIcon, current: false },
  { name: "People", to: "/people", icon: PhotographIcon, current: true },
];

export function Page({ children }: { children: React.ReactNode }): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-full">
      {/* Narrow sidebar */}
      <Sidebar sidebarNavigation={sidebarNavigation} />

      {/* Mobile menu */}
      <MobileMenu
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
        sidebarNavigation={sidebarNavigation}
      />

      {/* Content area */}
      <Content setMobileMenuOpen={setMobileMenuOpen}>{children}</Content>
    </div>
  );
}
