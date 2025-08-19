import { ChevronDown} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLocation } from "react-router-dom";
import { type ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface SidebarNavGroupProps {
  icon?: ReactNode;
  label: string;
  children: ReactNode;
  activePaths?: string[];
  defaultOpen?: boolean;
}

export const SidebarNavGroup = ({
  // icon,
  label,
  children,
  activePaths = [],
  defaultOpen = false,
}: SidebarNavGroupProps) => {
  const location = useLocation();
  const isChildActive = activePaths.some((path) =>
    location.pathname.startsWith(path)
  );
  const [isOpen, setIsOpen] = useState(defaultOpen || isChildActive);

  return (
    <Collapsible
      className="px-2"
      defaultOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full text-sm font-medium py-2 px-2"
        >
          <div className="flex items-center gap-2">
            {/* {icon} */}
            <span>{label}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-4 space-y-1 list-none">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};
