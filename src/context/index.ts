
import type { AuthContextType } from "@/types/auth";
import type { FileManagerContextType } from "@/types/file-manager";
import { createContext } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined)