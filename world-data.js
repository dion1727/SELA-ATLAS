const REGIONS = [
  {key:'asia',name:'Asia',cover:'kyoto'}, {key:'eropa',name:'Eropa',cover:'dolomiti'},
  {key:'afrika',name:'Afrika',cover:'marrakesh'}, {key:'amerika-utara',name:'Amerika Utara',cover:'nyc'},
  {key:'amerika-selatan',name:'Amerika Selatan',cover:'rio'}, {key:'oseania',name:'Oseania',cover:'queenstown'}
];
const ORIGINAL_REGIONS = {"positano": "Eropa", "fuji": "Asia", "dolomiti": "Eropa", "paris": "Eropa", "jawa": "Asia", "manila": "Asia", "bali": "Asia", "lisboa": "Eropa", "venezia": "Eropa", "kyoto": "Asia"};
for(const place of DESTINATIONS)place.region=ORIGINAL_REGIONS[place.id];
const WORLD_PLACES = [
  {
    "id": "nyc",
    "name": "New York",
    "country": "Amerika Serikat",
    "area": "Manhattan dan Brooklyn",
    "code": "USA",
    "category": "Kota",
    "color": "#555e75",
    "pos": "50% 55%",
    "alt": "Menara batu Brooklyn Bridge di depan gedung-gedung New York, dilihat dari seberang East River",
    "intro": "Kabel Brooklyn Bridge membentang di atas East River. Dari tengah jembatan, Manhattan terlihat seperti deretan maket. Begitu turun ke jalan, jendela toko dan pintu masuk kereta bawah tanah kembali memenuhi pandangan.",
    "moments": [
      "Seberangi East River lewat Brooklyn Bridge",
      "Susuri bekas jalur kereta di High Line",
      "Temukan Belvedere Castle di Central Park"
    ],
    "days": [
      [
        "Pagi menyeberangi East River",
        "Mulai di Brooklyn Bridge Park untuk memandang jembatan dari bawah. Lanjutkan lewat jalur pejalan kaki di atas Brooklyn Bridge menuju Manhattan, lalu rehat di City Hall Park."
      ],
      [
        "Taman di atas rel",
        "Susuri High Line di sisi barat Manhattan. Dari sela tanaman, perhatikan bekas rel dan pemandangan jalan di bawah. Turun di Chelsea untuk makan siang."
      ],
      [
        "Dari pepohonan ke Midtown",
        "Temukan Belvedere Castle di Central Park. Setelah makan siang, lanjutkan ke Grand Central Terminal dan cari gambar rasi bintang di langit-langit aula utamanya."
      ]
    ],
    "region": "Amerika Utara",
    "coords": [
      40.7061,
      -73.9969
    ],
    "credit": {
      "name": "Peter Beke",
      "url": "https://unsplash.com/photos/e1uXetzjgZI",
      "license": "Unsplash License"
    },
    "guide": {
      "name": "NYC Tourism + Conventions",
      "url": "https://business.nyctourism.com/press-media/press-releases/nyc-company-invites-visitors-to-see-manhattan-like-a-new-yorker"
    }
  },
  {
    "id": "mexico",
    "name": "Kota Meksiko",
    "country": "Meksiko",
    "area": "Centro Histórico dan Xochimilco",
    "code": "MEX",
    "category": "Kota",
    "color": "#9e6053",
    "pos": "50% 55%",
    "alt": "Lengkung berukir dan pilar putih pada fasad Palacio de Bellas Artes di Kota Meksiko",
    "intro": "Di sekitar Zócalo, bangunan kolonial berdiri bersebelahan dengan sisa Tenochtitlan. Sisihkan satu hari untuk menuju selatan kota. Di Xochimilco, jalan air membelah petak-petak kebun.",
    "moments": [
      "Lihat jejak Tenochtitlan di Templo Mayor",
      "Amati relief Palacio de Bellas Artes",
      "Susuri kanal Xochimilco dengan trajinera"
    ],
    "days": [
      [
        "Di sekeliling Zócalo",
        "Mulailah di alun-alun Zócalo. Lihat fasad katedral, lalu mampir ke kawasan Templo Mayor untuk mengenali sisa pusat upacara kota Mexica."
      ],
      [
        "Detail di sepanjang Alameda",
        "Lihat pahatan di atas pintu Palacio de Bellas Artes. Setelah itu, berjalanlah ke taman Alameda Central yang bersebelahan untuk duduk di bawah pepohonan."
      ],
      [
        "Sehari di kanal selatan",
        "Pergi ke dermaga Xochimilco dan sepakati rute trajinera dengan pengemudi. Minta ia menunjukkan bagian kanal yang mengitari chinampa, petak pertanian di tengah perairan."
      ]
    ],
    "region": "Amerika Utara",
    "coords": [
      19.4326,
      -99.1332
    ],
    "credit": {
      "name": "David Villasana",
      "url": "https://unsplash.com/photos/ny8NHXepNV8",
      "license": "Unsplash License"
    },
    "guide": {
      "name": "UNESCO · Centro Histórico dan Xochimilco",
      "url": "https://whc.unesco.org/en/list/412/"
    }
  },
  {
    "id": "rio",
    "name": "Rio de Janeiro",
    "country": "Brasil",
    "area": "Teluk Guanabara dan Copacabana",
    "code": "BRA",
    "category": "Pesisir",
    "color": "#46786e",
    "pos": "52% 58%",
    "alt": "Puncak batu Pão de Açúcar, kabel kereta gantung, dan perairan Teluk Guanabara di Rio",
    "intro": "Dari tepi Teluk Guanabara, Pão de Açúcar menjulang hampir tegak dari air. Di sisi kota yang menghadap Atlantik, trotoar berpola ombak mengikuti lengkung Pantai Copacabana.",
    "moments": [
      "Lihat teluk dari Pão de Açúcar",
      "Susuri tepi pantai Copacabana",
      "Cari pemandangan kota dari Corcovado"
    ],
    "days": [
      [
        "Menghadap Teluk Guanabara",
        "Mulai di Praia Vermelha di kawasan Urca. Dari sini, naiklah kereta gantung menuju Pão de Açúcar. Cari teluk dan jalur pantai yang baru saja kamu lewati dari atas."
      ],
      [
        "Sore di Copacabana",
        "Mulai dari ujung pantai di Leme. Ikuti trotoar tepi laut ke arah Copacabana dan berhenti di salah satu kios untuk menyaksikan orang bermain bola di pasir."
      ],
      [
        "Dari hutan ke kebun raya",
        "Luangkan pagi untuk Corcovado dan pemandangan dari sekitar patung Cristo Redentor. Lanjutkan ke Jardim Botânico untuk berjalan santai di bawah deretan palem."
      ]
    ],
    "region": "Amerika Selatan",
    "coords": [
      -22.9492,
      -43.1545
    ],
    "credit": {
      "name": "Gustavo Sánchez",
      "url": "https://unsplash.com/photos/7UrkmddRrAU",
      "license": "Unsplash License"
    },
    "guide": {
      "name": "UNESCO · Lanskap Carioca",
      "url": "https://whc.unesco.org/en/list/1100/"
    }
  },
  {
    "id": "cusco",
    "name": "Cusco",
    "country": "Peru",
    "area": "Andes, pusat bersejarah Cusco",
    "code": "PER",
    "category": "Kota",
    "color": "#9b693e",
    "pos": "51% 56%",
    "alt": "Plaza de Armas di Cusco dikelilingi gereja, deretan balkon, dan atap genting terakota",
    "intro": "Dari bukit, genting terakota Cusco mengelilingi petak hijau Plaza de Armas. Turun ke gang di sekitar alun-alun untuk melihat sambungan batu Inka dan menengok bengkel para perajin di San Blas.",
    "moments": [
      "Duduk di bawah arkade Plaza de Armas",
      "Cari batu bersudut dua belas menuju San Blas",
      "Amati susunan batu di Saqsaywaman"
    ],
    "days": [
      [
        "Satu putaran di Plaza de Armas",
        "Mulailah pelan-pelan di alun-alun. Lihat menara katedral dan gereja Compañía de Jesús dari taman tengah, lalu pilih bangku untuk mengamati kehidupan plaza."
      ],
      [
        "Melihat pahatan dan sambungan batu",
        "Dari pusat kota, cari Piedra de los Doce Ángulos, batu bersudut dua belas. Lanjutkan lewat gang menanjak ke San Blas dan kunjungi bengkel perajin yang terbuka."
      ],
      [
        "Saqsaywaman dan Qorikancha",
        "Kunjungi kompleks Saqsaywaman untuk mengamati sambungan balok batunya. Kembali ke pusat kota dan lihat bagaimana dinding Qorikancha bertemu bangunan Santo Domingo."
      ]
    ],
    "region": "Amerika Selatan",
    "coords": [
      -13.5167,
      -71.9781
    ],
    "credit": {
      "name": "Azzedine Rouichi",
      "url": "https://unsplash.com/photos/g9U5KGu_m3Q",
      "license": "Unsplash License"
    },
    "guide": {
      "name": "Peru Travel · Pusat bersejarah Cusco",
      "url": "https://www.peru.travel/experiences/city-tour-in-cusco-s-historic-center"
    }
  },
  {
    "id": "capetown",
    "name": "Cape Town",
    "country": "Afrika Selatan",
    "area": "Western Cape",
    "code": "ZAF",
    "category": "Pesisir",
    "region": "Afrika",
    "coords": [
      -33.9249,
      18.4241
    ],
    "color": "#306964",
    "pos": "50% 48%",
    "alt": "Puncak Lion’s Head, permukiman Cape Town, dan Samudra Atlantik dilihat dari Table Mountain",
    "intro": "Dari Table Mountain, Lion’s Head tampak seperti ujung sirip di atas Cape Town. Turun ke kota untuk menyusuri jalan Bo-Kaap, mengunjungi kebun botani, dan melihat kapal di dermaga.",
    "moments": [
      "Dengarkan cerita warga Bo-Kaap dalam tur jalan kaki",
      "Lihat kebun Kirstenbosch dari jalur tajuk Boomslang",
      "Mampir ke Zeitz MOCAA di V&A Waterfront"
    ],
    "days": [
      [
        "Jalan kaki di Bo-Kaap",
        "Ikuti tur lingkungan bersama pemandu setempat. Di antara rumah-rumah berwarna, dengarkan kisah masyarakat Cape Muslim dan beri ruang bagi warga yang beraktivitas."
      ],
      [
        "Kebun di kaki Table Mountain",
        "Habiskan pagi di Kirstenbosch National Botanical Garden. Dari jalur pepohonan Boomslang, lihat bagaimana kebun beralih menjadi lereng gunung."
      ],
      [
        "Pelabuhan dan seni Afrika",
        "Susuri V&A Waterfront sambil melihat kegiatan dermaga. Sisihkan waktu untuk koleksi seni Afrika kontemporer di Zeitz MOCAA."
      ]
    ],
    "credit": {
      "name": "Jo Round",
      "url": "https://unsplash.com/photos/uTQoSHg_nmc",
      "license": "Unsplash License"
    },
    "guide": {
      "name": "Cape Town Tourism",
      "url": "https://www.capetown.travel/the-travellers-guide-to-bo-kaap/"
    }
  },
  {
    "id": "marrakesh",
    "name": "Marrakesh",
    "country": "Maroko",
    "area": "Medina Marrakesh",
    "code": "MAR",
    "category": "Kota",
    "region": "Afrika",
    "coords": [
      31.6258,
      -7.9892
    ],
    "color": "#a35939",
    "pos": "50% 65%",
    "alt": "Menara Koutoubia di atas kios-kios Jemaa el-Fna yang menyala menjelang malam",
    "intro": "Menjelang malam, asap dapur dan lampu kios memenuhi Jemaa el-Fna. Menara Koutoubia di kejauhan bisa jadi patokan saat kamu kembali dari gang-gang pasar.",
    "moments": [
      "Keliling Jemaa el-Fna ketika kios makan mulai buka",
      "Perhatikan pola ubin dan plafon Istana Bahia",
      "Cari warna biru Majorelle di antara tanaman Jardin Majorelle"
    ],
    "days": [
      [
        "Dari pasar ke lapangan",
        "Susuri gang pertokoan medina pada siang hari. Menjelang petang, kembali ke Jemaa el-Fna untuk makan dan mendengarkan musik dari sekitar lapangan."
      ],
      [
        "Pola-pola Istana Bahia",
        "Luangkan pagi untuk halaman dan ruang hias Istana Bahia. Pilih satu detail, seperti potongan ubin atau plafon kayu, lalu bandingkan polanya dari ruang ke ruang."
      ],
      [
        "Pagi di Jardin Majorelle",
        "Jelajahi jalur taman di antara bambu dan kaktus. Cari sudut tempat dinding biru Majorelle terlihat di balik dedaunan."
      ]
    ],
    "credit": {
      "name": "Val Vesa",
      "url": "https://unsplash.com/photos/eEHJ1ZSAZTg",
      "license": "Unsplash License"
    },
    "guide": {
      "name": "Kantor Pariwisata Nasional Maroko",
      "url": "https://www.visitmorocco.com/en/travel/marrakesh"
    }
  },
  {
    "id": "sydney",
    "name": "Sydney",
    "country": "Australia",
    "area": "Sydney Harbour",
    "code": "AUS",
    "category": "Pesisir",
    "region": "Oseania",
    "coords": [
      -33.8568,
      151.2153
    ],
    "color": "#297385",
    "pos": "45% 50%",
    "alt": "Feri melintasi Sydney Harbour dengan atap putih Opera House di tepi air",
    "intro": "Dari Circular Quay, feri membelah air tepat di depan atap Sydney Opera House. Di seberang teluk, jalan pejalan kaki di Manly berujung di pantai yang menghadap Pasifik.",
    "moments": [
      "Lihat Sydney Opera House dari tepi Circular Quay",
      "Menyeberang ke Manly dengan feri",
      "Susuri tebing pantai antara Bondi dan Bronte"
    ],
    "days": [
      [
        "Satu pagi di Circular Quay",
        "Berangkat dari dermaga Circular Quay dan berjalan di tepi air ke pelataran Sydney Opera House. Berhenti untuk melihat feri berbelok di bawah Harbour Bridge."
      ],
      [
        "Dari feri ke Pasifik",
        "Naik feri dari Circular Quay ke Manly Wharf. Susuri jalur pejalan kaki The Corso sampai ke Manly Beach, lalu pilih tempat makan siang di tepi pantai."
      ],
      [
        "Jalur tebing dari Bondi",
        "Mulai di Bondi Beach, ikuti jalur pesisir melalui Tamarama, lalu beristirahat di Bronte. Jika masih ingin berjalan, lanjutkan menyusuri rute menuju Coogee."
      ]
    ],
    "credit": {
      "name": "Klaus Germann",
      "url": "https://unsplash.com/photos/CxYsGoM-XSo",
      "license": "Unsplash License"
    },
    "guide": {
      "name": "Destination NSW",
      "url": "https://www.sydney.com/destinations/sydney/sydney-city/city-centre/transport/circular-quay-manly-ferry"
    }
  },
  {
    "id": "queenstown",
    "name": "Queenstown",
    "country": "Selandia Baru",
    "area": "Otago, Pulau Selatan",
    "code": "NZL",
    "category": "Alam",
    "region": "Oseania",
    "coords": [
      -45.0312,
      168.6626
    ],
    "color": "#496e72",
    "pos": "50% 52%",
    "alt": "Kota Queenstown dan semenanjung hijau menjorok ke Danau Whakatipu di antara pegunungan",
    "intro": "Dari atas kota, Danau Whakatipu terlihat membelok di sela pegunungan. Susuri tepinya dari Marine Parade, lalu lihat kembali semenanjung yang sama dari Bob’s Peak.",
    "moments": [
      "Kelilingi semenanjung Queenstown Gardens",
      "Lihat bentang danau dari Bob’s Peak",
      "Telusuri tepi Sungai Arrow di Arrowtown"
    ],
    "days": [
      [
        "Keliling semenanjung",
        "Mulai di Marine Parade dan ikuti Queenstown Gardens Trail. Jalur melingkar melewati kebun mawar, pepohonan tua, dan bangku-bangku yang menghadap danau."
      ],
      [
        "Bentang danau dari atas",
        "Naik gondola menuju Bob’s Peak. Dari titik pandang, cari kembali Queenstown Gardens dan amati pegunungan di seberang danau."
      ],
      [
        "Singgah di Arrowtown",
        "Sisihkan hari untuk Arrowtown. Jelajahi bangunan lama di Buckingham Street, lalu ikuti sebagian jalur tepi Sungai Arrow sebelum kembali ke Queenstown."
      ]
    ],
    "credit": {
      "name": "Sung Jin Cho",
      "url": "https://unsplash.com/photos/K3uTZdnaagM",
      "license": "Unsplash License"
    },
    "guide": {
      "name": "Destination Queenstown",
      "url": "https://www.queenstownnz.co.nz/listing/queenstown-gardens-trail/9100/"
    }
  }
];
for(const place of WORLD_PLACES){
  LOCATIONS[place.id]=place.coords;
  PHOTO_CREDITS[place.id]=place.credit;
  DESTINATIONS.push(place);
}
