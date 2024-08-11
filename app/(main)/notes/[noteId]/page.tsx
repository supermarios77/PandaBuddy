import { NoteEditor } from "@/components/notes/NoteEditor";
import { Sidebar } from "@/components/notes/Sidebar";

const NotePage = ({ params: { noteId } }) => {
  return (
    <div className="flex h-screen">
      <NoteEditor noteId={noteId} />
      <div className="flex-1 p-10">
        <Sidebar noteId={noteId} />
      </div>
    </div>
  );
};

export default NotePage;
