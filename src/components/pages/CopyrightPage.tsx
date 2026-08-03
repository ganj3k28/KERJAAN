import React, { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  Copyright,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  Send,
  HelpCircle
} from 'lucide-react';

interface CopyrightPageProps {
  onBackToHome: () => void;
  onNavigateToPage?: (path: string) => void;
}

export const CopyrightPage: React.FC<CopyrightPageProps> = ({ onBackToHome, onNavigateToPage }) => {
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    email: '',
    contentRequest: '',
    purpose: '',
  });

  const quoteTemplate = `Sumber: ASQI NEWS (https://asqinews.com)\nSebagaimana dilaporkan oleh ASQI NEWS pada artikel "[Judul Artikel]", mengenai [ringkasan isu pelayanan publik].`;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(quoteTemplate);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b', paddingBottom: '60px' }}>
      {/* HEADER BANNER */}
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '40px 20px 30px 20px',
          borderBottom: '4px solid #e11d48',
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
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>Siber &amp; Hak Cipta</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span
              style={{
                backgroundColor: '#e11d48',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '4px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              KETENTUAN HUKUM &amp; HAK KEKAYAAN INTELEKTUAL
            </span>
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>| UU No. 28 / 2014 &amp; UU No. 40 / 1999</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'serif', margin: '0 0 12px 0', lineHeight: 1.2 }}>
            Siber &amp; Hak Cipta ASQI NEWS
          </h1>
          <p style={{ fontSize: '16px', color: '#cbd5e1', maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>
            Perlindungan hak cipta atas seluruh produk pers, data riset, infografis, video, dan majalah digital yang diterbitkan oleh ASQI NEWS.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1100px', margin: '32px auto 0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }}>
          {/* SECTION 1: HAK CIPTA KARYA PERS */}
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Copyright size={26} color="#e11d48" />
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'serif' }}>
                1. Perlindungan Hak Cipta Karya Jurnalistik
              </h2>
            </div>

            <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.8, marginBottom: '16px' }}>
              Seluruh materi yang berada di portal berita <strong>ASQI NEWS</strong> — termasuk namun tidak terbatas pada artikel tulisan berita, laporan khusus, hasil wawancara, grafik analisis data (Databoks), gambar infografis, film dokumenter pendek, majalah digital edisi kabupaten, nama logo merek, dan tata letak desain — dilindungi penuh oleh:
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#16a34a" /> Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#16a34a" /> Undang-Undang Republik Indonesia Nomor 40 Tahun 1999 tentang Pers.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#16a34a" /> Peraturan dan Perjanjian Internasional Hak Atas Kekayaan Intelektual (HAKI).
              </li>
            </ul>

            <div style={{ padding: '16px', backgroundColor: '#fff1f2', borderRadius: '8px', borderLeft: '4px solid #e11d48' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#9f1239', lineHeight: 1.6 }}>
                <strong>Peringatan Tegas:</strong> Dilarang keras menggandakan, menyalin, memodifikasi, mengedarkan kembali, mencetak ulang, atau memperjualbelikan materi karya pers ASQI NEWS secara ilegal tanpa izin tertulis resmi dari Pemimpin Redaksi ASQI NEWS.
              </p>
            </div>
          </div>

          {/* SECTION 2: ATURAN PENGUTIPAN BERITA */}
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <FileText size={26} color="#0284c7" />
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'serif' }}>
                2. Ketentuan Pengutipan &amp; Referensi Akademik
              </h2>
            </div>

            <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.8, marginBottom: '16px' }}>
              Pengutipan materi berita atau data publikasi ASQI NEWS untuk kepentingan akademik, penelitian, pendidikan, atau referensi pers non-komersial diperbolehkan dengan syarat wajib mematuhi aturan berikut:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '18px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#0284c7', marginBottom: '6px' }}>Batas Pengutipan Teks</div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                  Maksimal mengambil 2 (dua) paragraf atau tidak lebih dari 250 kata. Dilarang meng-copy paste keseluruhan artikel berita secara utuh.
                </p>
              </div>

              <div style={{ padding: '18px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#0284c7', marginBottom: '6px' }}>Kredit Sumber &amp; Hyperlink</div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                  Wajib mencantumkan secara eksplisit "Sumber: ASQI NEWS" disertai tautan balik (hyperlink) aktif langsung menuju halaman artikel asli.
                </p>
              </div>

              <div style={{ padding: '18px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#0284c7', marginBottom: '6px' }}>Larangan Distorsi Makna</div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                  Pengutipan tidak boleh mengubah makna asal berita atau memicu bias/persepsi palsu yang merugikan narasumber.
                </p>
              </div>
            </div>

            {/* QUOTE BOX TEMPLATE */}
            <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '20px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                  CONTOH FORMAT ATTRIBUSI KUTIPAN RESMI
                </span>
                <button
                  onClick={handleCopyQuote}
                  style={{
                    backgroundColor: copiedQuote ? '#16a34a' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {copiedQuote ? <Check size={14} /> : <Copy size={14} />}
                  {copiedQuote ? 'Tersalin' : 'Salin Format'}
                </button>
              </div>
              <pre
                style={{
                  margin: 0,
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  color: '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                }}
              >
                {quoteTemplate}
              </pre>
            </div>
          </div>

          {/* SECTION 3: PERMOHONAN HAK LISENSI KOMERSIAL & SINDIKASI */}
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Lock size={26} color="#16a34a" />
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'serif' }}>
                3. Lisensi Komersial &amp; Permohonan Sindikasi Data
              </h2>
            </div>

            <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.8, marginBottom: '20px' }}>
              Bagi lembaga pemerintahan, instansi pemda, BUMN, BUMD, korporasi swasta, atau penerbit media yang membutuhkan penggunaan materi ASQI NEWS (seperti penerbitan ulang majalah digital, penggunaan grafik data IKM, atau sindikasi berita), silakan kirimkan formulir permohonan izin resmi di bawah ini:
            </p>

            {formSubmitted ? (
              <div style={{ padding: '24px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                <CheckCircle2 size={36} color="#16a34a" style={{ marginBottom: '8px' }} />
                <h3 style={{ margin: '0 0 6px 0', color: '#14532d', fontSize: '18px' }}>Permohonan Izin Berhasil Terkirim!</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#166534' }}>
                  Tim Legal &amp; Sindikasi Redaksi ASQI NEWS akan menghubungi Anda melalui email atau telepon resmi dalam waktu 1x24 jam kerja.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Nama Lengkap Pemohon *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso, S.STP"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Nama Instansi / Perusahaan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dinas Kominfo / PT PLN (Persero)"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Email Resmi *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@instansi.go.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Tujuan Penggunaan Konten *
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="">-- Pilih Tujuan --</option>
                    <option value="Laporan Kinerja Pemda (LAKIP)">Laporan Kinerja Pemda (LAKIP / SAKIP)</option>
                    <option value="Penerbitan Ulang Majalah Digital">Penerbitan Ulang Majalah Digital</option>
                    <option value="Penggunaan Data Riset IKM">Penggunaan Data Riset IKM &amp; Databoks</option>
                    <option value="Sindikasi Berita Cetak/Digital">Sindikasi Berita Cetak / Digital</option>
                    <option value="Lainnya">Tujuan Lainnya</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                    Rincian Artikel / Data yang Dimohonkan *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Sebutkan judul berita, link artikel, atau infografis data yang ingin Anda mohonkan lisensinya..."
                    value={formData.contentRequest}
                    onChange={(e) => setFormData({ ...formData, contentRequest: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  ></textarea>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Send size={15} /> Kirim Permohonan Izin Lisensi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div
          style={{
            marginTop: '40px',
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            Butuh informasi layanan data publik? Kunjungi <strong style={{ color: '#0f172a' }}>Layanan Informasi Data</strong>.
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {onNavigateToPage && (
              <button
                onClick={() => onNavigateToPage('/layanan-informasi-data')}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Layanan Informasi Data
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
