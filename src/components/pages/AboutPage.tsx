import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Award,
  ShieldCheck,
  Target,
  Users,
  FileText,
  TrendingUp,
  Compass,
  CheckCircle2,
  Radio,
  BookOpen,
  Scale,
  MapPin,
  HeartHandshake,
  Sparkles
} from 'lucide-react';

interface AboutPageProps {
  onBackToHome: () => void;
  onNavigateToPage?: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToHome, onNavigateToPage }) => {
  const [activeTab, setActiveTab] = useState<'profil' | 'visimisi' | 'nilai' | 'program' | 'legalitas'>('profil');

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b', paddingBottom: '60px' }}>
      {/* BREADCRUMB & HEADER BANNER */}
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '40px 20px 30px 20px',
          borderBottom: '4px solid #0284c7',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* TOP NAV BAR */}
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
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowLeft size={16} /> Kembali ke Beranda Utama
            </button>

            <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ cursor: 'pointer', color: '#38bdf8' }} onClick={onBackToHome}>Beranda</span>
              <span>/</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>Tentang ASQI NEWS</span>
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
              PROFIL RESMI MEDIA PERS
            </span>
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>| Pendiri &amp; Pemred: Daros Sahadi</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'serif', margin: '0 0 12px 0', lineHeight: 1.2 }}>
            Tentang ASQI NEWS
          </h1>
          <p style={{ fontSize: '16px', color: '#cbd5e1', maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>
            Portal berita nasional dan poin otoritas utama pelayanan publik di Indonesia.
            Menyuarakan pelayanan publik yang objektif, transparan, solutif, dan berdampak nyata bagi seluruh rakyat Indonesia.
          </p>
        </div>
      </div>

      {/* QUICK STATS STRIP */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Building2 color="#0284c7" size={28} />
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Naungan Ekosistem</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Asosiasi Service Quality Indonesia</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users color="#e11d48" size={28} />
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Dewan Pakar Utama</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Prof. Mansur Ahmad</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Scale color="#16a34a" size={28} />
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Payung Hukum Pers</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>UU No. 40 / 1999 &amp; UU No. 25 / 2009</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Radio color="#d97706" size={28} />
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Kerapatan Berita</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>50 - 100 Rilis Berita / Hari</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: '1100px', margin: '32px auto 0 auto', padding: '0 20px' }}>
        {/* TABS NAVIGATION */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '2px solid #e2e8f0',
            marginBottom: '32px',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}
        >
          {[
            { id: 'profil', label: 'Profil & Latar Belakang', icon: Compass },
            { id: 'visimisi', label: 'Visi & Misi', icon: Target },
            { id: 'nilai', label: 'Nilai Utama & Karakter', icon: ShieldCheck },
            { id: 'program', label: 'Program Kerja Berjenjang', icon: TrendingUp },
            { id: 'legalitas', label: 'Legalitas & Legitimasi Hukum', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  backgroundColor: isActive ? '#0f172a' : 'transparent',
                  color: isActive ? '#ffffff' : '#64748b',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  borderBottom: isActive ? '3px solid #0284c7' : 'none',
                }}
              >
                <Icon size={16} color={isActive ? '#38bdf8' : '#64748b'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROFIL & LATAR BELAKANG */}
        {activeTab === 'profil' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '32px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', fontFamily: 'serif' }}>
                Latar Belakang Berdirinya ASQI NEWS
              </h2>

              <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155', marginBottom: '16px' }}>
                Dalam sepuluh tahun terakhir, media arus utama di Indonesia cenderung berfokus pada isu politik, kriminal, dan hiburan sensasional. Sementara itu, media lokal umumnya terbatas pada pemberitaan seremonial kegiatan pemerintahan daerah.
              </p>

              <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155', marginBottom: '20px' }}>
                Di tengah kondisi tersebut, terdapat kebutuhan informasi esensial yang belum terisi secara optimal, yaitu mengenai <strong>kualitas pelayanan publik</strong>. Pemerintah pusat, pemerintah daerah, BUMN, dan BUMD memiliki kewajiban regulatif untuk meningkatkan Indeks Kepuasan Masyarakat (IKM), Sistem Pemerintahan Berbasis Elektronik (SPBE), Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP), serta menindaklanjuti aduan warga secara cepat dan akurat.
              </p>

              <div
                style={{
                  backgroundColor: '#f0f9ff',
                  borderLeft: '4px solid #0284c7',
                  padding: '20px',
                  borderRadius: '0 8px 8px 0',
                  marginBottom: '24px',
                }}
              >
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 800, color: '#0369a1' }}>
                  Amanat &amp; Posisi Strategis ASQI NEWS
                </h4>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#0c4a6e' }}>
                  <strong>ASQI NEWS</strong> hadir untuk mengisi ruang tersebut. ASQI NEWS memposisikan diri bukan sekadar sebagai media berita umum, melainkan sebagai <strong>media solusi nasional</strong> yang berfokus penuh pada pengawalan dan peningkatan kualitas pelayanan publik di seluruh pelosok Indonesia.
                </p>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', fontFamily: 'serif' }}>
                Profil Lembaga &amp; Bimbingan Dewan Pakar
              </h3>

              <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155', marginBottom: '16px' }}>
                ASQI NEWS berada di bawah naungan ekosistem <strong>Asosiasi Service Quality Indonesia (ASQI)</strong> dan mendapatkan bimbingan teknis langsung dari dewan pakar nasional seperti <strong>Profesor Mansur Ahmad</strong>. Pilar pelayanan publik dijadikan sebagai jantung utama seluruh operasional jurnalistik kami.
              </p>

              <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155', margin: 0 }}>
                Pelayanan publik dipandang sebagai <strong>hak dasar seluruh rakyat</strong>. Kewajiban menghadirkan layanan yang adil, cepat, dan transparan berada di tangan pemerintah pusat, pemda, instansi penegak hukum (Tiga Pilar: TNI, Polri, Pemerintah), BUMN, BUMD, hingga korporasi swasta melalui standar layanan konsumen dan kepedulian sosial (CSR).
              </p>
            </div>

            {/* KEY FEATURES GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '44px', height: '44px', backgroundColor: '#e0f2fe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Award color="#0284c7" size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>Poin Otoritas Tunggal</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  Menjadi rujukan nasional utama bagi menteri, gubernur, bupati, walikota, pimpinan BUMN/BUMD, dan jajaran eksekutif korporasi swasta dalam mengevaluasi mutu layanan publik.
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '44px', height: '44px', backgroundColor: '#fef2f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <HeartHandshake color="#e11d48" size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>Jurnalistik Solutif &amp; Empatis</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  Tidak sekadar mengkritik, tetapi memberikan rekomendasi konkret, menayangkan praktik baik (best practices), dan mengangkat perjuangan para petugas pelayanan di garis depan.
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '44px', height: '44px', backgroundColor: '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <BookOpen color="#16a34a" size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>Ekosistem Produk Terpadu</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  Mengintegrasikan rilis berita harian, majalah digital daerah, Forum Humas Pelayanan Prima, Masterclass &amp; Sertifikasi Profesi, hingga Ekspedisi Jurnalistik 3T.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISI & MISI */}
        {activeTab === 'visimisi' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            {/* VISI BOX */}
            <div
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '36px',
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.2)',
                borderLeft: '6px solid #0284c7',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Target size={28} color="#38bdf8" />
                <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '1px', color: '#38bdf8' }}>
                  VISI ASQI NEWS
                </h2>
              </div>
              <p style={{ fontSize: '18px', lineHeight: 1.8, fontWeight: 500, color: '#f1f5f9', margin: 0, fontFamily: 'serif' }}>
                "Menjadi media pers nasional terdepan, terpercaya, dan paling berpengaruh di Indonesia yang mengawal, memajukan, serta menginspirasi peningkatan kualitas pelayanan publik di sektor pemerintahan, BUMN, BUMD, hingga korporasi swasta demi terwujudnya kesejahteraan masyarakat di seluruh pelosok tanah air."
              </p>
            </div>

            {/* MISI LIST */}
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '24px', fontFamily: 'serif' }}>
                MISI ASQI NEWS (5 Pilar Strategis)
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  {
                    num: '01',
                    title: 'Mengawal & Memajukan Mutu Pelayanan Publik',
                    desc: 'Menjadikan pelayanan di dinas daerah, rumah sakit, kantor perizinan, hingga institusi penegak hukum sebagai prioritas utama pemberitaan yang objektif, transparan, dan solutif.',
                    color: '#0284c7',
                  },
                  {
                    num: '02',
                    title: 'Panggung Apresiasi & Inovasi Pelayanan',
                    desc: 'Mengangkat terobosan dan kisah pahlawan pelayanan publik dari instansi pemerintah, BUMN, BUMD, serta kontribusi nyata korporasi swasta ke tingkat nasional.',
                    color: '#e11d48',
                  },
                  {
                    num: '03',
                    title: 'Membangun Sinergi Kehumasan Multisektor',
                    desc: 'Mengedukasi dan mempertemukan praktisi Humas Pemerintah, Humas Tiga Pilar, serta Corporate Communications swasta dalam mempublikasikan standar pelayanan prima secara terbuka.',
                    color: '#16a34a',
                  },
                  {
                    num: '04',
                    title: 'Mendorong Kemudahan Investasi & Kepastian Layanan',
                    desc: 'Menyajikan laporan mendalam mengenai integrasi pelayanan perizinan daerah dan iklim usaha guna menciptakan kolaborasi yang harmonis antara birokrasi dan dunia usaha.',
                    color: '#d97706',
                  },
                  {
                    num: '05',
                    title: 'Menjaga Marwah Pengawasan Publik & Jurnalistik Lapangan',
                    desc: 'Menerjunkan tim jurnalis hingga ke wilayah perbatasan dan pelosok 3T untuk memastikan seluruh warga mendapatkan akses pelayanan publik yang adil dan merata.',
                    color: '#9333ea',
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'flex-start',
                      padding: '20px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: item.color,
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 900,
                        padding: '10px 14px',
                        borderRadius: '8px',
                        lineHeight: 1,
                      }}
                    >
                      {item.num}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>{item.title}</h3>
                      <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NILAI UTAMA & KARAKTER */}
        {activeTab === 'nilai' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '20px', fontFamily: 'serif' }}>
                Nilai-Nilai Utama ASQI NEWS
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '36px' }}>
                <div style={{ border: '1px solid #e2e8f0', padding: '24px', borderRadius: '10px', backgroundColor: '#f8fafc' }}>
                  <div style={{ color: '#0284c7', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Prinsip Pertama</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Pelayanan Publik Sebagai Utama</h3>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    Menjadikan pemenuhan dan perbaikan kualitas layanan kepada masyarakat sebagai tolok ukur utama dalam setiap produk pers yang dihasilkan oleh redaksi.
                  </p>
                </div>

                <div style={{ border: '1px solid #e2e8f0', padding: '24px', borderRadius: '10px', backgroundColor: '#f8fafc' }}>
                  <div style={{ color: '#16a34a', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Prinsip Kedua</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Integritas &amp; Kepatuhan Hukum</h3>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    Berjalan tegak di atas landasan UU Pers, UU Pelayanan Publik, UU Keterbukaan Informasi Publik (KIP), UU Perlindungan Konsumen, serta Kode Etik Jurnalistik.
                  </p>
                </div>

                <div style={{ border: '1px solid #e2e8f0', padding: '24px', borderRadius: '10px', backgroundColor: '#f8fafc' }}>
                  <div style={{ color: '#e11d48', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Prinsip Ketiga</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Solutif, Edukatif &amp; Berimbang</h3>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    Menyajikan berita yang mengedukasi dan memberi jalan keluar bagi birokrasi maupun korporasi, serta tetap adil dalam menjembatani kepentingan publik dan pemerintah.
                  </p>
                </div>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '20px', fontFamily: 'serif' }}>
                Identitas &amp; Karakter Editorial
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '18px', backgroundColor: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #16a34a' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#14532d' }}>1. Objektif dan Solutif</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#166534', lineHeight: 1.6 }}>
                    Pemberitaan dilakukan secara berimbang. Ketika ditemukan persoalan di lapangan, media tidak hanya menyoroti kelemahan tetapi juga menawarkan alternatif solusi dan praktik baik (best practices).
                  </p>
                </div>

                <div style={{ padding: '18px', backgroundColor: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #0284c7' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#0c4a6e' }}>2. Berbasis Data Terukur</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#0369a1', lineHeight: 1.6 }}>
                    Setiap pemberitaan diupayakan memuat data yang dapat diukur seperti angka Indeks Kepuasan Masyarakat (IKM), waktu penyelesaian layanan, indeks SPBE, dan alokasi anggaran publik.
                  </p>
                </div>

                <div style={{ padding: '18px', backgroundColor: '#fff1f2', borderRadius: '8px', borderLeft: '4px solid #e11d48' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#881337' }}>3. Berbasis Lapangan (Jurnalisme Presisi)</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#9f1239', lineHeight: 1.6 }}>
                    Jurnalistik ASQI NEWS dilakukan langsung di lapangan. Kehadiran jurnalis di kantor pelayanan, rumah sakit, kecamatan, hingga wilayah 3T dan perbatasan menjaga marwah pers yang sesungguhnya.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROGRAM KERJA BERJENJANG */}
        {activeTab === 'program' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', fontFamily: 'serif' }}>
                Struktur Program Kerja Berjenjang
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px', lineHeight: 1.6 }}>
                Keunggulan ASQI NEWS terletak pada struktur program yang berjenjang, saling mengunci, dan memberikan dampak sistematis bagi pemangku kepentingan.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {/* HARIAN */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px', backgroundColor: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#0284c7', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px' }}>PROGRAM HARIAN</span>
                    <Radio size={18} color="#0284c7" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Mesin Penggerak &amp; Dominasi Digital</h3>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '14px' }}>
                    Menerbitkan 50 hingga 100 rilis berita per hari secara konsisten dengan porsi: 40% Pelayanan Daerah, 30% Tiga Pilar, 20% Kebijakan Pusat/BUMN/BUMD, dan 10% Suara Warga &amp; Inovasi.
                  </p>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7' }}>✓ Dominasi mesin pencari Google &amp; berita tercepat</div>
                </div>

                {/* MINGGUAN */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px', backgroundColor: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#e11d48', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px' }}>PROGRAM MINGGUAN</span>
                    <MapPin size={18} color="#e11d48" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Sepekan ASQI di Kabupaten/Kota</h3>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '14px' }}>
                    Selama 7 hari tim jurnalis membedah kualitas pelayanan pemda, perizinan, kesehatan, pendidikan, dan Tiga Pilar. Menghasilkan 30 berita online, 10 video, dan majalah digital edisi khusus kabupaten.
                  </p>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#e11d48' }}>✓ Dokumentasi kinerja LAKIP &amp; Ombudsman</div>
                </div>

                {/* BULANAN */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px', backgroundColor: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#16a34a', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px' }}>PROGRAM BULANAN</span>
                    <Users size={18} color="#16a34a" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Forum Humas Pelayanan Prima</h3>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '14px' }}>
                    Wadah edukasi, webinar nasional, masterclass intensif, dan sertifikasi profesi ASQI yang mempertemukan humas birokrasi dan Corporate Communications swasta se-Indonesia.
                  </p>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>✓ Database nasional pejabat humas &amp; e-sertifikat</div>
                </div>

                {/* TRIWULAN */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px', backgroundColor: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#d97706', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px' }}>PROGRAM TRIWULAN</span>
                    <Compass size={18} color="#d97706" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Ekspedisi Jurnalistik Nusantara</h3>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '14px' }}>
                    Penjelajahan lapangan 2-4 minggu ke wilayah 3T (Tertinggal, Terdepan, Terluar) dan perbatasan untuk merekam kehadiran layanan negara serta kontribusi sosial swasta di garis depan.
                  </p>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#d97706' }}>✓ Serial artikel, film dokumenter, &amp; e-book laporan</div>
                </div>
              </div>

              {/* PROGRAM KHUSUS BANNER */}
              <div
                style={{
                  marginTop: '32px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '28px',
                  borderRadius: '12px',
                  borderLeft: '6px solid #e11d48',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={20} color="#fbbf24" />
                  <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>PROGRAM LIPUTAN KHUSUS UNGGULAN</span>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 10px 0', color: '#ffffff', fontFamily: 'serif' }}>
                  "Garis Depan — Pahlawan Pelayanan Publik"
                </h3>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 16px 0' }}>
                  Memotret sisi paling manusiawi dari para petugas lapangan melalui metode <i>live in 24-48 jam</i> bersama nakes malam, bidan desa, pemadam kebakaran, teknisi PLN, penjaga pintu air, patroli polisi, dan petugas sosial lainnya. Menggugah empati pembaca dan memicu apresiasi pimpinan instansi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LEGALITAS & LEGITIMASI HUKUM */}
        {activeTab === 'legalitas' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Scale size={28} color="#0284c7" />
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'serif' }}>
                  Payung Hukum &amp; Legitimasi Operasional
                </h2>
              </div>

              <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.8, marginBottom: '24px' }}>
                Seluruh kegiatan penerbitan dan operasional jurnalistik ASQI NEWS bersandar teguh pada payung hukum resmi Negara Kesatuan Republik Indonesia:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {[
                  {
                    title: 'UU No. 40 Tahun 1999 tentang Pers',
                    desc: 'Menjamin kebebasan, independensi, dan perlindungan hukum bagi kerja redaksi dan jurnalis di lapangan.',
                  },
                  {
                    title: 'UU No. 25 Tahun 2009 tentang Pelayanan Publik',
                    desc: 'Menjadi acuan standar utama penilaian kinerja dan pemenuhan hak masyarakat atas layanan publik.',
                  },
                  {
                    title: 'UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik (KIP)',
                    desc: 'Landasan akses transparansi informasi publik dan hak tahu warga negara.',
                  },
                  {
                    title: 'UU No. 8 Tahun 1999 tentang Perlindungan Konsumen',
                    desc: 'Panduan hak konsumen atas pelayanan dan perlindungan standar mutu.',
                  },
                  {
                    title: 'Peraturan Presiden &amp; Permen PANRB',
                    desc: 'Panduan teknis evaluasi reformasi birokrasi, Indeks Kepuasan Masyarakat (IKM), dan SPBE.',
                  },
                  {
                    title: 'Kode Etik Jurnalistik (KEJ)',
                    desc: 'Pedoman perilaku profesionalisme wartawan Indonesia dalam menyajikan berita yang akurat dan berimbang.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '20px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontWeight: 800, marginBottom: '6px', fontSize: '14px' }}>
                      <CheckCircle2 size={16} /> {item.title}
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: '28px',
                  padding: '20px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '8px',
                  borderLeft: '4px solid #0284c7',
                }}
              >
                <p style={{ margin: 0, fontSize: '14px', color: '#0369a1', lineHeight: 1.6 }}>
                  <strong>Legitimasi Kerjasama Instansi:</strong> Dengan payung hukum yang kokoh ini, setiap dinas daerah, polres/kodim, BUMN, BUMD, maupun pemerintah kota/kabupaten memandang kemitraan publikasi dengan ASQI NEWS sebagai bagian dari pelaksanaan amanat undang-undang dan tugas kedinasan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM CALL TO ACTION FOR DATA SERVICES / CONTACT */}
        <div
          style={{
            marginTop: '40px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '32px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff' }}>
              Membutuhkan Riset Data atau Kemitraan Pelayanan Publik?
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, maxWidth: '600px' }}>
              Jelajahi Layanan Informasi Data ASQI NEWS untuk konsultasi keterbukaan informasi, survei IKM, atau pendaftaran Forum Humas Pelayanan Prima.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {onNavigateToPage && (
              <button
                onClick={() => onNavigateToPage('/layanan-informasi-data')}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <FileText size={16} /> Buka Layanan Informasi Data
              </button>
            )}

            <button
              onClick={onBackToHome}
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid #475569',
                padding: '12px 20px',
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
