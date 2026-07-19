// Real archive data for "Filologiya va Pedagogika".
// Current issue: 2026-yil 13 (32)-son — e-ISSN 3060-4885.

import issuePdfAsset from "@/assets/issue-13-32-2026.pdf.asset.json";
import issue1231PdfAsset from "@/assets/issue-12-31-2026.pdf.asset.json";
import issue1231CoverAsset from "@/assets/issue-12-31-cover.jpg.asset.json";
import issue1332CoverAsset from "@/assets/issue-13-32-cover.jpg.asset.json";

export type ArchivePaper = {
  manuscriptId: string;
  field: string;
  title: string;
  authors: string;
  affiliation?: string;
  pages: string;
  excerpt?: string;
  keywords?: string[];
};

export type ArchiveIssue = {
  volume: number; // jild
  number: number; // son
  year: number;
  month: string; // Uzbek month
  publishedAt?: string;
  pdfUrl?: string;
  coverUrl?: string;
  papers: ArchivePaper[];
};

export type ArchiveVolume = {
  volume: number;
  year: number;
  issues: ArchiveIssue[];
};

// Current issue lives at the top; used by /joriy-son as well.
export const CURRENT_ISSUE: ArchiveIssue = {
  volume: 13,
  number: 32,
  year: 2026,
  month: "Iyul",
  publishedAt: "2026-07-15",
  pdfUrl: issuePdfAsset.url,
  coverUrl: issue1332CoverAsset.url,
  papers: [
    // 10.00.00 – FILOLOGIYA
    {
      manuscriptId: "FVP-2026-032-001",
      field: "Filologiya",
      title:
        "Fransuz tilidan o‘zbek tiliga ifodaviy vositalar va barqaror birikmalar tarjimasida semantik va pragmatik transformatsiyalar",
      authors: "Sarvinoz Azamjonova",
      pages: "4",
      excerpt:
        "Fransuz tilidan o‘zbek tiliga barqaror birikmalar va madaniy-spesifik leksikani tarjima qilish jarayonida yuzaga keladigan semantik va pragmatik transformatsiyalar qiyosiy-tahliliy jihatdan tadqiq etilgan.",
      keywords: ["tarjima", "semantik transformatsiya", "pragmatik transformatsiya"],
    },
    {
      manuscriptId: "FVP-2026-032-002",
      field: "Filologiya",
      title: "Jahon adabiyoti asarlarida muallim obrazi tavsifi",
      authors: "Dilnura Egamberdiyeva",
      pages: "7",
    },
    {
      manuscriptId: "FVP-2026-032-003",
      field: "Filologiya",
      title:
        "Koreys va o‘zbek tillaridagi asosiy kiberxavfsizlik terminlarining qiyosiy tahlili",
      authors: "Abdullo Ahmadov · Azamat Akbarov",
      pages: "9",
    },
    {
      manuscriptId: "FVP-2026-032-004",
      field: "Filologiya",
      title: "Lingvopoetika sohasining o‘zbek tilshunosligadagi nazariy asoslari",
      authors: "Dovranjon Xaydarov",
      pages: "12",
    },
    {
      manuscriptId: "FVP-2026-032-005",
      field: "Filologiya",
      title:
        "XVIII – XIX asr ingliz jamiyatida ayol maqomi va ijtimoiy qarashlar",
      authors: "Sharifjon Ne’matjonov",
      pages: "15",
    },
    {
      manuscriptId: "FVP-2026-032-006",
      field: "Filologiya",
      title: "Tilshunoslikda kognitivlik va tilga kognitiv yondashuv",
      authors: "Nilufar Turdiyeva",
      pages: "17",
    },
    {
      manuscriptId: "FVP-2026-032-007",
      field: "Filologiya",
      title:
        "Ingliz va o‘zbek media sarlavhalarida pragmatik ta’sir vositalari",
      authors: "Dilnoza Istamova · Sabrina Zoirova",
      pages: "19",
    },
    {
      manuscriptId: "FVP-2026-032-008",
      field: "Filologiya",
      title: "Monologik nutq va tushkunlik xronotopi uyg‘unligi",
      authors: "To‘lqin Pardayev",
      pages: "21",
    },
    {
      manuscriptId: "FVP-2026-032-009",
      field: "Filologiya",
      title:
        "Psixolingvistik tadqiqotlarda inson omili, vaziyat omili va eksperiment omilining lingvistik talqini",
      authors: "Nasiba Raxmonova",
      pages: "24",
    },
    {
      manuscriptId: "FVP-2026-032-010",
      field: "Filologiya",
      title:
        "Lotin Amerikasi va o‘zbek hikoyalarida badiiy psixologizm: qiyos, tahlil va talqin",
      authors: "Nafisa Obidova",
      pages: "26",
    },
    {
      manuscriptId: "FVP-2026-032-011",
      field: "Filologiya",
      title: "Communicative and Pragmatic Features of Diplomatic Discourse",
      authors: "Ziyoda Mirzamatova",
      pages: "28",
    },
    {
      manuscriptId: "FVP-2026-032-012",
      field: "Filologiya",
      title: "Abduqayum Yo‘ldoshev idiostilini shakllantiruvchi lingvopoetik birliklar",
      authors: "Maftuna Nodirova",
      pages: "30",
    },
    {
      manuscriptId: "FVP-2026-032-013",
      field: "Filologiya",
      title:
        "“Mazharul ajoyib” qo‘lyozmalarining paleografik xususiyatlari va kitobat an’anasi",
      authors: "Umedjon Majidov",
      pages: "33",
    },
    {
      manuscriptId: "FVP-2026-032-014",
      field: "Filologiya",
      title:
        "Hikoyada o‘lim motivining badiiy in’ikosi hamda adabiy ta’sir masalasi",
      authors: "Elyorjon Imomov",
      pages: "35",
    },
    {
      manuscriptId: "FVP-2026-032-015",
      field: "Filologiya",
      title:
        "Ekologik madaniyatni rivojlantirishda raqamli platformalar va interaktiv kontentlarning ijtimoiy-samarali mexanizmlari",
      authors: "Dilnoza Djurayeva",
      pages: "37",
    },
    {
      manuscriptId: "FVP-2026-032-016",
      field: "Filologiya",
      title:
        "Kitob mutolaasi jarayonida uchraydigan psixologik muammolar va ularni bartaraf etish yo‘llari",
      authors: "Afruza Rajabova · Hilola Umarova",
      pages: "40",
    },
    {
      manuscriptId: "FVP-2026-032-017",
      field: "Filologiya",
      title:
        "Shavkat Rahmon she’riyatida metafora va ramzlarning falsafiy talqini",
      authors: "Malika Elmurodova",
      pages: "42",
    },
    {
      manuscriptId: "FVP-2026-032-018",
      field: "Filologiya",
      title:
        "Fuqarolar urushining millat obrazidagi roli: “Janub renessansi” davri yozuvchilari ijodida tarixiy travma",
      authors: "Islomjon Umrzaqov",
      pages: "44",
    },
    {
      manuscriptId: "FVP-2026-032-019",
      field: "Filologiya",
      title:
        "Pragmatik adabiyotshunoslik va pragmalingvistikaning umumiy hamda xususiyliklari tadqiqi",
      authors: "Usmonjon Rahimov",
      pages: "47",
    },
    {
      manuscriptId: "FVP-2026-032-020",
      field: "Filologiya",
      title:
        "Stefen Kingning “IT” (U) romanida ijtimoiy befarqlik va bolalar zaifligi muammosi",
      authors: "Ulugbek Ochilov",
      pages: "49",
    },
    {
      manuscriptId: "FVP-2026-032-021",
      field: "Filologiya",
      title:
        "O‘zbekistonda qo‘shiqchilik madaniyati: tarixiy meros va zamonaviy rivojlanish",
      authors: "Muzaffar Sayfullayev",
      pages: "52",
    },
    {
      manuscriptId: "FVP-2026-032-022",
      field: "Filologiya",
      title:
        "“Turkiy guliston yoxud axloq” asarida forsiy izofalar va ularning o‘ziga xos xususiyatlari",
      authors: "Alisher Goziyev",
      pages: "55",
    },
    {
      manuscriptId: "FVP-2026-032-023",
      field: "Filologiya",
      title:
        "Aruz vaznining XX asr ikkinchi yarmida yaratilgan g‘azallardagi o‘rni",
      authors: "Mahliyo Jo‘rayeva",
      pages: "57",
    },
    {
      manuscriptId: "FVP-2026-032-024",
      field: "Filologiya",
      title:
        "Lingvistikada ma’noni tahlil qilishning zamonaviy yondashuvlari: qiyosiy va nazariy tahlil",
      authors: "Madina Mirjalilova",
      pages: "60",
    },
    {
      manuscriptId: "FVP-2026-032-025",
      field: "Filologiya",
      title:
        "Dialektal nutqda evfemizm va disfemizmning pragmatik xususiyatlari",
      authors: "Sherzod Normo‘minov",
      pages: "62",
    },
    {
      manuscriptId: "FVP-2026-032-026",
      field: "Filologiya",
      title:
        "Normurod Norqobilov hikoyalarida bola obrazining qiyosiy talqini",
      authors: "Shahnoza Mavlyanova",
      pages: "65",
    },
    {
      manuscriptId: "FVP-2026-032-027",
      field: "Filologiya",
      title:
        "Badiiy asarni tahlil qilishda onomastik birliklarning o‘rni (“Otamdan qolgan dalalar” romani misolida)",
      authors: "Shuhrat Tuxtayev",
      pages: "68",
    },
    {
      manuscriptId: "FVP-2026-032-028",
      field: "Filologiya",
      title: "Masdar (harakat nomi) yasalishining grammatik xususiyatlari",
      authors: "Soliha Orifxonova · Masrur Raximjanov",
      pages: "71",
    },
    {
      manuscriptId: "FVP-2026-032-029",
      field: "Filologiya",
      title: "Nodira she’riyatida badiiy san’atlarning qo‘llanishi",
      authors: "Go‘zal Nurqobulova",
      pages: "73",
    },
    {
      manuscriptId: "FVP-2026-032-030",
      field: "Filologiya",
      title:
        "Anbar Otin she’riyatida ma’rifatparvarlik va pedagogik qarashlarning badiiy talqini",
      authors: "Habiba Ne’matova",
      pages: "75",
    },
    {
      manuscriptId: "FVP-2026-032-031",
      field: "Filologiya",
      title: "Suyish funksional-semantik maydonining troplar vositasida ifodalanishi",
      authors: "Durdonaxon Mirzazoda",
      pages: "77",
    },
    {
      manuscriptId: "FVP-2026-032-032",
      field: "Filologiya",
      title:
        "Chingiz Aytmatov va Muxtor Shoxonovning “Cho‘qqida qolgan ovchining ohi-zori” asarida ayollar obrazi",
      authors: "Dilrux Faxriyeva",
      pages: "79",
    },
    {
      manuscriptId: "FVP-2026-032-033",
      field: "Filologiya",
      title:
        "O‘zbek tilida derivatsion antonimiyaning kognitiv-semantik tabiati",
      authors: "Dildora Abdullayeva",
      pages: "81",
    },
    {
      manuscriptId: "FVP-2026-032-034",
      field: "Filologiya",
      title:
        "Sovremennye metody analiza khudozhestvennogo teksta: traditsii literaturovedeniya i vozmozhnosti iskusstvennogo intellekta",
      authors: "Kamila Shaydullina",
      pages: "84",
    },
    {
      manuscriptId: "FVP-2026-032-035",
      field: "Filologiya",
      title:
        "Lingvokognitivnye osobennosti osvoeniya angloyazychnoy IT-terminologii v raznosistemnykh yazykakh",
      authors: "Dilnozakhon Amonova",
      pages: "87",
    },
    {
      manuscriptId: "FVP-2026-032-036",
      field: "Filologiya",
      title:
        "Tipologiya vostochnykh zaimstvovaniy v sovremennom russkom yazyke",
      authors: "Dilafruz Kamalova",
      pages: "90",
    },
    {
      manuscriptId: "FVP-2026-032-037",
      field: "Filologiya",
      title:
        "Cherty gorodskogo fentezi v romane A. B. Sal’nikova «Okkul’t treger»",
      authors: "Margarita Shin",
      pages: "92",
    },
    {
      manuscriptId: "FVP-2026-032-038",
      field: "Filologiya",
      title:
        "Funktsii vnesyuzhetnykh elementov v romane M. Kucherskoy «Tyotya Motya»",
      authors: "Firuza Irkabayeva",
      pages: "95",
    },
    {
      manuscriptId: "FVP-2026-032-039",
      field: "Filologiya",
      title:
        "Sopostavitel’nyy analiz lingvisticheskikh lakun v fitonimicheskoy sisteme uzbekskogo, turetskogo i russkogo yazykov",
      authors: "Shahnoza Sattorova",
      pages: "97",
    },
    {
      manuscriptId: "FVP-2026-032-040",
      field: "Filologiya",
      title: "Podkhody k issledovaniyu poeticheskogo prostranstva",
      authors: "Diana Sharapova",
      pages: "99",
    },
    {
      manuscriptId: "FVP-2026-032-041",
      field: "Filologiya",
      title:
        "Assotsiativ maydonlarda gender tafovutlarni lingvostatistik baholash",
      authors: "Botir Tajiboyev",
      pages: "100",
    },
    {
      manuscriptId: "FVP-2026-032-042",
      field: "Filologiya",
      title:
        "O‘zbek va qozoq tillarida affikslarning gender-semantik xususiyatlari",
      authors: "Nursulton Shayxislamov",
      pages: "103",
    },
    {
      manuscriptId: "FVP-2026-032-043",
      field: "Filologiya",
      title:
        "Tekst kak vselennaya: vnutrenniy mir khudozhestvennogo proizvedeniya",
      authors: "Denis El’kin",
      pages: "105",
    },

    // 13.00.00 – PEDAGOGIKA
    {
      manuscriptId: "FVP-2026-032-044",
      field: "Pedagogika",
      title:
        "Xalq og‘zaki ijodi janrlarining tasnifi va ta’limda yosh xususiyatlariga ko‘ra differensial yondashuv metodikasi",
      authors: "Azizbek Turdiyev",
      pages: "107",
    },
    {
      manuscriptId: "FVP-2026-032-045",
      field: "Pedagogika",
      title:
        "Didactic Potential of the HKT–AI Operational Feedback Module in Developing Cadets’ Communicative Competence",
      authors: "Zulfiya Pulatova",
      pages: "110",
    },
    {
      manuscriptId: "FVP-2026-032-046",
      field: "Pedagogika",
      title:
        "Rolli o‘yinlarda yapon tilida gapirish ko‘nikmalarini baholash metodlari va mezonlari",
      authors: "Aziza Musayeva",
      pages: "114",
    },
    {
      manuscriptId: "FVP-2026-032-047",
      field: "Pedagogika",
      title:
        "Ingliz tilida o‘qish kompetensiyasini rivojlantirishda zamonaviy ta’lim texnologiyalarining lingvodidaktik imkoniyatlari",
      authors: "Umidjon Soliyev",
      pages: "117",
    },
    {
      manuscriptId: "FVP-2026-032-048",
      field: "Pedagogika",
      title:
        "Universitetning yuqori kurs talabalariga koreys tilidagi lug‘at va frazeologik birliklarni o‘rgatishda “Wayground” onlayn platformasining o‘rni",
      authors: "Rasul Sherov",
      pages: "123",
    },
    {
      manuscriptId: "FVP-2026-032-049",
      field: "Pedagogika",
      title:
        "Ona tili darslarida imlo lug‘atidan foydalanish orqali o‘quvchilarning yozma savodxonligini oshirish",
      authors: "Rashida Insopova",
      pages: "126",
    },
    {
      manuscriptId: "FVP-2026-032-050",
      field: "Pedagogika",
      title:
        "Chet tilida yozuv kompetensiyasining lingvodidaktik xususiyatlari",
      authors: "Solijon Azizov",
      pages: "129",
    },
    {
      manuscriptId: "FVP-2026-032-051",
      field: "Pedagogika",
      title:
        "O‘quvchilarda raqamli madaniyat va axborot xavfsizligiga doir tarbiyaviy kompetensiyalarni rivojlantirishning amaliy-metodik tizimi",
      authors: "Go‘zal Boltayeva",
      pages: "135",
    },
    {
      manuscriptId: "FVP-2026-032-052",
      field: "Pedagogika",
      title: "Media Texts As a Source of Pragmalinguistic Input",
      authors: "Marg‘uba Ilhomova",
      pages: "139",
    },
    {
      manuscriptId: "FVP-2026-032-053",
      field: "Pedagogika",
      title: "Grafik organayzerlar va ularning turlari",
      authors: "Gulnoza Shahriyorova",
      pages: "141",
    },
    {
      manuscriptId: "FVP-2026-032-054",
      field: "Pedagogika",
      title:
        "Kasbiy ta’lim muassasalarida strategik boshqaruvni joriy etish mexanizmlarini xorijiy tajribalar asosida takomillashtirish",
      authors: "Voxidjon Qobilov",
      pages: "144",
    },
    {
      manuscriptId: "FVP-2026-032-055",
      field: "Pedagogika",
      title:
        "A Methodology for Developing Creative Competence Among Students of Specialized Schools in English Language Teaching",
      authors: "Muzifa Madaminova",
      pages: "147",
    },
    {
      manuscriptId: "FVP-2026-032-056",
      field: "Pedagogika",
      title:
        "Bo‘lajak ingliz tili o‘qituvchisining kasbiy-metodik tayyorgarligini xalqarolashtirishning samaradorligi",
      authors: "Doston Turdaliyev",
      pages: "151",
    },
    {
      manuscriptId: "FVP-2026-032-057",
      field: "Pedagogika",
      title:
        "Neyropedagogik texnologiyalar asosida bo‘lajak tarbiyachilarning kreativlik qobiliyatlarini rivojlantirish metodikasi",
      authors: "Nigora Saidova",
      pages: "153",
    },
    {
      manuscriptId: "FVP-2026-032-058",
      field: "Pedagogika",
      title:
        "Raqamli ta’lim muhitida bo‘lajak boshlang‘ich sinf o‘qituvchilarining kommunikativ kompetensiyalarini rivojlantirish metodikasini takomillashtirish",
      authors: "Qunduz Gulmanova",
      pages: "157",
    },
    {
      manuscriptId: "FVP-2026-032-059",
      field: "Pedagogika",
      title:
        "Rezul’taty eksperimental’nogo issledovaniya formirovaniya emotsional’no-kommunikativnoy kompetentnosti budushchikh vrachey",
      authors: "Shahlo Jamaldinova",
      pages: "161",
    },
    {
      manuscriptId: "FVP-2026-032-060",
      field: "Pedagogika",
      title: "Language Attitudes Toward English In Higher Education",
      authors: "Gulsanam Suyarova · Gulsevar Usmonova",
      pages: "166",
    },
    {
      manuscriptId: "FVP-2026-032-061",
      field: "Pedagogika",
      title:
        "Improving the System for Assessing Cadets’ Communicative Competence in Higher Military Education Based on the MCR – Index Approach",
      authors: "Zulfiya Pulatova",
      pages: "166",
    },
    {
      manuscriptId: "FVP-2026-032-062",
      field: "Pedagogika",
      title:
        "Ta’lim sifatini monitoring qilishda xalqaro tajribalar va milliy amaliyot integratsiyasi",
      authors: "Mahliyo Xolmurodova",
      pages: "170",
    },
    {
      manuscriptId: "FVP-2026-032-063",
      field: "Pedagogika",
      title:
        "Kichik yoshdagi bolalarda talaffuz ko‘nikmalarini shakllantirish muammolari",
      authors: "Malohat Almardanova",
      pages: "174",
    },
  ],
};

