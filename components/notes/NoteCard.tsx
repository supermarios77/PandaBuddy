import { Card } from "@/components/ui/card";
import { truncate } from "@/lib/utils";
import Link from "next/link";

export const NoteCard = ({ note }) => {
  return (
    // @ts-ignore
    <Link href={`/notes/${String(note.id)}`}>
      <Card className="bg-card text-primary p-6 flex flex-col items-start h-full">
        <h3 className="text-2xl font-bold mb-2">{note.title}</h3>
        <p className="text-lg font-medium">{truncate(note.content, 100)}</p>
      </Card>
    </Link>
  );
};
