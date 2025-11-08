import { useState } from "react";
import FileUploader from "./components/FileUploader.jsx";
import ConfigEditor from "./components/ConfigEditor.jsx";
import { parse, stringify } from "yaml";


export default function App() {
  const [configData, setConfigData] = useState(null);

  const handleFileUpload = async (file) => {
    const text = await file.text();
    let data;

    try {
      if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
        data = parse(text);
      } else if (file.name.endsWith(".json")) {
        data = JSON.parse(text);
      } else {
        alert("Format not valid. Usa .yaml o .json");
        return;
      }
      setConfigData(data);
    } catch (err) {
      console.error(err);
      alert("Errore nel parsing del file");
    }
  };

  const handleExport = () => {
    if (!configData) return;

    const yamlMode = confirm("Vuoi esportare in formato YAML? (OK = YAML, Annulla = JSON)");
    let blob;

    if (yamlMode) {
      import("yaml").then(({ stringify }) => {
        const yamlText = stringify(configData);
        blob = new Blob([yamlText], { type: "text/yaml" });
        downloadFile(blob, "config.yaml");
      });
    } else {
      const jsonText = JSON.stringify(configData, null, 2);
      blob = new Blob([jsonText], { type: "application/json" });
      downloadFile(blob, "config.json");
    }
  };

  const downloadFile = (blob, fileName) => {
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
            <button
              onClick={handleExport}
              className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-2xl shadow-lg transition-all"
            >
              💾 Export Configuration
            </button>
          </>
        )}
      </div>
    </div>
  );
}
