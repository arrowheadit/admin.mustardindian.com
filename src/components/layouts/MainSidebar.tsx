import { LayoutDashboard, LogOut, Menu, X, Loader2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupContent,
  // SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useAuth } from "@/context/hooks";
import { SidebarNavItem } from "@/components/sidebar/SidebarNavItem";
// import { SidebarNavGroup } from "@/components/sidebar/SidebarNavGroup";
import {
  // Bookmark,
  // Grid2x2Plus,
  // MapPinned,
  // BookOpenText,
  // GraduationCap,
  // BriefcaseBusiness,
  // PhoneCall,
  // ShieldQuestion,
  // Flower2,
  // ShieldCheck,
  // Grip,
  // Settings,
} from "lucide-react";

export function MainSidebar() {
  const { logout, isLoading } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  console.log("isMobileOpen", isMobileOpen);
  return (
    <SidebarProvider>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          className="rounded-full"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <Sidebar className="w-full h-svh relative" collapsible="none">
        <SidebarHeader className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            {/* <SidebarGroupLabel className="px-4 pt-2 text-sm font-semibold text-gray-600">
              Management
            </SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {/* <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SidebarNavItem to="/membership/memberships" label="Memberships" icon={<Grid2x2Plus size={16} />} />
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
              </SidebarMenu>

              {/* <SidebarNavGroup label="Blog" icon={<Bookmark />} activePaths={["/blog/posts", "/blog/category", "/blog/tag"]}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SidebarNavItem to="/blog/posts" label="Posts" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SidebarNavItem to="/blog/category" label="Category" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SidebarNavItem to="/blog/tag" label="Tag" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarNavGroup> */}

              {/* <SidebarNavGroup label="Geo Location" icon={<MapPinned />} activePaths={["/geo-locations"]}>
                {['division', 'district', 'upazila', 'area'].map((loc) => (
                  <SidebarMenuItem key={loc}>
                    <SidebarMenuButton asChild>
                      <SidebarNavItem to={`/geo-locations/${loc}`} label={loc.charAt(0).toUpperCase() + loc.slice(1)} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarNavGroup> */}

              {/* <SidebarNavGroup label="Religion" icon={<BookOpenText />} activePaths={["/religion"]}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SidebarNavItem to="/religion/religions" label="Religion" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SidebarNavItem to="/religion/castes" label="Caste" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarNavGroup>

              <SidebarNavGroup label="Education" icon={<GraduationCap />} activePaths={["/education"]}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SidebarNavItem to="/education/educations" label="Education" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SidebarNavItem to="/education/education-subjects" label="Education Subject" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarNavGroup> */}
               {/* {[               
                { to: "/contacts", label: "Contacts", icon: <PhoneCall size={16} /> },
                { to: "/faqs", label: "Faqs", icon: <ShieldQuestion size={16} /> },               
                { to: "/testimonials", label: "Testimonials", icon: <ShieldCheck size={16} /> },
              ].map((item) => (
                <SidebarMenu key={item.to}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <SidebarNavItem to={item.to} label={item.label} icon={item.icon} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              ))} */}

              {/* {[
                { to: "/profession", label: "Profession", icon: <BriefcaseBusiness size={16} /> },
                { to: "/contacts", label: "Contacts", icon: <PhoneCall size={16} /> },
                { to: "/faqs", label: "Faqs", icon: <ShieldQuestion size={16} /> },
                { to: "/life-stories", label: "Life Story", icon: <Flower2 size={16} /> },
                { to: "/testimonials", label: "Testimonials", icon: <ShieldCheck size={16} /> },
                { to: "/our-teams", label: "Our Teams", icon: <Grip size={16} /> },
              ].map((item) => (
                <SidebarMenu key={item.to}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <SidebarNavItem to={item.to} label={item.label} icon={item.icon} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              ))} */}

              {/* <SidebarNavGroup
                label="Settings"
                icon={<Settings size={20} />}
                activePaths={["/payment-methods", "/settings"]}
              >               
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SidebarNavItem to="/settings/pages" label="Pages" />
                  </SidebarMenuButton>
                </SidebarMenuItem>                
              </SidebarNavGroup> */}
              <SidebarMenu >
                   <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SidebarNavItem to="/settings/pages" label="Pages" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
               <SidebarMenu >
                   <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SidebarNavItem to="/settings/configs" label="Settings" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <div className="mt-auto p-4">
          <Separator className="my-4" />
          <Button
            disabled={isLoading}
            variant="outline"
            className="w-full justify-center gap-2 border border-destructive text-destructive"
            onClick={() => logout()}
          >
            {isLoading ? "Logging out..." : "Logout"}
            {isLoading ? <Loader2 className="animate-spin" /> : <LogOut className="h-4 w-4" />}
          </Button>
        </div>
      </Sidebar>
    </SidebarProvider>
  );
}