const ISSUE_12_31: ArchiveIssue = {
  volume: 12,
  number: 31,
  year: 2026,
  month: "Iyun",
  publishedAt: "2026-06-30",
  pdfUrl: issue1231PdfAsset.url,
  coverUrl: issue1231CoverAsset.url,
  papers: [
    // 10.00.00 – FILOLOGIYA
    { manuscriptId: "FVP-2026-031-001", field: "Filologiya", title: "“Usuli jadida” maktablari jadid adabiyotining o‘ziga xos bosqichi sifatida", authors: "Rahmatulla Barakayev", pages: "4" },
    { manuscriptId: "FVP-2026-031-002", field: "Filologiya", title: "Ingliz va o‘zbek rivoyatlarida konseptlararo munosabatlarning lingvokognitiv mexanizmlari", authors: "Muhammadjon Solijonov", pages: "8" },
    { manuscriptId: "FVP-2026-031-003", field: "Filologiya", title: "O‘zbek va ingliz tillarida ma’dan komponentli frazeologizmlarning semantik tabiati", authors: "Ra’no Madraximova", pages: "10" },
    { manuscriptId: "FVP-2026-031-004", field: "Filologiya", title: "Ingliz va qoraqalpoq topishmoqlarida ikkilamchi nominatsiya va antropomorf metaforaning lingvokognitiv talqini", authors: "Zarima Sagatova", pages: "12" },
    { manuscriptId: "FVP-2026-031-005", field: "Filologiya", title: "Isajon Sultonning “Bilga xoqon” romanida xarakter va milliy ruhiyat", authors: "Dilafruz Mahkamova", pages: "14" },
    { manuscriptId: "FVP-2026-031-006", field: "Filologiya", title: "O‘zbek tilida vizual kognitiv fe’llarning semantik va funksional xususiyatlari", authors: "Shahloxon Karimjonova", pages: "16" },
    { manuscriptId: "FVP-2026-031-007", field: "Filologiya", title: "Badiiy matnda milliy tafakkur va madaniy identifikatsiyaning verbal ifodasi", authors: "Muhammadjon Solijonov", pages: "18" },
    { manuscriptId: "FVP-2026-031-008", field: "Filologiya", title: "Aksiologicheskaya dominanta «Sem’ya i rodstvennye otnosheniya» v russkikh paremiyakh", authors: "Faxriddin Yulbarsov", pages: "20" },
    { manuscriptId: "FVP-2026-031-009", field: "Filologiya", title: "Vzaimosvyaz’ leksicheskoy semantiki i derivatsionnykh protsessov v slovoobrazovatel’nom gnezde", authors: "Farrux Safarov", pages: "22" },
    { manuscriptId: "FVP-2026-031-010", field: "Filologiya", title: "Interpretatsiya «Kul’turnogo koda» v trilogii V. P. Aksyonova «Moskovskaya saga»", authors: "Anna Kurchastova", pages: "24" },
    { manuscriptId: "FVP-2026-031-011", field: "Filologiya", title: "Parizhskaya nota v kontekste literaturnogo protsessa russkogo zarubezh’ya: genezis, estetika i kriticheskoe osmyslenie", authors: "Irina Doronina · Nozima Isroilova", pages: "26" },
    { manuscriptId: "FVP-2026-031-012", field: "Filologiya", title: "Divergentsiya i konvergentsiya smyslov v protsessakh gnezdovogo slovoobrazovaniya", authors: "Anna Sheremet’yeva", pages: "28" },
    { manuscriptId: "FVP-2026-031-013", field: "Filologiya", title: "Poslovitsy i pogovorki kak otrazhenie natsional’nogo kolorita uzbekskoy literatury", authors: "Nargizaxon Ziyobiddinova · Jamila Buranova", pages: "30" },
    { manuscriptId: "FVP-2026-031-014", field: "Filologiya", title: "Osobennosti syuzhetnoy organizatsii romana M. Kucherskoy «Tyotya Motya»", authors: "Firuza Irkabaeva", pages: "32" },
    { manuscriptId: "FVP-2026-031-015", field: "Filologiya", title: "Simvolika tsveta v sovremennoy proze", authors: "Kahhorjon Yulchiev · Shoira Xashimova", pages: "34" },
    { manuscriptId: "FVP-2026-031-016", field: "Filologiya", title: "Yazykovye osobennosti dialoga v povesti M. Bulgakova «Sobach’ye serdtse»", authors: "Aziza Usanova · Dilfuza Pardaeva", pages: "36" },
    { manuscriptId: "FVP-2026-031-017", field: "Filologiya", title: "Neologizatsiya russkogo yazyka v tsifrovuyu epokhu", authors: "Ra’no Namazova", pages: "38" },
    { manuscriptId: "FVP-2026-031-018", field: "Filologiya", title: "Lingvokul’turologicheskiy aspekt khudozhestvennogo teksta v sisteme mezhkul’turnoy kommunikatsii", authors: "Denis El’kin", pages: "39" },
    { manuscriptId: "FVP-2026-031-019", field: "Filologiya", title: "Evfemizmy: sistemnye svyazi, funktsii i sposoby obrazovaniya", authors: "Shohistaxon Nuralieva", pages: "41" },
    { manuscriptId: "FVP-2026-031-020", field: "Filologiya", title: "Fenomen «Platonovskogo yazyka»: deavtomatizatsiya rechi kak khudozhestvennyy priyom", authors: "Zuxriddin Nuridinov", pages: "43" },
    { manuscriptId: "FVP-2026-031-021", field: "Filologiya", title: "Osobennosti organizatsii khudozhestvennogo prostranstva sbornika Mariny Tsvetaevoy «Vecherniy al’bom»", authors: "Diana Sharapova", pages: "45" },
    { manuscriptId: "FVP-2026-031-022", field: "Filologiya", title: "Spetsifika i struktura semanticheskogo prostranstva slovoobrazovatel’nogo gnezda", authors: "Anna Sheremet’yeva", pages: "46" },
    { manuscriptId: "FVP-2026-031-023", field: "Filologiya", title: "Transformatsiya satiricheskikh modusov khudozhestvennosti v russkoy literature epokhi modernizma", authors: "Dilbar Ischanova", pages: "48" },
    { manuscriptId: "FVP-2026-031-024", field: "Filologiya", title: "Davlat boshqaruvi terminlaridagi leksik paradigmalar: giper-giponimiya va sinonimiya hodisasi", authors: "Lobar G‘aniyeva", pages: "50" },
    { manuscriptId: "FVP-2026-031-025", field: "Filologiya", title: "Diskursda kommunikativ strategiya va taktikalarning lingvopragmatik xususiyatlari", authors: "Mahliyo Jalishova", pages: "52" },
    { manuscriptId: "FVP-2026-031-026", field: "Filologiya", title: "Abdulla Oripovning “Haj daftari” turkumida diniy-axloqiy qadriyatlarning Navoiy uslubidagi talqini", authors: "Maftuna Qodirova", pages: "54" },
    { manuscriptId: "FVP-2026-031-027", field: "Filologiya", title: "Mahmudxo‘ja Behbudiyning ma’rifiy qarashlari va milliy uyg‘onish g‘oyalari", authors: "Nilufar Mirsaidova", pages: "56" },
    { manuscriptId: "FVP-2026-031-028", field: "Filologiya", title: "“Kuch” konsepti strukturasidagi paremiologik zona tahlili", authors: "Sohiba Babanazarova", pages: "58" },
    { manuscriptId: "FVP-2026-031-029", field: "Filologiya", title: "O‘zbek tilida lug‘aviy ma’noning shakllanishi va taraqqiyot bosqichlari", authors: "Sharipboy Bobojanov · Shohsanam Bobojonova", pages: "61" },
    { manuscriptId: "FVP-2026-031-030", field: "Filologiya", title: "Strategies for Translating Expressions of Respect from English into Uzbek", authors: "Elbek Turayev", pages: "63" },
    { manuscriptId: "FVP-2026-031-031", field: "Filologiya", title: "Nemis va o‘zbek tillaridagi frazeologik birliklarning qiyosiy tahlili", authors: "Asadbek Ergashev", pages: "65" },
    { manuscriptId: "FVP-2026-031-032", field: "Filologiya", title: "O‘zbek tilida so‘roq birliklarning semantik tasnifi va qo‘llanishi", authors: "Firuza Isroilova", pages: "67" },
    { manuscriptId: "FVP-2026-031-033", field: "Filologiya", title: "Preserving Psychological Realism in Translation (The Case of Literary Texts)", authors: "Dilnoza Jamoliddinova", pages: "69" },
    { manuscriptId: "FVP-2026-031-034", field: "Filologiya", title: "Postmodernistskaya dekonstruktsiya pushkinskogo teksta kak ironicheskiy element russkoy fantasticheskoy prozy", authors: "Andrey Kuchinskiy", pages: "71" },
    { manuscriptId: "FVP-2026-031-035", field: "Filologiya", title: "Transformatsiya obraza Lzhedmitriya I v russkoy dramaturgii epokhi realizma: sravnitel’nyy analiz proizvedeniy A. S. Pushkina i A. N. Ostrovskogo", authors: "Georgiy Zhakupov", pages: "73" },
    { manuscriptId: "FVP-2026-031-036", field: "Filologiya", title: "Bolalar adabiyotida tabiat tasviri: kichik yoshdagi kitobxonlar dunyoqarashi va ekologik tafakkurini shakllantirish omillari", authors: "Sevinchxon Mardonova", pages: "75" },
    { manuscriptId: "FVP-2026-031-037", field: "Filologiya", title: "Kognitivnye mekhanizmy reprezentatsii znaniya v paremiologicheskikh edinitsakh: opyt sopostavitel’nogo opisaniya", authors: "Nigora Irgasheva", pages: "78" },
    { manuscriptId: "FVP-2026-031-038", field: "Filologiya", title: "Erkaklar va ayollar nutqida his-hayajonni ifodalovchi leksik vositalarning qiyosiy tahlili", authors: "Gulmira Turdiyeva", pages: "80" },
    { manuscriptId: "FVP-2026-031-039", field: "Filologiya", title: "Hikoyada komik obraz tipologiyasi (Ne’mat Aminov va Aziz Nesin ijodi misolida)", authors: "Dilrabo Haydarova", pages: "82" },
    { manuscriptId: "FVP-2026-031-040", field: "Filologiya", title: "Nikneymy v sisteme sovremennoy internet-kommunikatsii: semanticheskiy aspekt", authors: "Timur Uzbekov", pages: "84" },
    { manuscriptId: "FVP-2026-031-041", field: "Filologiya", title: "Hid bilish sezgisi lisoniy tadqiqining ilmiy-nazariy asoslari va tamoyillari", authors: "Akmaljon Qurbonov", pages: "86" },
    { manuscriptId: "FVP-2026-031-042", field: "Filologiya", title: "Akusher-ginekologiya terminotizimining o‘rganilishiga doir ilmiy yondashuvlar", authors: "Nilufar Rasulova", pages: "89" },
    { manuscriptId: "FVP-2026-031-043", field: "Filologiya", title: "Gogolevskie personazhi i obraz N. V. Gogolya v sovremennoy fantasticheskoy proze", authors: "Andrey Kuchinskiy", pages: "91" },
    { manuscriptId: "FVP-2026-031-044", field: "Filologiya", title: "Literaturnyy analiz geroev proizvedeniya «Gore ot uma» Griboedova: analiz analogov i otslezhivanie problem sovremennogo obshchestva", authors: "Mashxura Yuldasheva · Mohinur Muzaffarova", pages: "93" },

    // 13.00.00 – PEDAGOGIKA
    { manuscriptId: "FVP-2026-031-045", field: "Pedagogika", title: "Texnologiya fani o‘qituvchilarining antikvar buyumlar tayyorlashga oid kompetentligini rivojlantirish metodikasi", authors: "Abdumalik Sharipov · To‘maris Allayarova", pages: "95" },
    { manuscriptId: "FVP-2026-031-046", field: "Pedagogika", title: "Nofilologik ta’lim yo‘nalishi talabalarida kasbiy kommunikativ kompetentlikni shakllantirish: pedagogik talqin va tarkibiy-funksional model", authors: "Ozoda Nazirova", pages: "97" },
    { manuscriptId: "FVP-2026-031-047", field: "Pedagogika", title: "Adabiyotshunoslikda sotsiologik metod masalasi", authors: "Ibodatxon Rustamova", pages: "100" },
    { manuscriptId: "FVP-2026-031-048", field: "Pedagogika", title: "Issledovanie putey povysheniya razgovornykh navykov u izuchayushchikh kitayskiy yazyk v Uzbekistane", authors: "Tyu Thi Kim Zung", pages: "102" },
    { manuscriptId: "FVP-2026-031-049", field: "Pedagogika", title: "Sotsial’naya kompetentnost’ vospitatelya kak uslovie effektivnoy professional’noy deyatel’nosti", authors: "Lizahan Ibragimova", pages: "104" },
    { manuscriptId: "FVP-2026-031-050", field: "Pedagogika", title: "Ispol’zovanie tekhnologiy iskusstvennogo intellekta dlya formirovaniya kriticheskogo myshleniya obuchayushchikhsya v obrazovatel’nom protsesse", authors: "Dilfuza Mirzaeva", pages: "106" },
    { manuscriptId: "FVP-2026-031-051", field: "Pedagogika", title: "Znachenie organizatsii prazdnichnykh meropriyatiy v doshkol’nykh obrazovatel’nykh organizatsiyakh", authors: "Zuhra Naimova", pages: "108" },
    { manuscriptId: "FVP-2026-031-052", field: "Pedagogika", title: "Patrioticheskoe vospitanie molodyozhi v usloviyakh globalizatsii i tsifrovoy kul’tury", authors: "Shahida Oteniyazova · Palzada Oteniyazova", pages: "110" },
    { manuscriptId: "FVP-2026-031-053", field: "Pedagogika", title: "Risunok – poetapnyy portret", authors: "Dastan Abdreymov", pages: "112" },
    { manuscriptId: "FVP-2026-031-054", field: "Pedagogika", title: "An’anaviy xonandalikda ovoz yurgizish va ovoz sozlash mashqlarining metodik asoslari", authors: "Qobil Ayubov", pages: "114" },
    { manuscriptId: "FVP-2026-031-055", field: "Pedagogika", title: "Axborot texnologiyalarini kasbiy faoliyatda qo‘llash fanini o‘qitishni takomillashtirish metodikasi", authors: "Shuhratjon Madraximov · Mahfuza Madraximova", pages: "116" },
    { manuscriptId: "FVP-2026-031-056", field: "Pedagogika", title: "Talabalarning ijodiy faoliyatini rivojlantirishda podkast texnologiyalaridan foydalanish", authors: "Abdurauf Yuldashev", pages: "118" },
    { manuscriptId: "FVP-2026-031-057", field: "Pedagogika", title: "Ijtimoiy-madaniy bilimlarni xorijiy tilni o‘qitish jarayoniga integratsiyalash: zamonaviy pedagogik yondashuvlar va madaniyatlararo kompetensiyani rivojlantirish", authors: "Gulnoz Yormatova", pages: "120" },
    { manuscriptId: "FVP-2026-031-058", field: "Pedagogika", title: "Bo‘lajak biologlarning ingliz tili darslarida kasbiy-diskursiv kompetensiyalarini rivojlantirish", authors: "Rano Odilova", pages: "122" },
    { manuscriptId: "FVP-2026-031-059", field: "Pedagogika", title: "Davlat-xususiy sheriklik asosidagi maktabgacha ta’lim tashkilotlarini rivojlantirishning pedagogik shart-sharoitlari", authors: "Abdug‘ulom Xakimov", pages: "124" },
    { manuscriptId: "FVP-2026-031-060", field: "Pedagogika", title: "Pedagogicheskaya kompetentnost’ i lingvistika: integrirovannyy podkhod", authors: "Shohista Zoitova", pages: "126" },
    { manuscriptId: "FVP-2026-031-061", field: "Pedagogika", title: "Metakognitiv strategiyalarning ingliz tilida yozish ko‘nikmasini o‘qitish jarayonidagi imkoniyatlari", authors: "Shoira Xonboboyeva", pages: "128" },
    { manuscriptId: "FVP-2026-031-062", field: "Pedagogika", title: "Teoreticheskie podkhody k izucheniyu agressivnogo povedeniya v sovremennoy nauke", authors: "Svetlana Im", pages: "130" },
    { manuscriptId: "FVP-2026-031-063", field: "Pedagogika", title: "Epik asarlarda keys yadrosini aniqlash mezonlari va ularning metodik ahamiyati", authors: "Munisa Qosimova", pages: "132" },
    { manuscriptId: "FVP-2026-031-064", field: "Pedagogika", title: "Nofilologik ta’lim yo‘nalishi talabalarida kasbiy kommunikativ kompetentlikni baholash mezonlari, ko‘rsatkichlari va darajalari", authors: "Ozoda Nazirova", pages: "135" },
    { manuscriptId: "FVP-2026-031-065", field: "Pedagogika", title: "Ingliz tilini o‘qitishda intensiv metodlarni qo‘llash tizimini takomillashtirish", authors: "Zebo Salimova", pages: "139" },
  ],
};

export const ARCHIVE_VOLUMES: ArchiveVolume[] = [
  {
    volume: 13,
    year: 2026,
    issues: [CURRENT_ISSUE],
  },
  {
    volume: 12,
    year: 2026,
    issues: [ISSUE_12_31],
  },
];

export function findIssue(volume: number, number: number): ArchiveIssue | null {
  for (const v of ARCHIVE_VOLUMES) {
    if (v.volume !== volume) continue;
    return v.issues.find((i) => i.number === number) ?? null;
  }
  return null;
}

export function findPaper(
  manuscriptId: string,
): { paper: ArchivePaper; issue: ArchiveIssue } | null {
  for (const v of ARCHIVE_VOLUMES) {
    for (const issue of v.issues) {
      const paper = issue.papers.find((p) => p.manuscriptId === manuscriptId);
      if (paper) return { paper, issue };
    }
  }
  return null;
}

