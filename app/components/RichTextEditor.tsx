import { useState, useEffect } from 'react';

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
  label: string;
  height?: string;
}

export default function RichTextEditor({
  initialValue = '',
  onChange,
  label,
  height = '300px'
}: RichTextEditorProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <label className="block text-amber-900 mb-1">{label}</label>
      <div className="border-2 border-amber-900 rounded bg-amber-50 mb-2">
        <div className="flex bg-amber-100 p-2 border-b-2 border-amber-900">
          <button
            type="button"
            onClick={() => {
              setValue(prev => prev + '<strong></strong>');
              onChange(value + '<strong></strong>');
            }}
            className="px-2 py-1 bg-amber-900 text-amber-50 rounded mr-2"
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => {
              setValue(prev => prev + '<em></em>');
              onChange(value + '<em></em>');
            }}
            className="px-2 py-1 bg-amber-900 text-amber-50 rounded mr-2"
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => {
              setValue(prev => prev + '<ul><li></li></ul>');
              onChange(value + '<ul><li></li></ul>');
            }}
            className="px-2 py-1 bg-amber-900 text-amber-50 rounded mr-2"
            title="Bullet List"
          >
            • List
          </button>
        </div>
        <textarea
          value={value}
          onChange={handleChange}
          className="w-full p-2 bg-amber-50 font-mono text-sm"
          style={{ height, resize: 'vertical' }}
          placeholder={`Enter HTML content for ${label}...`}
        />
      </div>
      <div className="text-sm text-amber-700 mb-4">
        You can use HTML tags like &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
      </div>
    </div>
  );
}