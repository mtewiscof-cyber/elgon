'use client';

import { useState } from 'react';
import TipTapEditorWrapper from '@/components/TipTapEditorWrapper';

export default function TipTapDemoPage() {
  const [content, setContent] = useState('<h2>Welcome to TipTap Editor!</h2><p>This is a <strong>rich text editor</strong> with many features:</p><ul><li>Text formatting (bold, italic, etc.)</li><li>Headings</li><li>Lists</li><li>Tables</li><li>Images and links</li><li>Code blocks</li></ul><p>Try it out!</p>');

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">TipTap Editor Demo</h1>
        <p className="text-gray-600 mb-6">
          This is a demonstration of the TipTap rich text editor integrated into your Elgon application.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Editor</h2>
          <TipTapEditorWrapper
            content={content}
            onChange={setContent}
            placeholder="Start writing your content here..."
            className="min-h-[500px]"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">HTML Output</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-auto max-h-[500px] whitespace-pre-wrap">
              {content}
            </pre>
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Rendered Preview</h3>
          <div 
            className="bg-white p-4 rounded-lg border border-gray-200 max-h-[400px] overflow-auto"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Features Available:</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <li>• Bold, Italic, Strikethrough, Code</li>
          <li>• Headings (H1, H2, H3)</li>
          <li>• Bullet and numbered lists</li>
          <li>• Blockquotes and code blocks</li>
          <li>• Tables with resizable columns</li>
          <li>• Image and link insertion</li>
          <li>• Undo/Redo functionality</li>
          <li>• Mobile responsive design</li>
        </ul>
      </div>
    </div>
  );
}
