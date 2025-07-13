# Character Tree Maker

A beautiful, interactive web application for creating and visualizing character relationship trees. Built with Next.js and featuring an organic, nature-inspired design with vine-like connections and animated leaf decorations.

## ✨ Features

- **Interactive Character Creation**: Add, edit, and delete characters with detailed information
- **Relationship Management**: Create and manage relationships between characters with custom descriptions
- **Visual Tree Structure**: Drag-and-drop interface for organizing character hierarchies
- **Nature-Inspired Design**: Vine-like connections with animated leaf decorations that follow curved paths
- **Data Persistence**: Automatic saving to localStorage with multiple tree support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations and organic styling

## 🎨 Visual Features

- **Circular Character Nodes**: Characters appear as leaf-like circular nodes
- **Curved Vine Connections**: Relationships are shown as natural bezier curves
- **Animated Leaf Decorations**: Leaves positioned along vine edges with gentle animations
- **Relationship Labels**: Custom descriptions with nature-themed backgrounds
- **Interactive Editing**: Click nodes to edit characters, click vines to edit relationships

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd character-tree-maker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🎮 How to Use

### Creating Your First Character Tree

1. Click "Create New Tree" on the homepage
2. Enter a name for your character tree
3. Click the blue "+" button to add your first character
4. Fill in character details (name is required)
5. Add character traits by typing them in and clicking the "+" button
6. Save the character

### Managing Characters and Relationships

- **Edit Character**: Click on any character node in the tree to edit their details
- **Delete Character**: Use the delete button in the character edit modal
- **Add Relationships**: Drag from one character to another to create a relationship
- **Edit Relationships**: Click on vine connections to edit or delete relationships
- **Organize Layout**: Drag characters around to reorganize your tree structure

### Working with Multiple Trees

- **Switch Trees**: Use the "Select Tree" button to switch between different character trees
- **Delete Trees**: Remove entire trees using the delete button in the tree selector
- **Export Data**: Download all your character trees as a JSON file
- **Import Data**: Upload a previously exported JSON file to restore your data

## 🛠️ Technical Architecture

### Built With

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Flow** - Interactive node-based UI library for tree visualization
- **Lucide React** - Beautiful icon library
- **UUID** - Unique identifier generation

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/            # React components
│   ├── CharacterTreeView.tsx   # Main tree canvas
│   ├── CharacterNode.tsx      # Individual character nodes
│   ├── VineEdge.tsx          # Custom vine connections with leaves
│   ├── CharacterModal.tsx     # Character editing modal
│   ├── RelationshipModal.tsx  # Relationship creation modal
│   └── TreeSelector.tsx      # Tree management
├── hooks/                 # Custom React hooks
│   └── useCharacterTree.ts   # State management
├── types/                 # TypeScript type definitions
│   └── character.ts         # Data models
├── utils/                 # Utility functions
│   └── storage.ts          # localStorage management
└── styles/               # Styling
    └── vine-edges.css      # Custom vine styling
```

### Data Storage

The application uses localStorage for client-side data persistence. All character trees and their data are stored locally in your browser. This means:

- No server or database required
- Data persists between browser sessions
- Data is specific to each browser/device
- Use export/import to transfer data between devices

- Your data is private and never sent to external servers
- Data persists between browser sessions
- Use export/import functionality to backup or transfer data
- Clear browser data will remove all character trees

## 🎨 Design Philosophy

The application embraces a nature-inspired aesthetic:
- **Organic Shapes**: Characters appear as circular leaf-like nodes
- **Natural Connections**: Relationships are represented as curved vines
- **Animated Elements**: Leaves gently animate along the vine paths
- **Earthy Colors**: Green color palette inspired by plant life
- **Smooth Interactions**: Fluid animations and transitions

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
npm start
```

### Customization

#### Adding New Relationship Types

Edit `src/types/character.ts` to add new relationship types:

```typescript
export type RelationshipType = 
  | 'parent' 
  | 'child' 
  | 'sibling' 
  | 'friend' 
  | 'enemy' 
  | 'mentor'
  | 'your-new-type';
```

#### Styling Customization

- **Vine Appearance**: Modify `src/styles/vine-edges.css`
- **Character Nodes**: Edit `src/components/CharacterNode.tsx`
- **Colors**: Update Tailwind classes throughout components

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Submit a pull request

## 🐛 Known Issues

- Leaf decorations may not render correctly in older browsers
- Large trees (>100 characters) may experience performance issues
- localStorage has size limitations for very large datasets

## 🔄 Version History

- **v1.0.0**: Initial release with basic character and relationship management
- **v1.1.0**: Added vine-like connections with leaf decorations
- **v1.2.0**: Enhanced leaf positioning and animation system

## 📞 Support

If you encounter any issues or have questions:
1. Check the existing GitHub issues
2. Create a new issue with detailed description
3. Include browser information and steps to reproduce

## 📝 License

This project is licensed under the Apache License, Version 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Tree visualization powered by [React Flow](https://reactflow.dev/)
- Icons from [Lucide React](https://lucide.dev/)

---

Made with ❤️ and 🌿
- Tree visualization powered by [React Flow](https://reactflow.dev/)
- Icons from [Lucide](https://lucide.dev/)
