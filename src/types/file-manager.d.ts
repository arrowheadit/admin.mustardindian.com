export type ViewMode = "grid" | "list";

export interface Folder {
  name: string;
  path: string;
  children: Folder[];
}

export interface FileItem {
  name: string;
  path: string;
  url: string;
  size: number;
  last_modified: number;
  type: string;
};

export interface FileManagerContextType {
  viewMode: ViewMode,
  setViewMode: (S:setViewMode) => void;
  openUploader: boolean;
  setOpenUploader: (setOpenUploader: boolean) => void;
  // selectedFiles: Array<Pick<FileItem, 'name' | 'path' | 'url'>>;
  // setSelectedFiles: React.Dispatch<React.SetStateAction<Pick<FileItem, "name" | "path" | "url">[]>>;
  folders: Array<Folder>;
  files: Array<FileItem>
  activeFolderPath: string | null;
  setActiveFolderPath: (path: string | null) => void;
  createFolder: (
    { folder_path: string },
    callbacks?: {
      onSuccessCallback?: () => void;
      onErrorCallback?: () => void;
    }
  ) => void;
  deleteFolder: (
    { folder_path: string },
    callbacks?: {
      onSuccessCallback?: () => void;
      onErrorCallback?: () => void;
    }
  ) => void;
  editFolder: (
    { old_folder_path: string, new_folder_path: string },
    callbacks?: {
      onSuccessCallback?: () => void;
      onErrorCallback?: () => void;
    }
  ) => void;
  creatingFolder: boolean
  deletingFolder: boolean
  editingFolder: boolean
}
