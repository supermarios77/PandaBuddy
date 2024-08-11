import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { truncate } from "@/lib/utils";

export const NoteCard = ({ note }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{truncate(note.content, 100)}</p>  
      </CardContent>
    </Card>
  );
};