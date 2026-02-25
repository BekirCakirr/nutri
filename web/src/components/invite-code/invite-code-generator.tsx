import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Copy, Check } from "lucide-react";

interface InviteCodeGeneratorProps {
  onGenerate?: (note: string) => void;
  generatedCode?: string;
}

export function InviteCodeGenerator({
  onGenerate,
  generatedCode,
}: InviteCodeGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    onGenerate?.(note);
    setNote("");
  }

  function handleCopy() {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-1 h-4 w-4" />
        Davet Kodu Olustur
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Davet Kodu</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="note">Not (opsiyonel)</Label>
              <Input
                id="note"
                placeholder="Kodu kime gondereceksiniz?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {generatedCode && (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <code className="flex-1 text-lg font-mono font-bold tracking-wider">
                  {generatedCode}
                </code>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Kapat
            </Button>
            <Button onClick={handleGenerate}>Olustur</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
