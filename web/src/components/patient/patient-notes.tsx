import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

interface Note {
  id: string;
  text: string;
  date: string;
  author: string;
}

interface PatientNotesProps {
  notes?: Note[];
  onAdd?: (text: string) => void;
  onEdit?: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
}

const defaultNotes: Note[] = [
  { id: "1", text: "Hasta gluten hassasiyeti bildirdi. Plan buna gore guncellenmeli.", date: "25 Sub 2026", author: "Dr. Ayse" },
  { id: "2", text: "Haftalik kontrol olumlu. Kilo verme hedefinde ilerleme var.", date: "18 Sub 2026", author: "Dr. Ayse" },
  { id: "3", text: "Ara ogunlerde abarti var, porsiyon kontrolu onerildi.", date: "11 Sub 2026", author: "Dr. Ayse" },
];

export function PatientNotes({
  notes = defaultNotes,
  onAdd,
  onEdit,
  onDelete,
}: PatientNotesProps) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState("");

  function handleAdd() {
    if (!text.trim()) return;
    onAdd?.(text.trim());
    setText("");
    setAdding(false);
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setText(note.text);
  }

  function handleEdit() {
    if (!editingId || !text.trim()) return;
    onEdit?.(editingId, text.trim());
    setEditingId(null);
    setText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setAdding(false);
    setText("");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Notlar</CardTitle>
        {!adding && !editingId && (
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Not Ekle
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {(adding || editingId) && (
          <div className="space-y-2 rounded-lg border p-3">
            <Textarea
              placeholder="Notunuzu yazin..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                <X className="mr-1 h-4 w-4" />
                Iptal
              </Button>
              <Button size="sm" onClick={editingId ? handleEdit : handleAdd}>
                <Save className="mr-1 h-4 w-4" />
                Kaydet
              </Button>
            </div>
          </div>
        )}

        {notes.map((note) => (
          <div key={note.id} className="rounded-lg border p-3">
            <p className="text-sm">{note.text}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {note.author} &middot; {note.date}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => startEdit(note)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => onDelete?.(note.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
