# TipTap Editor Integration

This document describes the TipTap rich text editor integration in the Elgon application.

## Overview

TipTap is a headless and extensible rich-text editor framework that provides a modern, feature-rich editing experience. It's been integrated into the blog posts and news management system to replace simple textareas with a full-featured rich text editor.

## Features

### Text Formatting
- **Bold** - Make text bold
- **Italic** - Make text italic
- **Strikethrough** - Add strikethrough to text
- **Inline Code** - Add inline code formatting
- **Clear Formatting** - Remove all text formatting

### Headings
- **Heading 1** - Main page title
- **Heading 2** - Section headers
- **Heading 3** - Subsection headers
- **Paragraph** - Return to normal paragraph text

### Lists
- **Bullet List** - Create unordered lists
- **Numbered List** - Create ordered lists

### Blocks
- **Code Block** - Add code blocks with syntax highlighting
- **Blockquote** - Add quoted text blocks
- **Horizontal Rule** - Add dividing lines

### Media & Tables
- **Table** - Insert tables with resizable columns
- **Image** - Insert images by URL
- **Link** - Insert hyperlinks

### History
- **Undo** - Undo last action
- **Redo** - Redo last undone action

## Usage

### Basic Implementation

```tsx
import TipTapEditorWrapper from '@/components/TipTapEditorWrapper';

const [content, setContent] = useState('');

<TipTapEditorWrapper
  content={content}
  onChange={setContent}
  placeholder="Start writing your content..."
  className="min-h-[400px]"
/>
```

**Important**: Always use `TipTapEditorWrapper` instead of `TipTapEditor` directly to avoid SSR issues.

### Props

- `content` (string): The current content of the editor
- `onChange` (function): Callback function called when content changes
- `placeholder` (string, optional): Placeholder text shown when editor is empty
- `className` (string, optional): Additional CSS classes for styling

### Content Format

The editor outputs HTML content that can be:
- Stored in your database
- Rendered on the frontend using `dangerouslySetInnerHTML`
- Processed for SEO and accessibility

## SSR (Server-Side Rendering) Support

The TipTap editor is properly configured for Next.js SSR:

- **TipTapEditorWrapper**: Main component to use in your pages
- **TipTapEditor**: Core editor component (used internally)
- **Dynamic Import**: Editor only loads on the client side
- **Hydration Safe**: No hydration mismatches

### Why Use the Wrapper?

The wrapper component ensures:
1. **No SSR errors** - Editor only renders on the client
2. **Proper loading states** - Shows loading indicator while editor initializes
3. **Performance** - Lazy loads the editor when needed
4. **Compatibility** - Works with Next.js App Router

## Integration Points

### Blog Posts
- **Add Blog Post** (`/dashboard/admin/blog-posts/add`)
- **Edit Blog Post** (`/dashboard/admin/blog-posts/edit/[blogPostId]`)

### News Articles
- **Add News** (`/dashboard/admin/news/add`)
- **Edit News** (`/dashboard/admin/news/edit/[newsId]`)

## Styling

The editor comes with built-in responsive styling that matches your application's design system:

- **Desktop**: Horizontal toolbar with grouped buttons
- **Mobile**: Vertical toolbar with grouped buttons
- **Theme**: Uses CSS custom properties for consistent theming
- **Responsive**: Automatically adapts to different screen sizes
- **Loading States**: Smooth loading experience with proper fallbacks

## Customization

### Adding New Extensions

To add new TipTap extensions:

1. Install the extension package:
   ```bash
   npm install @tiptap/extension-[extension-name]
   ```

2. Import and add to the extensions array in `TipTapEditor.tsx`:
   ```tsx
   import NewExtension from '@tiptap/extension-[extension-name]';
   
   const editor = useEditor({
     extensions: [
       StarterKit,
       // ... other extensions
       NewExtension.configure({
         // configuration options
       }),
     ],
     // ... other options
   });
   ```

3. Add corresponding UI controls to the MenuBar component

### Styling Customization

The editor styles are defined in `app/globals.css` under the `.tiptap-*` classes. You can customize:

- Colors and themes
- Button layouts and spacing
- Content typography
- Mobile responsiveness
- Loading states

## Browser Support

TipTap supports all modern browsers:
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance Considerations

- The editor is loaded only when needed (lazy loading)
- Content updates are debounced to prevent excessive re-renders
- Large documents are handled efficiently with virtual scrolling
- Mobile performance is optimized with touch-friendly controls
- SSR-safe with proper client-side hydration

## Accessibility

- All buttons have proper `title` attributes
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Focus management
- Loading state indicators

## Troubleshooting

### Common Issues

1. **SSR Error**: Make sure you're using `TipTapEditorWrapper` instead of `TipTapEditor`
2. **Editor not loading**: Check that all TipTap packages are installed
3. **Styling issues**: Verify CSS custom properties are defined
4. **Mobile layout problems**: Check responsive CSS rules
5. **Content not saving**: Ensure the `onChange` callback is working

### SSR Fixes Applied

- Added `immediatelyRender: false` to editor configuration
- Created client-side only wrapper component
- Added proper loading states
- Used dynamic imports with `ssr: false`

### Debug Mode

To enable debug mode, add this to your environment variables:
```
NEXT_PUBLIC_TIPTAP_DEBUG=true
```

## Demo

Visit `/tiptap-demo` to see a live demonstration of the editor with all features enabled.

## Resources

- [TipTap Documentation](https://tiptap.dev/)
- [TipTap Extensions](https://tiptap.dev/extensions)
- [React Integration Guide](https://tiptap.dev/installation/react)
- [Custom Extensions](https://tiptap.dev/guide/custom-extensions)
- [Next.js SSR Guide](https://tiptap.dev/installation/react#ssr)

## Support

For issues related to the TipTap integration:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Check the TipTap documentation for specific extension issues
4. Review the component implementation in `components/TipTapEditor.tsx`
5. Ensure you're using `TipTapEditorWrapper` for SSR compatibility
