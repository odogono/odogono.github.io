import { useEffect, useState } from 'react';

import './markdown-editor.css';

import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({
  content,
  onChange
}: MarkdownEditorProps) {
  const [value, setValue] = useState(content);

  useEffect(() => {
    setValue(content);
  }, [content]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="h-full min-h-[600px] w-full overflow-hidden rounded-lg border border-gray-300">
      <CodeMirror
        extensions={[markdown(), EditorView.lineWrapping]}
        height="100%"
        onChange={handleChange}
        theme={oneDark}
        value={value}
      />
    </div>
  );
}
