# Config2UI

**Config2UI** is a React-based web application to dynamically render and edit JSON/YAML configuration files. It features a sidebar, collapsible sections, tooltips showing original values, and reset functionality for each field. Boolean values are displayed as `true/false` dropdowns, and modified fields are highlighted.

---

## Features

- Dynamic rendering of nested configuration objects
- Sidebar navigation for top-level sections
- Expandable/collapsible sections for nested objects
- Editable fields with highlight for modified values
- Tooltip showing the original value on hover
- Reset button for each field to revert to the original value
- Boolean fields rendered as dropdowns (`true` / `false`)
- Support for arrays and nested structures

---

## Installation

Make sure you have **Node.js** (v18+) and **npm** installed.

```bash
# Clone the repository
git clone https://github.com/yourusername/config2ui.git
cd config2ui

# Install dependencies
npm install

# Start the development server
npm run dev

# File struncture
src/
├── components/
│   └── ConfigEditor.jsx   # Main editor component
├── App.jsx                # Root app component
├── config.json            # Sample configuration file
└── main.jsx               # Vite entry point
```

## Usage
1. Import your JSON/YAML configuration file into the app.

2. Select a section from the sidebar to view its fields.

3. Edit fields directly. Modified fields are highlighted in yellow.

4. Hover over a modified field to see the original value in a tooltip.

5. Use the Reset button to revert a field to its original value.

## Technologies Used

- React
- Vite
- Tailwind CSS
- JavaScript (ES6+)

## Contributing

Feel free to fork the repository and submit pull requests. Suggestions for features like:

- Undo/Redo support
- Reset entire sections
- Numeric field validation
- Dark/Light theme
- Drag-and-drop for arrays

are welcome!

## License

This project is open-source and available under the [MIT License](./LICENSE).