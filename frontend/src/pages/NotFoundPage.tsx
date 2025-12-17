import { Undo2 } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div>
      <div className="text-5xl text-center">404 not found</div>
      <a
        href="/"
        target="_parent"
        rel="noopener noreferrer"
        className="mt-8 px-4 py-2 rounded-2xl shadow-md bg-neutral-900 text-neutral-100 hover:bg-neutral-500 flex gap-2 items-center"
      >
        Trờ về <Undo2 />
      </a>
    </div>
  );
};

export default NotFoundPage;
