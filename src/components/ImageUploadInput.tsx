import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, Trash2, CheckCircle2 } from 'lucide-react';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  captionValue?: string;
  onCaptionChange?: (caption: string) => void;
  captionPlaceholder?: string;
  helperText?: string;
  required?: boolean;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  captionValue,
  onCaptionChange,
  captionPlaceholder = 'Contoh: Suasana Rapat Paripurna di Jakarta / Foto: Redaksi ASQI NEWS',
  helperText,
  required = false,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress & convert file to Base64
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WEBP, GIF)');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200; // Resize large images for optimal local/DB storage

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          onChange(dataUrl);
        } else {
          onChange(e.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        onChange(e.target?.result as string);
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ImageIcon size={16} color="#38bdf8" /> {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#1e293b', padding: '2px', borderRadius: '6px' }}>
          <button
            type="button"
            onClick={() => setMode('upload')}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: mode === 'upload' ? '#0284c7' : 'transparent',
              color: mode === 'upload' ? '#ffffff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Upload size={12} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: mode === 'url' ? '#0284c7' : 'transparent',
              color: mode === 'url' ? '#ffffff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <LinkIcon size={12} /> Input URL
          </button>
        </div>
      </div>

      {helperText && (
        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: 0, marginBottom: '10px' }}>
          {helperText}
        </p>
      )}

      {/* Mode Upload File */}
      {mode === 'upload' ? (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {value ? (
            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155', backgroundColor: '#1e293b' }}>
              <div style={{ height: '180px', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617' }}>
                <img src={value} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ padding: '8px 12px', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155' }}>
                <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Gambar Terpasang
                </span>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Trash2 size={12} /> Hapus &amp; Ganti
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: isDragging ? '2px dashed #38bdf8' : '2px dashed #475569',
                backgroundColor: isDragging ? '#1e293b' : '#020617',
                borderRadius: '8px',
                padding: '24px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Upload size={28} color="#38bdf8" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
                {isProcessing ? 'Memproses Gambar...' : 'Klik atau Tarik Foto Ke Sini'}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Mendukung JPG, PNG, WEBP dari galeri HP atau komputer Anda
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mode Input URL */
        <div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #475569',
              backgroundColor: '#020617',
              color: '#ffffff',
              fontSize: '13px',
            }}
          />
          {value && (
            <div style={{ marginTop: '8px', height: '120px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={value} alt="Preview URL" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          )}
        </div>
      )}

      {/* Caption Field */}
      {onCaptionChange !== undefined && (
        <div style={{ marginTop: '12px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
            Keterangan Foto &amp; Sumber (Caption)
          </label>
          <input
            type="text"
            value={captionValue || ''}
            onChange={(e) => onCaptionChange(e.target.value)}
            placeholder={captionPlaceholder}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid #334155',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              fontSize: '12px',
            }}
          />
        </div>
      )}
    </div>
  );
};
