import { useState } from "react";
import FileUploader from "./components/FileUploader.jsx";
import ConfigEditor from "./components/ConfigEditor.jsx";
import YAML from "yaml";

export default function App() {
  const [configData, setConfigData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [format, setFormat] = useState("json"); // "json" o "yaml"

  const handleFileUpload = async (file) => {
    const text = await file.text();
    let data;

    try {
      if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
        data = YAML.parse(text);
      } else if (file.name.endsWith(".json")) {
        data = JSON.parse(text);
      } else {
        alert("Format not valid. Use .yaml or .json");
        return;
      }
      setConfigData(data);
    } catch (err) {
      console.error(err);
      alert("File parsing error");
    }
  };

  const handleExport = () => {
    if (!configData) return;
    setShowModal(true);
  };

  const getContent = () => {
    if (format === "json") return JSON.stringify(configData, null, 2);
    return YAML.stringify(configData);
  };

  const downloadFile = () => {
    const content = getContent();
    const blob =
      format === "json"
        ? new Blob([content], { type: "application/json" })
        : new Blob([content], { type: "text/yaml" });
    const fileName = format === "json" ? "config.json" : "config.yaml";

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-3xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 flex items-center justify-center gap-3">
            🧩 Config2UI
          </h1>
          <p className="text-gray-500 mt-2">
            Load JSON or YAML file and edit configuration
          </p>
        </div>

        {!configData ? (
          <FileUploader onUpload={handleFileUpload} />
        ) : (
          <>
            <ConfigEditor config={configData} onChange={setConfigData} />

            {/* Export section */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-6">
              <button
                onClick={handleExport}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-2xl shadow-lg transition-all"
              >
                💾 Export Configuration
              </button>

              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="border rounded px-3 py-2 mt-2 md:mt-0"
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[80%] max-w-xl relative">
            <h2 className="text-lg font-semibold mb-4">Export {format.toUpperCase()}</h2>
            <pre className="overflow-auto max-h-[400px] bg-gray-100 p-3 rounded">
              {getContent()}
            </pre>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={downloadFile}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Download
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(getContent())}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
              >
                Copy
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
