import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PencilLine, Trash2, Component,  List, ChevronDown } from "lucide-react";
import type { PageItem } from "@/types/pages";

type PageActionsProps = {
  page: PageItem;
  pageSource: string;
  onEdit: (page: PageItem) => void;
  onEditSection: (page: PageItem) => void;
  onSeoSetup: (page: PageItem) => void;
  onDelete: (page: PageItem) => void;
};

const PageActions: React.FC<PageActionsProps> = ({
  page,
  pageSource,
  onEdit,
  onEditSection,
  onSeoSetup,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">          
          Action
          <ChevronDown />
          {/* <MoreVertical className="h-4 w-4" /> */}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        {pageSource != "page_table" &&
          <DropdownMenuItem asChild>          
           <a href="/settings/pages">
            <List />
            Page List
          </a>
          </DropdownMenuItem>
        }
    
          <DropdownMenuItem onClick={() => onEdit(page)}>
            <PencilLine className="mr-2 h-4 w-4" />
            Edit Page
          </DropdownMenuItem>
        
        {pageSource != "edit_section" &&
          <DropdownMenuItem onClick={() => onEditSection(page)}>
            <Component className="mr-2 h-4 w-4 text-amber-500" />
            Edit Section
          </DropdownMenuItem>
        }
        
        { pageSource != "seo" && 
        <DropdownMenuItem onClick={() => onSeoSetup(page)}>
          <Component className="mr-2 h-4 w-4 text-sky-500" />
          Setup SEO
          </DropdownMenuItem>
        }
     
          <DropdownMenuItem
          onClick={() => onDelete(page)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Page
        </DropdownMenuItem>
        
        
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PageActions;
