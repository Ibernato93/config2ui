import { useState, useEffect } from "react";

export default function ConfigEditor({ config, onChange }) {
  const topKeys = Object.keys(config);
  const [selectedSection, setSelectedSection] = useState(topKeys[0] || "");
  const [expandedPaths, setExpandedPaths] = useState({});
  const [hoverPath, setHoverPath] = useState("");
  const [originalConfig, setOriginalConfig] = useState({});

  useEffect(() => {
    setOriginalConfig(JSON.parse(JSON.stringify(config)));
  }, []);

  const handleChange = (path, value) => {
    const newConfig = JSON.parse(JSON.stringify(config));
    const keys = path.split(".");
    let obj = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    onChange(newConfig);
  };

  const toggleExpand = (path) => {
    setExpandedPaths((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const isModified = (path, value) => {
    const keys = path.split(".");
    let original = originalConfig;
    for (let k of keys) {
      if (original === undefined) return false;
      original = original[k];
    }
    return JSON.stringify(original) !== JSON.stringify(value);
  };

  const getOriginalValue = (path) => {
    const keys = path.split(".");
    let original = originalConfig;
    for (let k of keys) {
      if (original === undefined) return "";
      original = original[k];
    }
    return original;
  };

  const renderField = (key, value, path = key) => {
    const modified = isModified(path, value);

    // Subsection
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const isExpanded = expandedPaths[path] ?? true;
      return (
        <div key={path} className="border border-gray-200 rounded-xl p-3 mb-3 bg-white shadow-sm">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleExpand(path)}
          >
            <h4 className="font-semibold text-gray-700">{key}</h4>
            <span className="text-gray-400">{isExpanded ? "−" : "+"}</span>
          </div>
          {isExpanded && (
            <div className="pl-4 mt-3 space-y-3">
              {Object.entries(value).map(([subKey, subVal]) =>
                renderField(subKey, subVal, `${path}.${subKey}`)
              )}
            </div>
          )}
        </div>
      );
    }

    // Array/list
    if (Array.isArray(value)) {
      return (
        <div key={path} className="flex flex-col mb-4 relative overflow-visible">
          <label className="text-sm font-medium text-gray-700 mb-1">{key} (array)</label>
          {value.map((item, index) => {
            const currentPath = `${path}.${index}`;
            const itemModified = isModified(currentPath, item);
            return (
              <div key={currentPath} className="relative flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newArr = [...value];
                    newArr[index] = e.target.value;
                    handleChange(path, newArr);
                  }}
                  onMouseEnter={() => setHoverPath(currentPath)}
                  onMouseLeave={() => setHoverPath("")}
                  className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none transition w-full
                    ${itemModified ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white focus:ring-blue-400"}`}
                />
                {itemModified && (
                  <button
                    type="button"
                    onClick={() =>
                      handleChange(path, [
                        ...value.slice(0, index),
                        getOriginalValue(currentPath),
                        ...value.slice(index + 1),
                      ])
                    }
                    className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0.5 rounded transition"
                  >
                    Reset
                  </button>
                )}
                {hoverPath === currentPath && itemModified && (
                  <div className="absolute -top-10 left-0 bg-gray-800 text-white text-xs p-1 rounded shadow-lg whitespace-pre-wrap z-50 w-max max-w-[300px]">
                    Original: {JSON.stringify(getOriginalValue(currentPath), null, 2)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // Boolean → select true/false
    if (typeof value === "boolean") {
      return (
        <div key={path} className="flex flex-col mb-4 relative overflow-visible">
          <label className="text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
            {key}
            {modified && (
              <button
                type="button"
                onClick={() => handleChange(path, getOriginalValue(path))}
                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0.5 rounded transition"
              >
                Reset
              </button>
            )}
          </label>
          <select
            value={value}
            onChange={(e) => handleChange(path, e.target.value === "true")}
            onMouseEnter={() => setHoverPath(path)}
            onMouseLeave={() => setHoverPath("")}
            className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none transition w-full
              ${modified ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white focus:ring-blue-400"}`}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
          {hoverPath === path && modified && (
            <div className="absolute -top-10 left-0 bg-gray-800 text-white text-xs p-1 rounded shadow-lg whitespace-pre-wrap z-50 w-max max-w-[300px]">
              Original: {JSON.stringify(getOriginalValue(path), null, 2)}
            </div>
          )}
        </div>
      );
    }

    // Text / numeric
    return (
      <div key={path} className="flex flex-col mb-4 relative overflow-visible">
        <label className="text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
          {key}
          {modified && (
            <button
              type="button"
              onClick={() => handleChange(path, getOriginalValue(path))}
              className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0.5 rounded transition"
            >
              Reset
            </button>
          )}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(path, e.target.value)}
          onMouseEnter={() => setHoverPath(path)}
          onMouseLeave={() => setHoverPath("")}
          className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none transition w-full
            ${modified ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white focus:ring-blue-400"}`}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row mt-6 h-[500px] gap-6">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white rounded-2xl shadow-md p-4 flex flex-col">
        <h2 className="font-semibold text-gray-700 mb-4 text-lg">Sezioni</h2>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {topKeys.map((key) => (
            <button
              key={key}
              onClick={() => setSelectedSection(key)}
              className={`text-left px-3 py-2 rounded-lg transition
                ${selectedSection === key ? "bg-blue-600 text-white font-medium" : "hover:bg-gray-100"}`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 bg-gray-50 rounded-2xl shadow-lg p-6 overflow-y-auto relative">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">{selectedSection}</h3>
        {renderField(selectedSection, config[selectedSection], selectedSection)}
      </div>
    </div>
  );
}
