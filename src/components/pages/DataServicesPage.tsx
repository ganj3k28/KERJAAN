import React, { useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Database,
  FileSpreadsheet,
  Users,
  Award,
  BookOpen,
  Send,
  CheckCircle2,
  HelpCircle,
  Building2,
  Search,
  Download,
  Filter,
  ShieldAlert
} from 'lucide-react';

interface DataServicesPageProps {
  onBackToHome: () => void;
  onNavigateToPage?: (path: string) => void;
}

export const DataServicesPage: React.FC<DataServicesPageProps> = ({ onBackToHome, onNavigateToPage }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    institutionType: 'Pemda / Dinas',
    email: '',
    phone: '',
    serviceType: 'Pusat Data IKM & SAKIP',
    notes: '',
  });

  const services = [
    {
      id: 'ikm',
      category: 'Riset & Statistik',
      title: 'Pusat Data Indeks Kepuasan Masyarakat (IKM) & SAKIP',
      desc: 'Basis data terpadu hasil survei dan pemetaan berkala mutu pelayanan publik pemda, BUMN, BUMD, RSUD, dan kantor perizinan se-Indonesia.',
      icon: BarChart3,
      badgeColor: '#0284c7',
      outputs: ['Laporan Tren IKM Tahunan', 'Benchmarking Antar Daerah', 'Rekomendasi Perbaikan Service Standard'],
    },
    {
      id: 'humas',
      category: 'Komunitas & Kehumasan',
      title: 'Forum Humas Pelayanan Prima & Directory Pejabat',
      desc: 'Wadah sinergi bulanan, webinar nasional, dan basis data terbesar yang mempertemukan praktisi Humas Pemerintah, Tiga Pilar, dan Corporate Communications.',
      icon: Users,
      badgeColor: '#16a34a',
      outputs: ['Akses Webinar Bulanan', 'Direktori Kontak Humas Nasional', 'Jejaring Komunikasi Krisis'],
    },
    {
      id: 'sertifikasi',
      category: 'Edukasi & Pelatihan',
      title: 'Masterclass & Sertifikasi Profesi Humas ASQI',
      desc: 'Program sertifikasi profesi kehumasan berbasis standar kompetensi publikasi pelayanan prima dan manajemen komunikasi krisis birokrasi.',
      icon: Award,
      badgeColor: '#d97706',
      outputs: ['Sertifikat Profesi ASQI', 'Modul Strategi Komunikasi Publik', 'Bimbingan Dewan Pakar'],
    },
    {
      id: 'majalah',
      category: 'Publikasi Khusus',
      title: 'Majalah Digital Edisi Khusus Kabupaten / Kota',
      desc: 'Dokumentasi komprehensif program "Sepekan ASQI di Kabupaten" yang membedah inovasi daerah, kepuasan warga, dan kemudahan investasi.',
      icon: BookOpen,
      badgeColor: '#e11d48',
      outputs: ['Majalah PDF Interaktif 50 Halaman', 'Dokumentasi Kinerja LAKIP', 'Video Profil Layanan'],
    },
    {
      id: 'ekspedisi',
      category: 'Jurnalistik Lapangan',
      title: 'Laporan Riset Lapangan Ekspedisi Nusantara 3T',
      desc: 'Data empiris dan catatan jurnalisme presisi mengenai kondisi nyata kehadiran layanan publik di daerah 3T (Tertinggal, Terdepan, Terluar).',
      icon: Database,
      badgeColor: '#9333ea',
      outputs: ['E-Book Riset 3T', 'Foto & Video Dokumen Lapangan', 'Rekomendasi Kebijakan Pusat'],
    },
    {
      id: 'permohonan',
      category: 'Layanan Mandiri',
      title: 'Layanan Permohonan Data & Audit Keterbukaan Publik',
      desc: 'Layanan permohonan informasi data khusus berbasis UU KIP No. 14 / 2008 bagi peneliti, akademisi, instansi pemerintah, dan masyarakat.',
      icon: FileSpreadsheet,
      badgeColor: '#0f172a',
      outputs: ['Data Mentah Format CSV/Excel', 'Surat Jawaban Permohonan Resmi', 'Sertifikat Klarifikasi Data'],
    },
  ];

  const filteredServices = selectedCategory === 'semua'
    ? services
    : services.filter((s) => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
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
          borderBottom: '4px solid #0284c7',
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
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>Layanan Informasi Data</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '4px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              PUSAT DATA &amp; INFORMASI PUBLIK ASQI NEWS
            </span>
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>| Berbasis UU KIP No. 14 / 2008 &amp; Permen PANRB</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'serif', margin: '0 0 12px 0', lineHeight: 1.2 }}>
            Layanan Informasi Data Pelayanan Publik
          </h1>
          <p style={{ fontSize: '16px', color: '#cbd5e1', maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>
            Pusat rujukan data nasional, analisis Indeks Kepuasan Masyarakat (IKM), pendaftaran Forum Humas Pelayanan Prima, serta konsultasi keterbukaan informasi instansi.
          </p>
        </div>
      </div>

      {/* CATEGORY FILTER BAR */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '2px' }}>
          {[
            { id: 'semua', label: 'Semua Layanan Data' },
            { id: 'Riset', label: 'Riset & IKM' },
            { id: 'Komunitas', label: 'Forum Humas' },
            { id: 'Edukasi', label: 'Masterclass & Sertifikasi' },
            { id: 'Publikasi', label: 'Majalah & Riset 3T' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                backgroundColor: selectedCategory === cat.id ? '#0f172a' : '#f1f5f9',
                color: selectedCategory === cat.id ? '#ffffff' : '#475569',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: '1100px', margin: '32px auto 0 auto', padding: '0 20px' }}>
        {/* SERVICES GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '28px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span
                      style={{
                        backgroundColor: service.badgeColor,
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {service.category}
                    </span>
                    <Icon size={24} color={service.badgeColor} />
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'serif' }}>
                    {service.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                    {service.desc}
                  </p>

                  <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Output / Dokumen Yang Diperoleh:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {service.outputs.map((out, idx) => (
                        <li key={idx} style={{ fontSize: '12px', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={14} color={service.badgeColor} /> {out}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href="#form-permohonan"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, serviceType: service.title }));
                  }}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    padding: '10px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '13px',
                    textDecoration: 'none',
                  }}
                >
                  Ajukan Permohonan Data Ini ↓
                </a>
              </div>
            );
          })}
        </div>

        {/* INTERACTIVE DATA REQUEST FORM */}
        <div
          id="form-permohonan"
          style={{
            backgroundColor: '#ffffff',
            padding: '36px',
            borderRadius: '12px',
            border: '2px solid #0284c7',
            boxShadow: '0 8px 24px rgba(2, 132, 199, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <FileSpreadsheet size={28} color="#0284c7" />
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'serif' }}>
              Formulir Pengajuan Permohonan Informasi Data &amp; Kemitraan
            </h2>
          </div>

          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>
            Silakan isi formulir resmi di bawah ini. Tim Pusat Data ASQI NEWS akan memproses permohonan Anda secara transparan sesuai ketentuan PPID dan UU Keterbukaan Informasi Publik.
          </p>

          {formSubmitted ? (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '32px', borderRadius: '10px', textAlign: 'center' }}>
              <CheckCircle2 size={48} color="#16a34a" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#14532d', margin: '0 0 8px 0' }}>
                Permohonan Informasi Data Berhasil Dikirim!
              </h3>
              <p style={{ fontSize: '14px', color: '#166534', maxWidth: '600px', margin: '0 auto 16px auto', lineHeight: 1.6 }}>
                Nomor Registrasi Permohonan Anda: <strong>REG-ASQI-DAT-{Math.floor(100000 + Math.random() * 900000)}</strong>.
                Tim Layanan Informasi Data akan mengirimkan tanggapan resmi dan berkas data ke email <strong>{formData.email}</strong> dalam waktu maksimal 1x24 jam kerja.
              </p>

              <button
                onClick={() => setFormSubmitted(false)}
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Buat Permohonan Baru
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Nama Pemohon / Peneliti *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap beserta gelar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Jenis Instansi Pemohon *
                </label>
                <select
                  value={formData.institutionType}
                  onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                >
                  <option value="Pemda / Dinas">Pemerintah Daerah / Dinas</option>
                  <option value="BUMN / BUMD">BUMN / BUMD</option>
                  <option value="Institusi TNI / Polri / Tiga Pilar">Institusi TNI / Polri / Tiga Pilar</option>
                  <option value="Korporasi Swasta">Korporasi Swasta</option>
                  <option value="Perguruan Tinggi / Peneliti">Perguruan Tinggi / Peneliti</option>
                  <option value="Masyarakat Umum / LSM">Masyarakat Umum / Warga</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Nama Instansi / Perusahaan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bappeda Kab. Bogor / RSUD Kota Bandung"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Jenis Layanan Data Yang Dimenyukai *
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Email Resmi Aktif *
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@instansi.go.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Nomor Telepon / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Rincian Kebutuhan Data &amp; Catatan Penggunaan *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan spesifikasi data pelayanan publik yang Anda butuhkan, wilayah target, serta periode data yang diminta..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)',
                  }}
                >
                  <Send size={16} /> Kirim Pengajuan Permohonan Data
                </button>
              </div>
            </form>
          )}
        </div>

        {/* BOTTOM NAV */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button
            onClick={onBackToHome}
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
            <ArrowLeft size={16} /> Kembali ke Beranda Utama
          </button>
        </div>
      </div>
    </div>
  );
};
