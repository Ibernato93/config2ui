import { useRef } from "react";

export default function FileUploader({ onUpload }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-10 bg-gray-50 hover:bg-gray-100 transition-all">
      <input
        type="file"
        accept=".yaml,.yml,.json"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-transform transform hover:scale-105"
      >
        📂 Select a file
      </button>
      <p className="text-gray-500 mt-3 text-sm">
        Carica un file <code>.yaml</code> o <code>.json</code>
      </p>
    </div>
  );
}
