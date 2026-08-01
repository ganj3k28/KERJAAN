import { InitialData } from './types';

export const initialData: InitialData = {
  carousel: [
    {
      id: 'car-1',
      title: 'Mazda Perkenalkan Tiga Model Baru Sekaligus di GIIAS 2026',
      category: 'Otomotif',
      publishedAt: '29 Juli 2026, 21.30',
      views: 1840,
      snippet: 'PT Eurokars Motor Indonesia (EMI) meluncurkan tiga lini kendaraan terbaru Mazda di ajang GIIAS 2026 dengan teknologi ramah lingkungan.',
      content: `PT Eurokars Motor Indonesia (EMI), agen pemegang merek Mazda di Indonesia, resmi memperkenalkan tiga model kendaraan terbaru dalam ajang Gaikindo Indonesia International Auto Show (GIIAS) 2026.\n\nKetiga model ini menghadirkan perpaduan desain Kodo khas Mazda, teknologi mesin Skyactiv-G yang disempurnakan, serta pengintegrasian sistem e-Skyactiv Mild Hybrid untuk meningkatkan efisiensi bahan bakar dan mereduksi emisi karbon.\n\n"Kehadiran tiga model ini menegaskan komitmen Mazda untuk menghadirkan pengalaman berkendara yang menyenangkan (Jinba-Ittai) sekaligus responsif terhadap tuntutan mobilitas keberlanjutan di Indonesia," ujar Managing Director PT EMI dalam konferensi pers di ICE BSD.`,
      author: 'Tim Redaksi Otomotif',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      tags: ['Mazda', 'GIIAS 2026', 'Otomotif', 'Mobil Listrik']
    },
    {
      id: 'car-2',
      title: 'Prospek Industri Otomotif Indonesia Sambut Era Kendaraan Listrik',
      category: 'Otomotif',
      publishedAt: '29 Juli 2026, 20.00',
      views: 1420,
      snippet: 'Transisi menuju ekosistem EV di Tanah Air kian terakselerasi berkat dukungan regulasi pemerintah dan pembangunan pabrik baterai lokal.',
      content: `Industri otomotif nasional kini berada di ambang transformasi besar seiring percepatan adopsi Kendaraan Bermotor Listrik Berbasis Baterai (KBLBB).\n\nIntegrasi rantai pasok dari hulu ke hilir—mulai dari penambangan nikel hingga fasilitasi perakitan sel baterai di dalam negeri—menjadi daya tarik utama bagi para investor global.\n\nPara analis memproyeksikan penjualan mobil listrik di Indonesia akan tumbuh signifikan hingga 35% pada akhir tahun 2026, didorong oleh insentif perpajakan dan perluasan infrastruktur SPKLU di jalur-jalur tol strategis.`,
      author: 'Analis Ekonomi',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      tags: ['Otomotif', 'EV', 'Baterai Nikel', 'Energi Hijau']
    },
    {
      id: 'car-3',
      title: 'Inovasi Fitur Keselamatan Canggih pada Mobil Modern 2026',
      category: 'Digital',
      publishedAt: '29 Juli 2026, 18.45',
      views: 980,
      snippet: 'Sistem ADAS generasi terbaru terbukti memangkas angka kecelakaan hingga 40% berkat dukungan sensor AI LiDAR dan pemetaan real-time.',
      content: `Fitur keselamatan aktif pada kendaraan modern tahun 2026 tidak lagi sebatas rem ABS atau airbag, melainkan penggabungan kecerdasan buatan (AI) dengan radar LiDAR tingkat tinggi.\n\nSistem Advanced Driver Assistance Systems (ADAS) mampu mendeteksi potensi bahaya hingga jarak 250 meter dalam kondisi cuaca buruk sekalipun.\n\nUji coba independen menunjukkan bahwa integrasi pemetaan presisi tinggi dengan pengereman otomatis darurat berhasil menurunkan risiko benturan dari belakang secara drastis.`,
      author: 'Editor Teknologi',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      tags: ['ADAS', 'Teknologi', 'AI', 'Safety']
    }
  ],
  articles: [
    {
      id: 'art-1',
      title: 'Danantara Housing Expo 2026 Hadirkan 200.000 Hunian, Dukung Program 3 Juta Rumah',
      category: 'Industri',
      publishedAt: '29 JULI 2026, 21.04',
      views: 2450,
      snippet: 'Danantara Housing Expo 2026 digelar di ICE BSD PK 2, 27-30 Agustus 2026, untuk mendukung Program 3 Juta Rumah.',
      content: `Pemerintah bersama Badan Pengelola Investasi Danantara menggelar Danantara Housing Expo 2026 di Hall 3-5 ICE BSD. Pameran properti terbesar tahun ini menghadirkan lebih dari 200.000 unit hunian terjangkau untuk masyarakat berpenghasilan rendah (MBR) maupun generasi muda.\n\nLangkah ini merupakan perwujudan konkret dalam mendukung pencapaian Program 3 Juta Rumah yang dicanangkan pemerintah pusat.\n\nDalam pameran ini, calon pembeli disuguhkan suku bunga KPR subsidi tetap 5% hingga tenor 20 tahun serta bebas biaya provisi dan administrasi perbankan.`,
      author: 'Siti Rahmawati',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80',
      tags: ['Properti', 'Danantara', 'KPR Subsidised', 'Industri']
    },
    {
      id: 'art-2',
      title: 'Proyek Gasifikasi Batu Bara ke Metanol BBC Beroperasi Penuh 2030',
      category: 'Energi',
      publishedAt: '29 JULI 2026, 20.52',
      views: 1890,
      snippet: 'PT Bumi Alam Chemical (BBC) menyatakan proyek gasifikasi batu bara menjadi metanol ditargetkan beroperasi penuh pada 2030.',
      content: `PT Bumi Alam Chemical (BBC) mengonfirmasi bahwa progres pengerjaan fasilitas Dimethyl Ether (DME) dan gasifikasi batu bara menjadi metanol di Kalimantan Timur telah mencapai tahap konstruksi teknis utama.\n\nFasilitas hilirisasi ini ditargetkan beroperasi penuh pada kuartal kedua 2030 dengan kapasitas produksi mencapai 1,8 juta ton metanol per tahun.\n\nInisiatif ini diproyeksikan mampu mengurangi impor LPG dan bahan baku kimia nasional secara bermakna sekaligus mengoptimalkan cadangan batu bara kalor sedang.`,
      author: 'Budi Santoso',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
      tags: ['Hilirisasi', 'Energi', 'Batu Bara', 'Metanol']
    },
    {
      id: 'art-3',
      title: 'GOTO Pangkas Target EBITDA Gojek Jadi Rp 1,5 Triliun Imbas Komisi 5%',
      category: 'Bursa',
      publishedAt: '29 JULI 2026, 20.38',
      views: 3100,
      snippet: 'PT GoTo Gojek Tokopedia Tbk memangkas target EBITDA yang disesuaikan pada segmen on-demand services Gojek.',
      content: `PT GoTo Gojek Tokopedia Tbk (GOTO) merevisi pembaharuan panduan kinerja keuangan tahun berjalan untuk unit bisnis on-demand services (Gojek).\n\nPenyesuaian target EBITDA yang disesuaikan menjadi Rp 1,5 triliun dilakukan menyusul pemberlakuan batasan komisi mitra pengemudi maksimal 5% sesuai Perpres terbaru.\n\nManajemen GOTO menegaskan akan tetap mengoptimalkan efisiensi operasional dan penguatan lini layanan keuangan GoPay guna menjaga kurva pertumbuhan profitabilitas jangka panjang.`,
      author: 'Ahmad Nurfajri',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=300&q=80',
      isPopular: true,
      tags: ['GOTO', 'Gojek', 'Saham', 'Bursa', 'EBITDA']
    },
    {
      id: 'art-4',
      title: 'Viral Sinyal Turun ke 2G, Pakar Sebut Link Phishing Tetap Jadi Ancaman Utama',
      category: 'Teknologi',
      publishedAt: '29 JULI 2026, 20.34',
      views: 1650,
      snippet: 'Pakar keamanan siber menilai narasi yang terlalu menitikberatkan perubahan sinyal justru berpotensi menimbulkan pemahaman keliru.',
      content: `Belakangan ini marak perbincangan di media sosial mengenai fenomena indikator sinyal ponsel yang tiba-tiba berpindah ke jaringan 2G saat menerima pesan misterius.\n\nPakar Keamanan Siber dari Communication & Information System Security Research Center (CISSReC) mengimbau masyarakat untuk tidak panik namun tetap waspada.\n\n"Ancaman utama pengurasan rekening pengguna sebenarnya terletak pada tautan APK palsu atau website phishing yang dikirim lewat rekayasa sosial (social engineering), bukan sekadar penurunan pita frekuensi sinyal," paparnya.`,
      author: 'Dewi Lestari',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=300&q=80',
      tags: ['CyberSecurity', 'Phishing', 'Teknologi', 'Siber']
    },
    {
      id: 'art-5',
      title: 'Daftar Saham Pembagi Dividen Jumbo ADRO, ANTM dan BBCA, Intip Rekomendasi Analis',
      category: 'Finansial',
      publishedAt: '29 JULI 2026, 19.30',
      views: 4500,
      snippet: 'Sejumlah emiten papan atas menjadwalkan pembagian dividen interim dengan yield menarik di kuartal ketiga.',
      content: `Pasar modal Indonesia disambut sentimen positif dari pengumuman dividen interim emiten bluechip.\n\nPT Adaro Energy Indonesia Tbk (ADRO), PT Aneka Tambang Tbk (ANTM), dan PT Bank Central Asia Tbk (BBCA) siap membagikan sebagian keuntungan bersih tahun buku 2026 kepada para pemegang saham.\n\nAnalis sekuritas merekomendasikan strategi akumulasi beli secara bertahap menjelang kumulatif date (cum date) untuk mengamankan imbal hasil dividen yang diproyeksikan melebihi tingkat inflasi tahunan.`,
      author: 'Analis Finansial',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=300&q=80',
      isPopular: true,
      tags: ['Saham', 'Dividen', 'BBCA', 'ADRO', 'ANTM']
    },
    {
      id: 'art-6',
      title: 'Sembcorp Utilities Beri Sinyal Akuisisi 20% Saham Entitas Prajogo (TPIA)',
      category: 'Finansial',
      publishedAt: '29 JULI 2026, 19.15',
      views: 3820,
      snippet: 'Raksasa energi asal Singapura menyatakan ketertarikan memperluas portofolio energi terbarukan di Indonesia.',
      content: `Raksasa solusi energi terintegrasi Singapura, Sembcorp Utilities, membuka peluang investasi strategis di entitas petrochemical milik taipan Prajogo Pangestu, PT Chandra Asri Pacific Tbk (TPIA).\n\nLangkah akuisisi minoritas sebesar 20% ini bertujuan mempercepat transformasi penyediaan daya bersih dan fasilitas daur ulang polimer ramah lingkungan di Asia Tenggara.`,
      author: 'Tim Keuangan',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
      isPopular: true,
      tags: ['TPIA', 'Sembcorp', 'Finansial', 'Akuisisi']
    },
    {
      id: 'art-7',
      title: 'Pasar Tunggu Konsistensi Profitabilitas GOTO usai Perpres 9%, Akankah Cuan Lagi?',
      category: 'Bursa',
      publishedAt: '29 JULI 2026, 18.10',
      views: 3410,
      snippet: 'Perubahan regulasi tarif batas atas dan bawah menimbulkan spekulasi pergerakan arus kas emiten teknologi.',
      content: `Pelaku pasar modal menyoroti dampak penerapan Peraturan Presiden Nomor 9 Tahun 2026 terhadap struktur pendapatan sektor transportasi online.\n\nPara analis berpendapat bahwa efisiensi saluran promosi dan peningkatan margin pada segmen finansial akan menjadi kunci kestabilan bottom line GOTO di sisa kuartal tahun ini.`,
      author: 'Analis Pasar',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80',
      isPopular: true,
      tags: ['GOTO', 'Profitabilitas', 'Bursa']
    },
    {
      id: 'art-8',
      title: 'Geliat Saham Grup Harita NCKL Usai Masuk Indeks LQ45 dan IDX80, Cek Prospeknya',
      category: 'Bursa',
      publishedAt: '29 JULI 2026, 17.40',
      views: 2950,
      snippet: 'Inklusi saham NCKL ke indeks utama memicu akumulasi pembelian oleh investor institusional domestik maupun asing.',
      content: `Kinerja perdagangan saham PT Trimegah Bangun Persada Tbk (NCKL) mencatatkan lonjakan volume setelah rebalancing kuartalan Bursa Efek Indonesia menempatkannya dalam jajaran konstituen LQ45.\n\nAnalis memandang positif pengoperasian smelter HPAL tahap II yang diperkirakan mendongkrak margin laba bersih pemrosesan nikel kadar rendah.`,
      author: 'Rian Hidayat',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80',
      isPopular: true,
      tags: ['NCKL', 'LQ45', 'Harita', 'Bursa']
    },
    {
      id: 'art-9',
      title: 'Beda Nasib 4 Investor Milik Singapura, Malaysia, RI Kala Rugi Investasi Startup',
      category: 'Finansial',
      publishedAt: '29 JULI 2026, 16.20',
      views: 2780,
      snippet: 'Perbandingan strategi evaluasi aset dan manajemen risiko dari sovereign wealth fund regional menghadapi siklus tech winter.',
      content: `Dinamika portofolio modal ventura di kawasan Asia Tenggara mengalami penyesuaian nilai wajar (write-down) seiring moderasi valuasi perusahaan rintisan.\n\nLaporan riset terbaru membandingkan pendekatan pemulihan investasi antara Temasek, Khazanah Nasional, dan konsorsium BUMN Indonesia dalam mendiversifikasi instrumen berisiko tinggi.`,
      author: 'Maya Indah',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80',
      isPopular: true,
      tags: ['Finansial', 'Startup', 'Ventura', 'Investasi']
    }
  ],
  infographics: [
    {
      id: 'info-1',
      title: 'Analisis Tren Pasar Saham Sektor Teknologi 2026',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
      createdAt: '2026-07-29'
    },
    {
      id: 'info-2',
      title: 'Pertumbuhan Ekonomi Digital Indonesia',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
      createdAt: '2026-07-29'
    },
    {
      id: 'info-3',
      title: 'Proyeksi Investasi Hijau & Energi Terbarukan',
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80',
      createdAt: '2026-07-29'
    },
    {
      id: 'info-4',
      title: 'Peta Konektivitas Danantara Housing Expo',
      imageUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=400&q=80',
      createdAt: '2026-07-29'
    }
  ],
  databoks: [
    {
      id: 'data-1',
      title: 'Gempa Bumi Berkekuatan M 5.1 Guncang Filipina',
      category: 'Bencana',
      description: 'Pusat gempa berada di kedalaman 10 km wilayah pesisir timur.'
    },
    {
      id: 'data-2',
      title: 'Prakiraan Cuaca Piala Hari Ini: Hujan Ringan',
      category: 'Cuaca',
      description: 'BMKG memprakirakan intensitas hujan sedang melanda wilayah DKI Jakarta dan sekitarnya.'
    },
    {
      id: 'data-3',
      title: 'Gempa Terkini: Magnitudo 5.0 Terjadi di Filipina',
      category: 'Bencana',
      description: 'Aktivitas lempeng tektonik memicu guncangan susulan.'
    },
    {
      id: 'data-4',
      title: 'Gempa Bumi Berkekuatan M 5.0 Guncang Filipina',
      category: 'Bencana',
      description: 'Badan meteorologi setempat memverifikasi tidak ada potensi tsunami.'
    }
  ],
  videos: [
    {
      id: 'vid-1',
      title: 'Saat Pendidikan Menjadi Bekal Ketahanan Iklim',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    }
  ],
  events: [
    {
      id: 'evt-1',
      title: 'Danantara Housing Expo 2026',
      date: '27 - 30 Agustus 2026',
      location: 'ICE BSD City, Tangerang',
      description: 'Pameran 200.000 hunian ramah lingkungan dan program KPR 3 Juta Rumah.'
    },
    {
      id: 'evt-2',
      title: 'Indonesia International Auto Show (GIIAS 2026)',
      date: '10 - 20 Agustus 2026',
      location: 'ICE BSD City',
      description: 'Ajang bergengsi peluncuran mobil dan teknologi otomotif terkini.'
    }
  ]
};
