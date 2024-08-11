import { NoteEditor } from "@/components/notes/NoteEditor";
import { Sidebar } from "@/components/notes/Sidebar";

const NotePage = ({ params: { noteId } }) => {
  return (
    <div className="flex h-screen">
      <Sidebar noteId={noteId} /> 
      <div className="flex-1 p-10">
        <NoteEditor noteId={noteId} />
      </div>
    </div>
  );
};

export default NotePage;