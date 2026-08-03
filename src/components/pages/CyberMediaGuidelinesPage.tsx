import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  FileCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Globe,
  BookOpen,
  Scale
} from 'lucide-react';

interface CyberMediaGuidelinesPageProps {
  onBackToHome: () => void;
  onNavigateToPage?: (path: string) => void;
}

export const CyberMediaGuidelinesPage: React.FC<CyberMediaGuidelinesPageProps> = ({
  onBackToHome,
  onNavigateToPage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const guidelines = [
    {
      pasal: 'Pasal 1',
      title: 'Ruang Lingkup dan Definisi',
      content: [
        'Media Siber adalah media massa di Indonesia yang menggunakan media internet dalam melaksanakan kegiatan jurnalistik, serta memenuhi persyaratan Undang-Undang Pers dan Standar Perusahaan Pers yang ditetapkan Dewan Pers.',
        'Isi Buatan Pengguna (User Generated Content/UGC) adalah segala isi yang dibuat dan/atau diunggah oleh pengguna media siber, antara lain berupa komentar, opini, unggahan forum, foto, atau video.',
      ],
    },
    {
      pasal: 'Pasal 2',
      title: 'Verifikasi dan Keseimbangan Berita',
      content: [
        'Pada prinsipnya setiap berita harus melalui proses verifikasi dan memenuhi prinsip keberimbangan (cover both sides).',
        'Berita yang dapat merugikan pihak lain memerlukan verifikasi pada berita yang sama untuk memenuhi prinsip keberimbangan.',
        'Dalam hal berita tidak dapat diverifikasi secara instan karena urgensi publik, berita dapat ditayangkan dengan syarat: (a) Memuat keterangan bahwa berita masih memerlukan verifikasi lanjut; (b) Mencantumkan upaya konfirmasi yang telah dilakukan.',
      ],
    },
    {
      pasal: 'Pasal 3',
      title: 'Isi Buatan Pengguna (User Generated Content / UGC)',
      content: [
        'Media siber wajib mencantumkan syarat dan ketentuan mengenai Isi Buatan Pengguna yang tidak bertentangan dengan Undang-Undang Pers dan Kode Etik Jurnalistik.',
        'Pengguna dilarang mengunggah isi yang mengandung unsur fitnah, ujaran kebencian, SARA, pornografi, kekerasan, atau pelanggaran hak cipta.',
        'Media siber berhak dan wajib mengedit atau menghapus UGC yang dilaporkan melanggar aturan dalam waktu selambat-lambatnya 2 x 24 jam.',
      ],
    },
    {
      pasal: 'Pasal 4',
      title: 'Ralat, Koreksi, dan Hak Jawab',
      content: [
        'Ralat, koreksi, dan hak jawab mengacu pada Undang-Undang Pers, Kode Etik Jurnalistik, dan Pedoman Hak Jawab yang ditetapkan Dewan Pers.',
        'Ralat, koreksi, dan/atau hak jawab wajib ditautkan (hyperlink) pada berita yang diralat, dikoreksi, atau yang diberi hak jawab.',
        'Pada setiap berita yang diralat atau dikoreksi, wajib dicantumkan waktu pemutakhiran (update) dan keterangan ralat secara transparan.',
      ],
    },
    {
      pasal: 'Pasal 5',
      title: 'Pencabutan Berita',
      content: [
        'Berita yang sudah dipublikasikan tidak dapat dicabut karena alasan penyensoran oleh pihak luar redaksi, kecuali terkait masalah SARA, kesusilaan, masa depan anak, atau sesuai pertimbangan khusus Dewan Pers.',
        'Pencabutan berita wajib disertai alasan yang diumumkan secara terbuka kepada publik.',
      ],
    },
    {
      pasal: 'Pasal 6',
      title: 'Iklan, Sponsorship, dan Kemitraan',
      content: [
        'Media siber wajib membedakan secara tegas antara produk jurnalistik (berita) dan iklan / isi berbayar (Advertorial, Kemitraan Publikasi, Sponsored Content).',
        'Setiap materi berbayar atau kemitraan wajib mencantumkan label yang jelas seperti "Iklan", "Advertorial", atau "Kemitraan Publikasi".',
      ],
    },
    {
      pasal: 'Pasal 7',
      title: 'Hak Cipta dan Kutipan Berita',
      content: [
        'Pengutipan berita dari media siber lain wajib mencantumkan sumber asli secara jelas dan melampirkan pranala balik (hyperlink) aktif menuju artikel asal.',
        'Pengutipan dilakukan secara proporsional dan tidak mengambil secara utuh (illegal scraping/copypaste).',
      ],
    },
    {
      pasal: 'Pasal 8',
      title: 'Ketaatan pada Hukum dan Kode Etik',
      content: [
        'ASQI NEWS tunduk dan taat sepenuhnya pada Undang-Undang No. 40 Tahun 1999 tentang Pers, Kode Etik Jurnalistik (KEJ), Pedoman Pemberitaan Media Siber Dewan Pers, serta regulasi Keterbukaan Informasi Publik (KIP).',
      ],
    },
  ];

  const filtered = guidelines.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.pasal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.content.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b', paddingBottom: '60px' }}>
      {/* HEADER BANNER */}
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '40px 20px 30px 20px',
          borderBottom: '4px solid #16a34a',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={onBackToHome}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} /> Kembali ke Beranda Utama
            </button>

            <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ cursor: 'pointer', color: '#38bdf8' }} onClick={onBackToHome}>Beranda</span>
              <span>/</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>Pedoman Media Siber</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '4px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              STANDAR ETIKA JURNALISTIK SIBER
            </span>
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>| Ketetapan Dewan Pers &amp; Redaksi ASQI NEWS</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'serif', margin: '0 0 12px 0', lineHeight: 1.2 }}>
            Pedoman Pemberitaan Media Siber
          </h1>
          <p style={{ fontSize: '16px', color: '#cbd5e1', maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>
            Kepatuhan penuh pada aturan pers digital nasional guna menjamin independensi, akurasi, keberimbangan, dan perlindungan hak-hak publik.
          </p>
        </div>
      </div>

      {/* SEARCH & QUICK STATS */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Cari kata kunci pasal (misal: verifikasi, hak jawab, iklan, ralat)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '13px', color: '#475569' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <ShieldCheck color="#16a34a" size={18} /> Patuh Kode Etik Jurnalistik
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <Scale color="#0284c7" size={18} /> Sesuai UU No. 40/1999 Pers
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1100px', margin: '32px auto 0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {filtered.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#64748b' }}>
              <AlertCircle size={36} color="#e11d48" style={{ marginBottom: '12px' }} />
              <h3>Pasal tidak ditemukan</h3>
              <p>Coba gunakan kata kunci lain seperti "verifikasi", "ralat", "hak jawab", atau "iklan".</p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const fullText = `${item.pasal} - ${item.title}\n\n` + item.content.join('\n');
              return (
                <div
                  key={item.pasal}
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '28px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 800,
                          padding: '6px 12px',
                          borderRadius: '6px',
                        }}
                      >
                        {item.pasal}
                      </span>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'serif' }}>
                        {item.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => handleCopy(fullText, index)}
                      style={{
                        backgroundColor: copiedIndex === index ? '#16a34a' : '#f1f5f9',
                        color: copiedIndex === index ? '#ffffff' : '#475569',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
                      {copiedIndex === index ? 'Tersalin' : 'Salin Teks Pasal'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {item.content.map((p, pIdx) => (
                      <div
                        key={pIdx}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start',
                          fontSize: '14px',
                          lineHeight: 1.7,
                          color: '#334155',
                        }}
                      >
                        <CheckCircle2 size={16} color="#16a34a" style={{ marginTop: '4px', flexShrink: 0 }} />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* BOTTOM NAV / NAVIGATION TO OTHER LEGAL PAGES */}
        <div
          style={{
            marginTop: '40px',
            backgroundColor: '#ffffff',
            padding: '28px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
              Informasi Hak Cipta &amp; Lisensi Kutipan Berita
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Pelajari ketentuan hak cipta dan syarat izin pengutipan berita ASQI NEWS secara komersial dan non-komersial.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {onNavigateToPage && (
              <button
                onClick={() => onNavigateToPage('/hak-cipta')}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Globe size={15} /> Laman Siber &amp; Hak Cipta
              </button>
            )}

            <button
              onClick={onBackToHome}
              style={{
                backgroundColor: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                padding: '10px 18px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
