import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Sheet } from "lucide-react";

interface ReportExportButtonProps {
  onExportPdf?: () => void;
  onExportCsv?: () => void;
  disabled?: boolean;
}

export function ReportExportButton({
  onExportPdf,
  onExportCsv,
  disabled = false,
}: ReportExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Download className="mr-1 h-4 w-4" />
          Disa Aktar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportPdf}>
          <FileText className="mr-2 h-4 w-4" />
          PDF olarak indir
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportCsv}>
          <Sheet className="mr-2 h-4 w-4" />
          CSV olarak indir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
