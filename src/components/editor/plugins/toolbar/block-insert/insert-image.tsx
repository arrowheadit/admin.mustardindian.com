import { ImageIcon } from "lucide-react"
import { SelectItem } from "@/components/ui/select"

export function InsertImage() {
  return (
    <>
      <SelectItem value="image">
        <div className="flex items-center gap-1">
          <ImageIcon className="size-4" />
          <span>Image</span>
        </div>
      </SelectItem>
    </>
  )
}
