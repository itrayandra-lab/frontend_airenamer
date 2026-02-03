import { cn } from "@/lib/utils";
import { FileText, Image, File, Presentation, Check, Loader2 } from "lucide-react";

interface FileCardProps {
  type: "pdf" | "doc" | "txt" | "ppt" | "img";
  oldName: string;
  newName?: string;
  status?: "pending" | "processing" | "done";
  className?: string;
}

const fileIcons = {
  pdf: FileText,
  doc: FileText,
  txt: File,
  ppt: Presentation,
  img: Image,
};

const fileColors = {
  pdf: "bg-red-100 text-red-600",
  doc: "bg-blue-100 text-blue-600",
  txt: "bg-green-100 text-green-600",
  ppt: "bg-orange-100 text-orange-600",
  img: "bg-purple-100 text-purple-600",
};

const fileLabels = {
  pdf: "PDF",
  doc: "DOCX",
  txt: "TXT",
  ppt: "PPTX",
  img: "GAMBAR",
};

const FileCard = ({ type, oldName, newName, status = "done", className }: FileCardProps) => {
  const Icon = fileIcons[type];
  
  return (
    <div className={cn("file-card p-4 w-full max-w-sm", className)}>
      <div className="flex items-start gap-3">
        {/* File icon */}
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", fileColors[type])}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          {/* File type badge */}
          <span className={cn("feature-badge text-[10px]", fileColors[type])}>
            {fileLabels[type]}
          </span>
          
          {/* Old name */}
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">LAMA</span>
            <p className="text-sm text-muted-foreground truncate">{oldName}</p>
          </div>
          
          {/* New name */}
          {newName && (
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">BARU</span>
              <p className="text-sm font-medium text-foreground truncate">{newName}</p>
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="shrink-0">
          {status === "pending" && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">MENUNGGU</span>
          )}
          {status === "processing" && (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          )}
          {status === "done" && newName && (
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileCard;
