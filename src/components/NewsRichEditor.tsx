import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link,
  Highlighter,
  Minus,
  Eye,
  Edit3,
  Eraser,
  Info,
  Clock,
  FileText,
} from 'lucide-react';

interface NewsRichEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
  placeholder?: string;
}

export const NewsRichEditor: React.FC<NewsRichEditorProps> = ({
  value,
  onChange,
  label = 'Isi Lengkap Berita (Naskah Redaksi)',
  placeholder = 'Tulis naskah berita lengkap di sini...',
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to wrap or insert tags at current textarea cursor position
  const applyFormat = (openTag: string, closeTag: string, defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const replacementText = selectedText ? `${openTag}${selectedText}${closeTag}` : `${openTag}${defaultText || 'Teks'}${closeTag}`;

    const newValue = value.substring(0, start) + replacementText + value.substring(end);
    onChange(newValue);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + replacementText.length);
      } else {
        const newCursorPos = start + openTag.length + (defaultText || 'Teks').length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 50);
  };

  const insertBlock = (blockHtml: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const prefix = start > 0 && !value.substring(0, start).endsWith('\n\n') ? '\n\n' : '';
    const suffix = !value.substring(end).startsWith('\n\n') ? '\n\n' : '';

    const insertion = `${prefix}${blockHtml}${suffix}`;
    const newValue = value.substring(0, start) + insertion + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + insertion.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 50);
  };

  const handleInsertLink = () => {
    const url = prompt('Masukkan URL Tautan (contoh: https://asqinews.com/berita/...):', 'https://');
    if (!url || url === 'https://') return;
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart || 0;
    const end = textarea?.selectionEnd || 0;
    const selectedText = value.substring(start, end) || 'Tautan Berita Terkait';
    applyFormat(`<a href="${url}" target="_blank" style="color: #0284c7; text-decoration: underline; font-weight: 600;">`, '</a>', selectedText);
  };

  const handleStripHtml = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua tag format HTML dari naskah berita?')) {
      const stripped = value.replace(/<[^>]*>?/gm, '');
      onChange(stripped);
    }
  };

  // Metrics
  const cleanText = value.replace(/<[^>]*>?/gm, ' ').trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;
  const charCount = value.length;
  const readingTimeMin = Math.ceil(wordCount / 200) || 1;

  // Split paragraphs for live preview
  const paragraphs = value.split('\n').filter((p) => p.trim() !== '');

  return (
    <div style={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden', marginTop: '6px' }}>
      {/* Editor Header & Mode Switcher */}
      <div style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} color="#38bdf8" />
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
            {label} <span style={{ color: '#ef4444' }}>*</span>
          </label>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', backgroundColor: '#1e293b', borderRadius: '6px', padding: '2px', border: '1px solid #334155' }}>
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            style={{
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: activeTab === 'edit' ? '#08204D' : 'transparent',
              color: activeTab === 'edit' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s ease',
            }}
          >
            <Edit3 size={13} /> Editor Naskah
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: activeTab === 'preview' ? '#08204D' : 'transparent',
              color: activeTab === 'preview' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s ease',
            }}
          >
            <Eye size={13} /> Pratinjau Tampilan Berita
          </button>
        </div>
      </div>

      {activeTab === 'edit' ? (
        <>
          {/* Formatting Toolbar */}
          <div
            style={{
              backgroundColor: '#0f172a',
              borderBottom: '1px solid #1e293b',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexWrap: 'wrap',
            }}
          >
            {/* Bold */}
            <button
              type="button"
              title="Cetak Tebal (Bold) - <b>"
              onClick={() => applyFormat('<b>', '</b>', 'Teks Tebal')}
              style={toolbarButtonStyle}
            >
              <Bold size={14} />
            </button>

            {/* Italic */}
            <button
              type="button"
              title="Cetak Miring (Italic) - <i>"
              onClick={() => applyFormat('<i>', '</i>', 'Teks Miring')}
              style={toolbarButtonStyle}
            >
              <Italic size={14} />
            </button>

            {/* Underline */}
            <button
              type="button"
              title="Garis Bawah (Underline) - <u>"
              onClick={() => applyFormat('<u>', '</u>', 'Teks Garis Bawah')}
              style={toolbarButtonStyle}
            >
              <Underline size={14} />
            </button>

            {/* Strikethrough */}
            <button
              type="button"
              title="Coret Teks (Strikethrough) - <s>"
              onClick={() => applyFormat('<s>', '</s>', 'Teks Dicoret')}
              style={toolbarButtonStyle}
            >
              <Strikethrough size={14} />
            </button>

            <div style={separatorStyle} />

            {/* Heading 2 */}
            <button
              type="button"
              title="Sub-Judul Utama (H2)"
              onClick={() => insertBlock('<h2 style="font-size: 18px; font-weight: 800; color: #08204D; margin: 20px 0 10px 0;">Sub-Judul Berita Utama</h2>')}
              style={{ ...toolbarButtonStyle, fontWeight: 800, fontSize: '11px' }}
            >
              <Heading2 size={14} /> H2
            </button>

            {/* Heading 3 */}
            <button
              type="button"
              title="Sub-Judul Kecil (H3)"
              onClick={() => insertBlock('<h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin: 16px 0 8px 0;">Sub-Judul Poin Berita</h3>')}
              style={{ ...toolbarButtonStyle, fontWeight: 700, fontSize: '11px' }}
            >
              <Heading3 size={14} /> H3
            </button>

            <div style={separatorStyle} />

            {/* Blockquote */}
            <button
              type="button"
              title="Kutipan Narasumber (Blockquote)"
              onClick={() =>
                insertBlock(
                  '<blockquote style="border-left: 4px solid #E10600; padding: 10px 16px; margin: 18px 0; font-style: italic; background-color: #f8fafc; color: #334155; border-radius: 0 6px 6px 0;">"Tulis kutipan narasumber atau pernyataan penting di sini..."</blockquote>'
                )
              }
              style={toolbarButtonStyle}
            >
              <Quote size={14} /> Kutipan
            </button>

            {/* Bullet List */}
            <button
              type="button"
              title="Daftar Poin (Bullet List)"
              onClick={() =>
                insertBlock(
                  '<ul style="margin: 12px 0; padding-left: 20px; color: #1e293b;">\n  <li>Poin pertama berita...</li>\n  <li>Poin kedua berita...</li>\n</ul>'
                )
              }
              style={toolbarButtonStyle}
            >
              <List size={14} />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              title="Daftar Nomor (Numbered List)"
              onClick={() =>
                insertBlock(
                  '<ol style="margin: 12px 0; padding-left: 20px; color: #1e293b;">\n  <li>Langkah atau kronologi 1...</li>\n  <li>Langkah atau kronologi 2...</li>\n</ol>'
                )
              }
              style={toolbarButtonStyle}
            >
              <ListOrdered size={14} />
            </button>

            <div style={separatorStyle} />

            {/* Link */}
            <button type="button" title="Sisipkan Tautan / Link" onClick={handleInsertLink} style={toolbarButtonStyle}>
              <Link size={14} /> Tautan
            </button>

            {/* Highlighter */}
            <button
              type="button"
              title="Sorot Teks (Highlight)"
              onClick={() => applyFormat('<mark style="background-color: #fef08a; color: #0f172a; padding: 2px 6px; border-radius: 3px; font-weight: 600;">', '</mark>', 'Teks Disorot')}
              style={toolbarButtonStyle}
            >
              <Highlighter size={14} /> Sorot
            </button>

            {/* Box Redaksi / Callout */}
            <button
              type="button"
              title="Box Catatan Penting Redaksi"
              onClick={() =>
                insertBlock(
                  '<div style="background-color: #f1f5f9; border-left: 4px solid #08204D; padding: 12px 16px; margin: 16px 0; border-radius: 0 6px 6px 0; font-size: 14px; font-weight: 500; color: #0f172a;">📌 <strong>BACA JUGA / CATATAN REDAKSI:</strong><br/>Tuliskan ringkasan fakta penting atau rujukan berita terkait di sini.</div>'
                )
              }
              style={toolbarButtonStyle}
            >
              <Info size={14} /> Box Redaksi
            </button>

            {/* Horizontal Divider */}
            <button
              type="button"
              title="Garis Pembatas (HR)"
              onClick={() => insertBlock('<hr style="margin: 24px 0; border: none; border-top: 1px solid #cbd5e1;" />')}
              style={toolbarButtonStyle}
            >
              <Minus size={14} />
            </button>

            {/* Clear Formatting */}
            <button
              type="button"
              title="Hapus Format / Strip HTML"
              onClick={handleStripHtml}
              style={{ ...toolbarButtonStyle, color: '#f87171', marginLeft: 'auto' }}
            >
              <Eraser size={14} /> Hapus Format
            </button>
          </div>

          {/* Textarea Area */}
          <textarea
            ref={textareaRef}
            rows={12}
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '14px',
              border: 'none',
              backgroundColor: '#020617',
              color: '#f8fafc',
              fontSize: '14px',
              lineHeight: 1.7,
              fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              resize: 'vertical',
              outline: 'none',
              minHeight: '260px',
            }}
          />
        </>
      ) : (
        /* Live Preview Tab */
        <div style={{ padding: '20px 24px', backgroundColor: '#ffffff', color: '#1e293b', minHeight: '300px', maxHeight: '500px', overflowY: 'auto' }}>
          <div style={{ paddingBottom: '12px', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#08204D', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🔍 Pratinjau Tampilan Bacaan Naskah Berita
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
              Tampilan persis yang akan dibaca publik
            </span>
          </div>

          {paragraphs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontStyle: 'italic', fontSize: '14px' }}>
              Belum ada naskah berita yang ditulis. Silakan ketik di tab "Editor Naskah".
            </div>
          ) : (
            <div style={{ fontSize: '15px', lineHeight: 1.8, color: '#1e293b' }}>
              {paragraphs.map((para, idx) => {
                const trimmed = para.trim();
                if (
                  trimmed.startsWith('<h2') ||
                  trimmed.startsWith('<h3') ||
                  trimmed.startsWith('<blockquote') ||
                  trimmed.startsWith('<ul') ||
                  trimmed.startsWith('<ol') ||
                  trimmed.startsWith('<hr') ||
                  trimmed.startsWith('<div')
                ) {
                  return <div key={idx} style={{ marginBottom: '16px' }} dangerouslySetInnerHTML={{ __html: trimmed }} />;
                }
                return <p key={idx} style={{ marginBottom: '16px' }} dangerouslySetInnerHTML={{ __html: trimmed }} />;
              })}
            </div>
          )}
        </div>
      )}

      {/* Editor Footer / Info Bar */}
      <div
        style={{
          backgroundColor: '#0f172a',
          borderTop: '1px solid #1e293b',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#94a3b8',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>
            Jumlah Kata: <strong style={{ color: '#38bdf8' }}>{wordCount}</strong>
          </span>
          <span>
            Karakter: <strong style={{ color: '#cbd5e1' }}>{charCount}</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} color="#f59e0b" /> Est. Baca: <strong style={{ color: '#f59e0b' }}>~{readingTimeMin} mnt</strong>
          </span>
        </div>

        <div style={{ fontSize: '11px', color: '#64748b' }}>
          💡 Tip: Gunakan tombol toolbar untuk menambahkan <strong>Tebal</strong>, <i>Miring</i>, <u>Sub-Judul</u>, atau <b>Kutipan</b>.
        </div>
      </div>
    </div>
  );
};

const toolbarButtonStyle: React.CSSProperties = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  color: '#e2e8f0',
  borderRadius: '4px',
  padding: '5px 9px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  transition: 'all 0.15s ease',
};

const separatorStyle: React.CSSProperties = {
  width: '1px',
  height: '18px',
  backgroundColor: '#334155',
  margin: '0 4px',
};
