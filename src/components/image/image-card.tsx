import { Card, CardContent } from "../ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import type { FileItem } from "@/types/file-manager";
import FileManager from "@/lib/filemanager/dialogs/file-manager";
import { useEffect,useState } from "react";

interface imageCardProps{
    value: Array<Pick<FileItem, "name" | "path" | "url">>;
    onChange: React.Dispatch<React.SetStateAction<Array<Pick<FileItem, "name" | "path" | "url">>>>;
    imageAlt: string;
    onAltChange: (alt: string) => void;
    error?: string;
    disabled?: boolean;
    parent?: string;
}
export default function ImageCard({
    value,
    onChange,
    imageAlt,
    onAltChange,
    error,
    disabled = false,
    parent="image",
}:imageCardProps    
) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
      if (value?.length) {
        console.log("image value in image-card..", value);
            setOpen(false);
        }
    }, [value]);

    return (
    <div className="space-y-2">
      {/* <Label>Image</Label> */}
      {value?.length ? (
        <Card className="border-content ml-0">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <img
                  src={value[0].url}
                    alt={`${parent} preview`}
                  className="w-full h-full object-fill"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={() => onChange(()=>[])}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{value[0].name}</span>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(true)}
                  className="cursor-pointer"
                  disabled={disabled}
                >
                  Change Image
                </Button>
              </div>
                {parent !== "page" && (
                 <div className="space-y-2">
                <Label htmlFor="image_alt">Alt Text</Label>
                <Input
                  id="image_alt"
                  name="image_alt"
                  placeholder="Enter alt text"
                  value={imageAlt}
                  onChange={(e) => onAltChange(e.target.value)}
                  disabled={disabled}
                />
              </div>
                )}
             
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed cursor-pointer ${error ? "border-red-300 bg-red-50" : "border-gray-300"}`}
          onClick={() => !disabled && setOpen(true)}
        >
          <CardContent className="p-8">
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-4">
                <p className="text-sm text-gray-600">No image selected</p>
                <Button variant="outline" type="button" onClick={() => setOpen(true)} disabled={disabled}>
                  Upload Images
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {open && (
        <FileManager
          open={open}
          setOpen={setOpen}
          selectedFiles={value}
          setSelectedFiles={onChange}
          onSelectCallBack={() => setOpen(false)}
        />
      )}
    </div>
  );
}
