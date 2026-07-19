// Real archive data for "Filologiya va Pedagogika".
// Current issue: 2026-yil 13 (32)-son — e-ISSN 3060-4885.

import issuePdfAsset from "@/assets/issue-13-32-2026.pdf.asset.json";
import issue1231PdfAsset from "@/assets/issue-12-31-2026.pdf.asset.json";
import issue1231CoverAsset from "@/assets/issue-12-31-cover.jpg.asset.json";
import issue1332CoverAsset from "@/assets/issue-13-32-cover.jpg.asset.json";
import issue1130PdfAsset from "@/assets/issue-11-30-2026.pdf.asset.json";
import issue1130CoverAsset from "@/assets/issue-11-30-cover.jpg.asset.json";
import issue1029PdfAsset from "@/assets/issue-10-29-2026.pdf.asset.json";
import issue1029CoverAsset from "@/assets/issue-10-29-cover.jpg.asset.json";

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

const ISSUE_11_30: ArchiveIssue = {
  volume: 11,
  number: 30,
  year: 2026,
  month: "Iyun",
  publishedAt: "2026-06-15",
  pdfUrl: issue1130PdfAsset.url,
  coverUrl: issue1130CoverAsset.url,
  papers: [
    // 10.00.00 – FILOLOGIYA
    { manuscriptId: "FVP-2026-030-001", field: "Filologiya", title: "Turkiston adabiyoti: tarixiy ildizlardan zamonaviy bosqichgacha", authors: "Sevinch Ravshanova", pages: "5" },
    { manuscriptId: "FVP-2026-030-002", field: "Filologiya", title: "Omon Matjon ijodida nasrdagi nazmlar", authors: "Kiyishjon Ollamova", pages: "7" },
    { manuscriptId: "FVP-2026-030-003", field: "Filologiya", title: "Badiiy matnda konnotativ ma’nolarning psixolingvistik talqini", authors: "Muxabbat Kurbanova · Nilufar Toshpo‘latova", pages: "9" },
    { manuscriptId: "FVP-2026-030-004", field: "Filologiya", title: "Eski va yangi ma’lumotni ajratish tamoyilining badiiy diskursda voqelanishi", authors: "Maftuna Askarova", pages: "11" },
    { manuscriptId: "FVP-2026-030-005", field: "Filologiya", title: "“Alpomish” dostonining Fozil Yo‘ldosh o‘g‘li variantidagi qofiya tizimi", authors: "Elbek Jumanov", pages: "14" },
    { manuscriptId: "FVP-2026-030-006", field: "Filologiya", title: "Structural and Semantic Features of Syntactic-Stylistic Figures in the English Language", authors: "Zarifjon Qo‘ldashev", pages: "16" },
    { manuscriptId: "FVP-2026-030-007", field: "Filologiya", title: "Badiiy matnning sotsiopragmatik xususiyatlari (“Lolazor” romani misolida)", authors: "Surayyo Ziyotova · Shahlo Boboqulova", pages: "18" },
    { manuscriptId: "FVP-2026-030-008", field: "Filologiya", title: "O‘zbek tiliga munosabat va milliy o‘zlik masalasi", authors: "Xusanboy Tojimatov", pages: "20" },
    { manuscriptId: "FVP-2026-030-009", field: "Filologiya", title: "Siyosiy matnlarning lingvokulturologik xususiyatlari va ularning zamonaviy tilshunoslikdagi talqini", authors: "Umida Yokubbayeva", pages: "22" },
    { manuscriptId: "FVP-2026-030-010", field: "Filologiya", title: "Argumentativ tuzilmalar va sintaktik modellar: aktiv/passiv konstruksiyalar va nominalizatsiya hodisasi", authors: "Oysapar Utapova", pages: "24" },
    { manuscriptId: "FVP-2026-030-011", field: "Filologiya", title: "O‘zbek xalq maqollarining semantik-strukturaviy va lingvokulturologik xususiyatlari", authors: "Nargiza Rajabova · Shohsanam Bobojonova", pages: "26" },
    { manuscriptId: "FVP-2026-030-012", field: "Filologiya", title: "Madaniyatlararo va shaxslararo muloqotning kommunikativ modellari", authors: "Rafiqjon Zaripov", pages: "28" },
    { manuscriptId: "FVP-2026-030-013", field: "Filologiya", title: "Zamonaviy ingliz tilida taxalluslarning funksional xususiyatlari", authors: "Dildora Ganiyeva · Aziza Obidova", pages: "31" },
    { manuscriptId: "FVP-2026-030-014", field: "Filologiya", title: "Lingvokul’turnaya spetsifika simvoliki belogo tsveta vo frantsuzskom i russkom yazykakh", authors: "Gulfiya Rakhimova", pages: "33" },
    { manuscriptId: "FVP-2026-030-015", field: "Filologiya", title: "Interpretatsiya khudozhestvennykh proizvedeniy raznymi vidami iskusstva (razrabotka seminarskogo zanyatiya po russkoy literature)", authors: "Nafosat Khalimova", pages: "35" },
    { manuscriptId: "FVP-2026-030-016", field: "Filologiya", title: "Formirovanie nekotorykh astronomicheskikh terminov v russkoy i uzbekskoy leksikografii", authors: "Farkhad Khalilov", pages: "38" },
    { manuscriptId: "FVP-2026-030-017", field: "Filologiya", title: "Ironiya i sarkazm v internet-kommunikatsii", authors: "Makhbuba Khamidova · Nilufar Usmonova", pages: "40" },
    { manuscriptId: "FVP-2026-030-018", field: "Filologiya", title: "Perifraza v aspekte lingvisticheskikh issledovaniy", authors: "Gulsara Kurbanova", pages: "42" },
    { manuscriptId: "FVP-2026-030-019", field: "Filologiya", title: "Motiv razrushennoy lyubvi v sovremennoy literature", authors: "Shoira Khashimova", pages: "44" },
    { manuscriptId: "FVP-2026-030-020", field: "Filologiya", title: "Khudozhestvennaya real’nost’ Il’dara Abuzyarova: mezhdu refleksiey i mifom (na materiale rasskaza «Vmesto videniya»)", authors: "Nilufarkhon Yuldasheva", pages: "46" },
    { manuscriptId: "FVP-2026-030-021", field: "Filologiya", title: "Strukturno-semanticheskiy analiz slova «predlozhenie» v russkom i uzbekskom diskursakh", authors: "Yorkinoy Khamraeva · Lobar Shakhrieva", pages: "49" },
    { manuscriptId: "FVP-2026-030-022", field: "Filologiya", title: "Ekfrasis v romane M. Yu. Lermontova «Knyaginya Ligovskaya»", authors: "Aziza Gafurova", pages: "50" },
    { manuscriptId: "FVP-2026-030-023", field: "Filologiya", title: "Osobennosti leksikograficheskikh istochnikov uzbekskogo yazyka", authors: "Yorkinoy Khamraeva · Nilufar Kurbonova", pages: "52" },
    { manuscriptId: "FVP-2026-030-024", field: "Filologiya", title: "Natsional’no-kul’turnaya spetsifika funktsionirovaniya antroponimov v khudozhestvennom tekste", authors: "Gullola Nishonova", pages: "53" },
    { manuscriptId: "FVP-2026-030-025", field: "Filologiya", title: "Stilisticheski differentsirovannye i nedifferentsirovannye fonovarianty angliyskikh sushchestvitel’nykh", authors: "Arzayym Ibragimova", pages: "56" },
    { manuscriptId: "FVP-2026-030-026", field: "Filologiya", title: "O‘zbek tilidagi oq va qora ranglar bilan bog‘liq iboralarning lingvokognitiv xususiyatlari", authors: "Sevinch Azamatova", pages: "58" },
    { manuscriptId: "FVP-2026-030-027", field: "Filologiya", title: "Folklorda ayol obrazining badiiy ifodasi", authors: "Mirzabek Xolyorov · Kamola Davlatova", pages: "60" },
    { manuscriptId: "FVP-2026-030-028", field: "Filologiya", title: "Olamning lisoniy manzarasi ilmiy tushuncha sifatida", authors: "Nasibaxon Jo‘rayeva", pages: "62" },
    { manuscriptId: "FVP-2026-030-029", field: "Filologiya", title: "The Problem of Gender-Neutral Words in the Uzbek Language and the Necessity of their Formation", authors: "Jasurbek Malikov", pages: "65" },
    { manuscriptId: "FVP-2026-030-030", field: "Filologiya", title: "O‘zbek va ingliz tillarida qorishiq metaforaning muvafaqqiyatsizlik omillari", authors: "Latofat Murodjonova", pages: "67" },
    { manuscriptId: "FVP-2026-030-031", field: "Filologiya", title: "Sa’diyning “Mufarrihu-l-qulub” asari haqida", authors: "Dilnavoz Sattorova", pages: "69" },
    { manuscriptId: "FVP-2026-030-032", field: "Filologiya", title: "Dialektal frazemalarning lingvistik tahlili", authors: "Zarifa Norqobilova", pages: "72" },
    { manuscriptId: "FVP-2026-030-033", field: "Filologiya", title: "O‘zbek va qozoq “Go‘ro‘g‘li” turkumi dostonlarining o‘rganilishi", authors: "Dildora Husanova", pages: "74" },
    { manuscriptId: "FVP-2026-030-034", field: "Filologiya", title: "Qozoq tilshunosligida etnonimlarni o‘rganish masalalari", authors: "Charos Kamolova", pages: "76" },
    { manuscriptId: "FVP-2026-030-035", field: "Filologiya", title: "O‘zbek tilida sun’iy intellekt va axborot texnologiyalari sohasiga oid yangi kasb-hunar nomlarining shakllanishi va leksikografik tavsifi", authors: "Madina Muhammadaliyeva", pages: "78" },
    { manuscriptId: "FVP-2026-030-036", field: "Filologiya", title: "Shaxslararo muloqotning kommunikativ-pragmatik xususiyatlari va samarali kommunikatsiya strategiyalari", authors: "Rafiqjon Zaripov", pages: "80" },
    { manuscriptId: "FVP-2026-030-037", field: "Filologiya", title: "Javlon Jovliyev asarlaridagi buyruq va so‘roq qurilmalar lingvopoetikasi", authors: "Gulruh Bahodirova · Nozima Soxibova", pages: "81" },
    { manuscriptId: "FVP-2026-030-038", field: "Filologiya", title: "Erkin A’zamning “Stupka” hikoyasida gender qarashlar va ijtimoiy munosabatlar talqini", authors: "Diyora Shamshiyeva", pages: "85" },
    { manuscriptId: "FVP-2026-030-039", field: "Filologiya", title: "Detektiv janrdagi hikoyalar tarixi", authors: "Yunus Babaqulov", pages: "87" },
    { manuscriptId: "FVP-2026-030-040", field: "Filologiya", title: "Romantizmdan modernizmga qadar", authors: "Mohinur Fayzullaeva", pages: "89" },
    { manuscriptId: "FVP-2026-030-041", field: "Filologiya", title: "Future Directions in the Adaptation and Standardization of English Railway Terminology in the Uzbek Language", authors: "Sevara Bekmurodova", pages: "91" },
    { manuscriptId: "FVP-2026-030-042", field: "Filologiya", title: "Osobennosti funktsionirovaniya metafory v protsesse sozdaniya smysla v angliyskikh literaturnykh proizvedeniyakh", authors: "Arukhan Omirbaeva", pages: "94" },
    { manuscriptId: "FVP-2026-030-043", field: "Filologiya", title: "Sravnitel’no-tipologicheskiy aspekt semanticheskogo printsipa klassifikatsii antroponimov v russkom i uzbekskom yazykakh", authors: "Markhabo Abdusamatova", pages: "96" },
    { manuscriptId: "FVP-2026-030-044", field: "Filologiya", title: "Grafiko-orfograficheskaya adaptatsiya zaimstvovannoy leksiki v russkom i uzbekskom yazykakh", authors: "Vazira Rabbimkulova", pages: "98" },
    { manuscriptId: "FVP-2026-030-045", field: "Filologiya", title: "Transformatsiya kontsepta «chay» v russkoy lingvokul’ture nachala XXI veka", authors: "Latifjon Nosirov", pages: "101" },
    { manuscriptId: "FVP-2026-030-046", field: "Filologiya", title: "Tipologiya zhenskikh obrazov-antagonistov v uzbekskom narodnom epose", authors: "Nigora Abdurashitova", pages: "103" },
    { manuscriptId: "FVP-2026-030-047", field: "Filologiya", title: "Nodira Ofoq she’riyatida mumtoz badiiy san’atlar va yangicha talqinlar", authors: "Mahliyo Kamolova", pages: "105" },
    { manuscriptId: "FVP-2026-030-048", field: "Filologiya", title: "Metafora – tafakkur hodisasi", authors: "Nargiza Jo‘rayeva", pages: "107" },
    { manuscriptId: "FVP-2026-030-049", field: "Filologiya", title: "Alisher Navoiyning “Badoye ul-bidoya” devonidagi g‘azallarda muqayyad qofiyaning qo‘llanishi", authors: "Gulfuza Madirimova", pages: "111" },
    { manuscriptId: "FVP-2026-030-050", field: "Filologiya", title: "Tibbiyotga oid reklamalarda metafora lingvokognitiv vosita sifatida", authors: "Dilnoza Sobirova", pages: "114" },
    { manuscriptId: "FVP-2026-030-051", field: "Filologiya", title: "O‘zbek tilida “mehmondo‘stlik” konseptining lingvomadaniy xususiyatlari va strukturaviy komponentlari", authors: "Maxbuba Axatova · Iroda Usmonova", pages: "116" },
    { manuscriptId: "FVP-2026-030-052", field: "Filologiya", title: "Madaniy konnotatsiyalar va ularning reklama chaqiriqlari tarjimasiga ta’siri", authors: "Boxodir Ilxamov", pages: "118" },
    { manuscriptId: "FVP-2026-030-053", field: "Filologiya", title: "Epik tur janrlarining sinkretik xususiyatlari", authors: "Yodgorjon Zokirjanov", pages: "120" },
    { manuscriptId: "FVP-2026-030-054", field: "Filologiya", title: "Nasrda tasavvuf allomalari obrazini yaratishda muallifning ijodiy konsepsiyasi", authors: "Farangis Abdulloyeva", pages: "122" },
    { manuscriptId: "FVP-2026-030-055", field: "Filologiya", title: "Xalqning ma’naviy va siyosiy ongi shakllanishida Turon teatri faoliyatining roli", authors: "Sevinch Ahatova", pages: "124" },
    { manuscriptId: "FVP-2026-030-056", field: "Filologiya", title: "Rus adabiyotida Sharq konsepti: ma’naviy qadriyatlar va ekzotik go‘zallik uyg‘unligi", authors: "Lola Alibayeva", pages: "126" },
    { manuscriptId: "FVP-2026-030-057", field: "Filologiya", title: "Nekronimlar va yondosh sakral birliklarning integral hamda differensial xususiyatlari", authors: "Xurshida Xushboqova", pages: "128" },
    { manuscriptId: "FVP-2026-030-058", field: "Filologiya", title: "Mustaqillik davrida navoiyshunoslikka munosabat", authors: "Zarina Raxmiddinovna", pages: "131" },
    { manuscriptId: "FVP-2026-030-059", field: "Filologiya", title: "Ingliz va o‘zbek tillaridagi o‘limga oid frazeologik birliklarning struktur-semantik xususiyatlari", authors: "Ozoda Tursunova", pages: "133" },
    { manuscriptId: "FVP-2026-030-060", field: "Filologiya", title: "O‘zbek dialektal lisoniy shaxsining fonetik markerlari", authors: "Sherzod Normo‘minov", pages: "135" },
    { manuscriptId: "FVP-2026-030-061", field: "Filologiya", title: "Maqollarda gastronimlarning lingvokulturologik ahamiyati", authors: "Feruza Raxmatilloyeva", pages: "137" },
    { manuscriptId: "FVP-2026-030-062", field: "Filologiya", title: "“Doxunda” romanida sujet qurilishi va uning badiiy-estetik mohiyati", authors: "Nigora Normuratova", pages: "139" },
    { manuscriptId: "FVP-2026-030-063", field: "Filologiya", title: "Sherbek Bobonorning “Qora suyaklar” kitobida “suyak” metaforasining badiiy-kontseptual tabiati", authors: "Nilufar Narzulloyeva", pages: "141" },
    { manuscriptId: "FVP-2026-030-064", field: "Filologiya", title: "Anagrammalarning adabiy topishmoqlar takomilidagi ahamiyati", authors: "Zebiniso Mulloqulova", pages: "143" },
    { manuscriptId: "FVP-2026-030-065", field: "Filologiya", title: "The Mirror and the Construction of the Self: a Comparative Study of Russian and English Literary Traditions", authors: "Nigina Fazilova", pages: "145" },
    { manuscriptId: "FVP-2026-030-066", field: "Filologiya", title: "Iqbol Mirzo she’riyatida folklorga oid obrazlar tasnifi", authors: "Mohinur Farmonova", pages: "147" },
    { manuscriptId: "FVP-2026-030-067", field: "Filologiya", title: "Tohir Malikning “Alvido… bolalik” qissasining struktur-funksional xususiyatlari", authors: "Yulduz Azimova", pages: "149" },
    { manuscriptId: "FVP-2026-030-068", field: "Filologiya", title: "Tsvetovaya semantika i metafora pamyati v romane D. Rubinoy «Na solnechnoy storone ulitsy»", authors: "Durdona Siddikjonova", pages: "152" },
    { manuscriptId: "FVP-2026-030-069", field: "Filologiya", title: "Dukhovnyy krizis lichnosti v povesti A. S. Pushkina «Pikovaya dama» i romane O. Uayl’da «Portret Doriana Greya»", authors: "Barchinoy Ruzmetova", pages: "154" },
    { manuscriptId: "FVP-2026-030-070", field: "Filologiya", title: "Frazeologik omonimlarning lingvostilistik talqini", authors: "Shirinabonu Nurullayeva", pages: "156" },
    { manuscriptId: "FVP-2026-030-071", field: "Filologiya", title: "Traktor poreyonimlarining onomastik va semantik tasnifi", authors: "Mirzohid Muhammadaliyev", pages: "159" },
    { manuscriptId: "FVP-2026-030-072", field: "Filologiya", title: "Navoiy g‘azallarini sharhlashda badiiy va ilmiy uslubning o‘zaro munosabati", authors: "Maftuna Rahmonova", pages: "162" },
    { manuscriptId: "FVP-2026-030-073", field: "Filologiya", title: "Grammaticheskie osobennosti poeticheskogo stilya Anny Akhmatovoy i problemy ikh peredachi v mezhkul’turnoy kommunikatsii", authors: "Shakhlo Bakhshilloeva", pages: "164" },

    // 13.00.00 – PEDAGOGIKA
    { manuscriptId: "FVP-2026-030-074", field: "Pedagogika", title: "Adabiy asar matnini o‘qitishda tinglab tushunish ko‘nikmasini shakllantiruvchi metodlar", authors: "Mohichehra Mustafoyeva", pages: "166" },
    { manuscriptId: "FVP-2026-030-075", field: "Pedagogika", title: "2-sinf “Matematika” darsligida berilgan topshiriqlar orqali axborot kompetentligini rivojlantirishning metodik asoslari", authors: "Husniya Ergasheva", pages: "172" },
    { manuscriptId: "FVP-2026-030-076", field: "Pedagogika", title: "Integrating AI Technologies Into Teaching Speaking and Writing Through the Flipped Classroom Approach", authors: "Bobur Suyunov · Umida Tagayeva · Doston Pirnazarov · Visola Xudoyorova · Laylo Mardonova", pages: "174" },
    { manuscriptId: "FVP-2026-030-077", field: "Pedagogika", title: "Xorijliklarga o‘zbek tilini o‘rgatishning dastlabki bosqichida e’tiborga olinadigan jihatlar", authors: "Dilfuza Pulatova", pages: "177" },
    { manuscriptId: "FVP-2026-030-078", field: "Pedagogika", title: "Bo‘lajak tarjimonlarga sotsiolingvistik birliklarni o‘rgatishning metodik asoslari", authors: "Muxlisa Yo‘ldosheva", pages: "180" },
    { manuscriptId: "FVP-2026-030-079", field: "Pedagogika", title: "Maktabgacha ta’lim tashkilotlarida inklyuziv mashg‘ulotlarni tashkil etishning zamonaviy yondashuvlari", authors: "Shohida Omanqulova", pages: "183" },
    { manuscriptId: "FVP-2026-030-080", field: "Pedagogika", title: "Oliy ta’lim muassasalarida tarbiyaviy ishlarni tashkil etishning xorijiy tajribalari va innovatsion jihatlari", authors: "Shirinboy Olimov · Madina Ziyotova", pages: "185" },
    { manuscriptId: "FVP-2026-030-081", field: "Pedagogika", title: "O‘zbek tilini xorijiy til sifatida o‘qitish: yondashuv va tahlillar", authors: "Dilfuza Pulatova", pages: "187" },
    { manuscriptId: "FVP-2026-030-082", field: "Pedagogika", title: "Razrabotka sistemy zadaniy s ispol’zovaniem mind maps na zanyatiyakh po russkomu yazyku na materiale temy «Glagol. Vid. Vremya. Spryazhenie»", authors: "El’vina Velishaeva", pages: "189" },
    { manuscriptId: "FVP-2026-030-083", field: "Pedagogika", title: "Osobennosti prepodavaniya russkogo yazyka kak nerodnogo v pedagogicheskikh universitetakh Uzbekistana (na primere izucheniya kategorii vida glagola)", authors: "Natal’ya Mamchich", pages: "191" },
    { manuscriptId: "FVP-2026-030-084", field: "Pedagogika", title: "Tekhnologii razvitiya diskursivnoy kompetentsii studentov v protsesse izucheniya vtorogo inostrannogo yazyka", authors: "Sayyora Umarova", pages: "195" },
    { manuscriptId: "FVP-2026-030-085", field: "Pedagogika", title: "Formirovanie professional’noy russkoyazychnoy kommunikativnoy kompetentsii studentov-psikhologov sredstvami keys-metoda", authors: "Iroda Mirakhmedova", pages: "197" },
    { manuscriptId: "FVP-2026-030-086", field: "Pedagogika", title: "Ispol’zovanie podvizhnykh igr dlya obogashcheniya slovarnogo zapasa uchashchikhsya", authors: "Kamola Latifova", pages: "199" },
    { manuscriptId: "FVP-2026-030-087", field: "Pedagogika", title: "Vliyanie tsifrovoy kommunikatsii na rechevuyu kul’turu sovremennoy molodyozhi", authors: "Nurzhamal Saparova", pages: "201" },
    { manuscriptId: "FVP-2026-030-088", field: "Pedagogika", title: "Graficheskiy narrativ kak sposob povysheniya uchebnoy motivatsii na urokakh russkogo yazyka i literatury", authors: "Barchinoy Ruzmetova", pages: "203" },
    { manuscriptId: "FVP-2026-030-089", field: "Pedagogika", title: "Vliyanie sotsial’nykh setey na rechevuyu kul’turu molodyozhi", authors: "Farangiza Ergasheva", pages: "205" },
    { manuscriptId: "FVP-2026-030-090", field: "Pedagogika", title: "Audio vositalar asosida ko‘zi ojiz o‘quvchilarning ingliz tilida og‘zaki nutq ko‘nikmalarini rivojlantirishning lingvodidaktik imkoniyatlari", authors: "Dildora Muslimova", pages: "207" },
    { manuscriptId: "FVP-2026-030-091", field: "Pedagogika", title: "O‘quvchilarning og‘zaki nutq ko‘nikmalarini o‘lchash konstruktlari evolutsiyasi", authors: "Feruza G‘aybulloyeva", pages: "209" },
    { manuscriptId: "FVP-2026-030-092", field: "Pedagogika", title: "Lirik asarlarni o‘qitishning o‘ziga xos usullari", authors: "Nafosat Hayitmurodova", pages: "211" },
    { manuscriptId: "FVP-2026-030-093", field: "Pedagogika", title: "Ispan tilini xorijiy til sifatida o‘qitishda kommunikativ yondashuvning ahamiyati", authors: "Nigina Mirzayeva · Feruza Tashpulatova", pages: "213" },
    { manuscriptId: "FVP-2026-030-094", field: "Pedagogika", title: "Aksiologik yondashuv asosida o‘quvchilarda muloqot madaniyatini rivojlantirishning nazariy-metodologik asoslari", authors: "Dilbar Toshtemirova", pages: "215" },
    { manuscriptId: "FVP-2026-030-095", field: "Pedagogika", title: "Oliy ta’lim tizimida registrator ofisi faoliyatini baholashning ergonomik ko‘rsatkichlari va mezonlari", authors: "Azizbek To‘xtamurodov", pages: "217" },
    { manuscriptId: "FVP-2026-030-096", field: "Pedagogika", title: "Ona tili ta’limining choraklik baholash jarayonida tinglab tushunish ko‘nikmasiga oid test topshiriqlaridan foydalanish", authors: "Dilobod Abduraimova", pages: "219" },
    { manuscriptId: "FVP-2026-030-097", field: "Pedagogika", title: "Axborot texnologiyalari yo‘nalishi talabalarining og‘zaki nutq kompetensiyasini rivojlantirishda sun’iy intellekt asosidagi o‘quv ekotizimining didaktik imkoniyatlari", authors: "Gulhayo G‘ofurova", pages: "221" },
    { manuscriptId: "FVP-2026-030-098", field: "Pedagogika", title: "The Possibilities of AI Tools in Learning English Grammar", authors: "Malika Ibrohimova · Barno Toshmatova", pages: "223" },
    { manuscriptId: "FVP-2026-030-099", field: "Pedagogika", title: "Effektivnye foneticheskie metody, neobkhodimye dlya zakrepleniya navykov pravil’nogo russkogo proiznosheniya", authors: "Adolat Karimova", pages: "225" },
    { manuscriptId: "FVP-2026-030-100", field: "Pedagogika", title: "Vliyanie narodnoy pedagogiki na formirovanie interesa molodezhi k natsional’nym tsennostyam", authors: "Turgangul Yesemuratova", pages: "227" },
    { manuscriptId: "FVP-2026-030-101", field: "Pedagogika", title: "Zamonaviy ta’lim tizimida inklyuziv ta’limning uslubiy asoslari", authors: "Gulnoza Abduraimova", pages: "229" },
    { manuscriptId: "FVP-2026-030-102", field: "Pedagogika", title: "Boshlang‘ich sinf o‘quvchilarida o‘qish savodxonligini rivojlantirishga innovatsion yondashuv", authors: "Mubinabonu Inomjonova", pages: "231" },
    { manuscriptId: "FVP-2026-030-103", field: "Pedagogika", title: "Maktabgacha ta’lim mutaxassislarining malakasini oshirish tizimini raqamlashtirish tamoyillari", authors: "Shaxnoza Qosimova · Abdujalil Dusmaxamedov", pages: "233" },
    { manuscriptId: "FVP-2026-030-104", field: "Pedagogika", title: "Oliy ta’limda raqamli savodxonlikni rivojlantirish: afzalliklar va xavflar", authors: "Nilufar Xujanova", pages: "236" },
    { manuscriptId: "FVP-2026-030-105", field: "Pedagogika", title: "The Relationship Between Beliefs and Listening Comprehension Skills", authors: "Shaxnoza Niyazova", pages: "238" },
    { manuscriptId: "FVP-2026-030-106", field: "Pedagogika", title: "Mumtoz matnlarni o‘qish va tushunish muammolari", authors: "Marjona Toshpulatova", pages: "240" },
    { manuscriptId: "FVP-2026-030-107", field: "Pedagogika", title: "Fostering Intercultural Communication Skills in University-Level English Classrooms", authors: "Nasibahon Jakbarova", pages: "242" },
    { manuscriptId: "FVP-2026-030-108", field: "Pedagogika", title: "Koreys va o‘zbek tillarida nutqiy etiketni o‘qitishning qiyosiy tahlili", authors: "Nigora Azimova", pages: "245" },
    { manuscriptId: "FVP-2026-030-109", field: "Pedagogika", title: "The Role of Teacher–Student Relationships in English Language Learning", authors: "Feruza Gulamova", pages: "247" },
    { manuscriptId: "FVP-2026-030-110", field: "Pedagogika", title: "Pragmatic Development of English Learners at Different Proficiency Levels", authors: "Sarvinozxon Akramova · Iroda Kaxarova", pages: "250" },
    { manuscriptId: "FVP-2026-030-111", field: "Pedagogika", title: "Obuchenie punktuatsii studentov-filologov v usloviyakh tsifrovizatsii obrazovaniya", authors: "Yelena Lagay", pages: "252" },
  ],
};

const ISSUE_10_29: ArchiveIssue = {
  volume: 10,
  number: 29,
  year: 2026,
  month: "May",
  publishedAt: "2026-05-15",
  pdfUrl: issue1029PdfAsset.url,
  coverUrl: issue1029CoverAsset.url,
  papers: [
    // 10.00.00 – FILOLOGIYA
    { manuscriptId: "FVP-2026-029-001", field: "Filologiya", title: "Zamonaviy tilshunoslikda til transformatsiyasi va unga ta’sir etuvchi omillar", authors: "Iroda Sayfullayeva", pages: "4" },
    { manuscriptId: "FVP-2026-029-002", field: "Filologiya", title: "Musiqiy terminologiyaning xitoy tilshunosligidagi tadqiqi: sintaktik va semantik asoslar", authors: "Charos Amirjonova", pages: "7" },
    { manuscriptId: "FVP-2026-029-003", field: "Filologiya", title: "Phonetic Variation in Chinese and Uzbek: a Comparative Phonological Approach", authors: "Nuriya Abdullayeva", pages: "9" },
    { manuscriptId: "FVP-2026-029-004", field: "Filologiya", title: "Cognitive Aspects of Metaphor in the Formation of Figurative Meaning in Literary Texts", authors: "Damira Abdusalomova", pages: "11" },
    { manuscriptId: "FVP-2026-029-005", field: "Filologiya", title: "Conceptual Metaphors of “HOPE” in English and “UMID” in Uzbek: a Theoretical-Comparative Discussion", authors: "Yulduz Khasanova", pages: "13" },
    { manuscriptId: "FVP-2026-029-006", field: "Filologiya", title: "Semantic and Axiological Features of the Concept “Child” in English Paremiology", authors: "Ayjamal Orazgalieva · Gulmira Usenova", pages: "15" },
    { manuscriptId: "FVP-2026-029-007", field: "Filologiya", title: "Qo‘chqor Norqobil asarlarining stilistik va poetik xususiyatlari", authors: "Mavluda Jabborova", pages: "18" },
    { manuscriptId: "FVP-2026-029-008", field: "Filologiya", title: "“Jallod ayol” qissasida obraz kechinmalari tavsifi", authors: "Shoiraxon Abduvaxobova", pages: "20" },
    { manuscriptId: "FVP-2026-029-009", field: "Filologiya", title: "Lirik qahramonning zamonaviy hikoyanavislikka kirib kelishi", authors: "Komiljon Djurayev", pages: "22" },
    { manuscriptId: "FVP-2026-029-010", field: "Filologiya", title: "Divided Attention Exercises in Training Sight Translation and Interpretation", authors: "Dilafruz Kurbanova", pages: "25" },
    { manuscriptId: "FVP-2026-029-011", field: "Filologiya", title: "Jamol Kamolning she’r nazariyasiga oid qarashlari", authors: "Ro‘zigul Qodirova · Madina Hojimurotova", pages: "27" },
    { manuscriptId: "FVP-2026-029-012", field: "Filologiya", title: "AI-Based Linguocultural Toponym Translation System for English and Uzbek: a Hybrid Approach for Low-resource Neural Machine Translation", authors: "Feruza Khayitova", pages: "29" },
    { manuscriptId: "FVP-2026-029-013", field: "Filologiya", title: "O‘zbek tilidagi she’rlarning fransuz tilidagi tarjimasida lingvopoetik xususiyatlarning ifodalanishi", authors: "Tursuntosh Eshboyeva", pages: "31" },
    { manuscriptId: "FVP-2026-029-014", field: "Filologiya", title: "Zamonaviy media makonda jurnalistika ta’limi modellari va nazariya-amaliyot integratsiyasi", authors: "Shahnoza Uzakova", pages: "33" },
    { manuscriptId: "FVP-2026-029-015", field: "Filologiya", title: "Turkiy xalqlar adabiyotida To‘maris afsonasi: sujet, arxetip va motivlar talqini", authors: "Hulkar Mustafoyeva", pages: "35" },
    { manuscriptId: "FVP-2026-029-016", field: "Filologiya", title: "Hozirgi rus va o‘zbek tillarida amerikanizmlarning lingvistik xususiyatlari", authors: "Nasiba Sattorova", pages: "37" },
    { manuscriptId: "FVP-2026-029-017", field: "Filologiya", title: "Maqollarda ramz, kinoya va evfemistik ma’no uyg‘unligi", authors: "Sohiba Jummayeva", pages: "39" },
    { manuscriptId: "FVP-2026-029-018", field: "Filologiya", title: "Siyosiy diskursda bahoning eksplitsit ifodalanishi: lingvopragmatik tahlil", authors: "Nargiza Umarova · Gulbahor Komilova", pages: "41" },
    { manuscriptId: "FVP-2026-029-019", field: "Filologiya", title: "Ilk o‘zbek milliy romanining qiyosiy-matniy tadqiqi", authors: "Lola Toshtemirova", pages: "43" },
    { manuscriptId: "FVP-2026-029-020", field: "Filologiya", title: "Xalq ijodining milliy madaniyatni rivojlantirishdagi ahamiyati", authors: "Navruza Tursunova", pages: "46" },
    { manuscriptId: "FVP-2026-029-021", field: "Filologiya", title: "Ahmad Yugnakiyning “Hibat ul-haqoyiq” asarida poetik xususiyatlar", authors: "Jasmina Ibotova", pages: "48" },
    { manuscriptId: "FVP-2026-029-022", field: "Filologiya", title: "Muhammad Yusuf mualliflik korpusini yaratish", authors: "Kunduz Ibodullayeva · Mashhura Normamatova · Laylo Omonboyeva · Gulrang Jabborova", pages: "50" },
    { manuscriptId: "FVP-2026-029-023", field: "Filologiya", title: "Polozhitel’naya i otritsatel’naya otsenka vo frazeologizmakh russkogo i uzbekskogo yazyka", authors: "Iroda Alimbaeva", pages: "53" },
    { manuscriptId: "FVP-2026-029-024", field: "Filologiya", title: "Osnovnye formy rechevoy agressii v povsednevnom obshchenii", authors: "Al’fiya Galyamova", pages: "55" },
    { manuscriptId: "FVP-2026-029-025", field: "Filologiya", title: "Narrativnye strategii reprezentatsii istoricheskoy travmy", authors: "Umida Gafurova · Shoira Urinova", pages: "57" },
    { manuscriptId: "FVP-2026-029-026", field: "Filologiya", title: "Fol’klornyy kod v romane M. A. Bulgakova «Master i Margarita»", authors: "Veronika Matkurbonova", pages: "59" },
    { manuscriptId: "FVP-2026-029-027", field: "Filologiya", title: "Rol’ narodnoy dramy i fol’klora v formirovanii khudozhestvennogo stilya A. N. Ostrovskogo", authors: "Lola Bekmirzaeva · Nargizakhon Mukhammadalieva", pages: "61" },
    { manuscriptId: "FVP-2026-029-028", field: "Filologiya", title: "Problemy i perspektivy razvitiya sravnitel’nogo literaturovedeniya v kontekste mirovoy literatury", authors: "Nilufar Zakirova", pages: "63" },
    { manuscriptId: "FVP-2026-029-029", field: "Filologiya", title: "Spetsifika khronotopa v romane Andreya Volosa «Khurramabad»", authors: "Dil’bar Radzhabova", pages: "65" },
    { manuscriptId: "FVP-2026-029-030", field: "Filologiya", title: "Gendernoe svoeobrazie tipologii i poetiki rasskazov T. Tolstoy, L. Petrushevskoy, L. Ulitskoy", authors: "Madinabonu Rasulova · Gulnoz Nigmatova", pages: "67" },
    { manuscriptId: "FVP-2026-029-031", field: "Filologiya", title: "Nravstvennye idealy L. N. Tolstogo v kontekste russkoy filosofii", authors: "Lola Bekmirzaeva · Shakhnozabonu Khozhiakbarova", pages: "69" },
    { manuscriptId: "FVP-2026-029-032", field: "Filologiya", title: "Kognitivnye modeli negativnoy kharakteristiki lichnosti v russkoy zoonimicheskoy frazeologii", authors: "Zamira Kholikova", pages: "71" },
    { manuscriptId: "FVP-2026-029-033", field: "Filologiya", title: "Rasmiy-huquqiy hujjatlar matnining nazariy asoslari va lisoniy tadqiqi", authors: "Fazilat Ismoilova", pages: "73" },
    { manuscriptId: "FVP-2026-029-034", field: "Filologiya", title: "Motivy preemstvennosti pokoleniy v istoricheskom i semeynom kontekste: ot «Kapitanskoy dochki» k «Borisu Godunovu»", authors: "Lola Bekmirzaeva · Kamola Erkinzhonova", pages: "75" },
    { manuscriptId: "FVP-2026-029-035", field: "Filologiya", title: "Iskusstvennyy intellekt i yazykovye izmeneniya v sovremennoy kommunikatsii", authors: "Mukhayo Yusupbaeva", pages: "77" },
    { manuscriptId: "FVP-2026-029-036", field: "Filologiya", title: "Said Anvarning hajviy hikoyalarida badiiy mahorat", authors: "Elbek Oqbo‘tayev", pages: "79" },
    { manuscriptId: "FVP-2026-029-037", field: "Filologiya", title: "Osvoenie vostochnykh zaimstvovaniy v russkom yazyke", authors: "Sarvinoz Zhamolova", pages: "82" },
    { manuscriptId: "FVP-2026-029-038", field: "Filologiya", title: "Lexical Doublets and Stylistic Variation: a Comparative-Typological Analysis", authors: "Aziza Raxmonova", pages: "84" },
    { manuscriptId: "FVP-2026-029-039", field: "Filologiya", title: "Ayol obrazini yaratishda psixologik portretning o‘rni (Zulfiya Qurolboy qizi romanlari misolida)", authors: "Darmonjon Sadullayeva", pages: "86" },
    { manuscriptId: "FVP-2026-029-040", field: "Filologiya", title: "Lingvokul’turologicheskaya dekonstruktsiya kontsepta «zhizn’» v postmodernistskom diskurse (na materiale prozy V. Pelevina)", authors: "Sherzod Bobokulov · Rimma Biksalieva", pages: "88" },
    { manuscriptId: "FVP-2026-029-041", field: "Filologiya", title: "Khudozhestvennaya funktsiya irreal’nosti v romane «Eshelon na Samarkand»", authors: "Feruza Irkabaeva", pages: "91" },
    { manuscriptId: "FVP-2026-029-042", field: "Filologiya", title: "Konsept va lingvomadaniyat mutanosibligi", authors: "Nafisa Sattorova", pages: "93" },
    { manuscriptId: "FVP-2026-029-043", field: "Filologiya", title: "Nazar Eshonqul ijodining o‘zbek zamonaviy nasridagi o‘rni", authors: "Madina Xolliyeva", pages: "96" },
    { manuscriptId: "FVP-2026-029-044", field: "Filologiya", title: "Ponyatie pryamogo i perenosnogo znacheniya v russkoy lingvistike", authors: "Farrukh Safarov", pages: "98" },
    { manuscriptId: "FVP-2026-029-045", field: "Filologiya", title: "“Kasb-hunar” konseptining semantik maydoni va uning ingliz maqollarida aks etishi", authors: "Muhriddin Xurramov", pages: "101" },
    { manuscriptId: "FVP-2026-029-046", field: "Filologiya", title: "Lingvisticheskoe opisanie graduonimov v ispanskikh i uzbekskikh narodnykh poslovitsakh", authors: "Shoira Tashniyozova", pages: "103" },
    { manuscriptId: "FVP-2026-029-047", field: "Filologiya", title: "Reprezentatsiya istorii strany cherez sud’bu sem’i v rasskaze Antonii Bayett «Sakharnoe delo»", authors: "Malika Fayzieva", pages: "105" },
    { manuscriptId: "FVP-2026-029-048", field: "Filologiya", title: "Aspekty izucheniya slov kategorii sostoyaniya v russkom i uzbekskom yazykakh", authors: "Zarina Babaeva · Khilola Abdirayimova", pages: "108" },
    { manuscriptId: "FVP-2026-029-049", field: "Filologiya", title: "Evfemizmy kak sredstvo etiko-ritoricheskoy organizatsii rechi", authors: "Shoirakhon Parpieva · Gulchekhra Davlyatova", pages: "110" },
    { manuscriptId: "FVP-2026-029-050", field: "Filologiya", title: "Yazykovye sredstva vyrazheniya tsennostnoy otsenki v paremiyakh", authors: "Fakhriddin Yulbarsov", pages: "112" },
    { manuscriptId: "FVP-2026-029-051", field: "Filologiya", title: "Tilshunoslikda konversiya va transpozitsiya fenomenining konseptual-tarixiy talqinlari", authors: "Bibigul Hamidova", pages: "114" },
    { manuscriptId: "FVP-2026-029-052", field: "Filologiya", title: "Ingliz tilidagi adabiy, publitsistik va ommaviy matnlarda tinish belgilarining ekspressiv imkoniyatlari", authors: "Latofat Islomova", pages: "117" },
    { manuscriptId: "FVP-2026-029-053", field: "Filologiya", title: "Sh. Seytovning “Kóp edi ketken tírnalar” qissasida portret tasvirlari tahlili", authors: "Nurzada Jawilbaeva", pages: "120" },
    { manuscriptId: "FVP-2026-029-054", field: "Filologiya", title: "O‘zbek va ingliz xalq ertaklarida sehrli sonlarning funksional-semantik xususiyatlari va tipologik universalligi", authors: "Munisa Sayfiddinova", pages: "122" },
    { manuscriptId: "FVP-2026-029-055", field: "Filologiya", title: "O‘zbek maqollarida son kategoriyasining ifodalanishi", authors: "Sunnatulla Usmanov", pages: "124" },
    { manuscriptId: "FVP-2026-029-056", field: "Filologiya", title: "Linguocultural Features of Urbanonyms: a Comparative Analysis of English and Uzbek Cities", authors: "Lobar Bakhramova", pages: "126" },
    { manuscriptId: "FVP-2026-029-057", field: "Filologiya", title: "Isajon Sulton ijodida modernizm talqini (“Farishta” hikoyasi misolida)", authors: "Gulhayo Meyliyeva", pages: "128" },
    { manuscriptId: "FVP-2026-029-058", field: "Filologiya", title: "Badiiy adabiyotda Xizr obrazining talqini", authors: "Ma’mura Sharipova · Umida Rasulova", pages: "130" },
    { manuscriptId: "FVP-2026-029-059", field: "Filologiya", title: "Communicative Features of Headlines in Political Publications and their Role in Political Discourse", authors: "Mavlonbek Abdiyev", pages: "132" },
    { manuscriptId: "FVP-2026-029-060", field: "Filologiya", title: "“Xamsa”larda Bahrom G‘o‘r obrazining yangilanishi", authors: "Intizor Abdujabborova", pages: "134" },
    { manuscriptId: "FVP-2026-029-061", field: "Filologiya", title: "Typological and Linguistic Features of the Novel Genre in English and Uzbek Literature Based on a Diachronic Corpus", authors: "Nargiza Kaxorova", pages: "136" },
    { manuscriptId: "FVP-2026-029-062", field: "Filologiya", title: "Ingliz va o‘zbek tillarida somatik komponentli frazeologik birliklarning yondosh birliklar bilan o‘zaro aloqasi", authors: "Ziyoda Nazarova", pages: "138" },
    { manuscriptId: "FVP-2026-029-063", field: "Filologiya", title: "Yog‘ochga badiiy ishlov berish san’atining o‘ziga xos xususiyatlari", authors: "Abdumalik Sharipov · Shaxnoza Po‘latova", pages: "140" },
    { manuscriptId: "FVP-2026-029-064", field: "Filologiya", title: "Fitrat dramalaridagi frazemalarning semantik tahlili", authors: "Ismigul Imomova", pages: "142" },
    { manuscriptId: "FVP-2026-029-065", field: "Filologiya", title: "Konfliktli matnlarni lingvistik ekspertiza asosida tahlil qilishning ilmiy-metodik jihatlari", authors: "Farogat Kurbanova", pages: "145" },
    { manuscriptId: "FVP-2026-029-066", field: "Filologiya", title: "O‘zbek tilida konseptual metaforalar tahlili (kognitiv tilshunoslik asosida)", authors: "Nurjayna Oringalieva", pages: "147" },
    { manuscriptId: "FVP-2026-029-067", field: "Filologiya", title: "Istiqlol davri she’riyatida individual janrlarning o‘ziga xos xususiyatlari", authors: "Quvonch Mamiraliyev", pages: "149" },
    { manuscriptId: "FVP-2026-029-068", field: "Filologiya", title: "Go‘ro‘g‘li turkumidagi dostonlarning lingvopoetikasi, ramz va timsollarning lingvistik talqini", authors: "Nigora Raxmonova", pages: "151" },
    { manuscriptId: "FVP-2026-029-069", field: "Filologiya", title: "A Lexico-Semantic Analysis of Meronymy and Holonymy in English Vocabulary", authors: "Mahfuza Safarova", pages: "153" },
    { manuscriptId: "FVP-2026-029-070", field: "Filologiya", title: "The Influence of Syntactic Structure of Sentences in Advertising Texts on Nonverbal Means", authors: "Shakhnoza Yunusova", pages: "155" },
    { manuscriptId: "FVP-2026-029-071", field: "Filologiya", title: "Tarixiy manbalarda kasallik nomlarining qo‘llanishi va tarixiy taraqqiyoti", authors: "Dilnura Axmadova", pages: "157" },
    { manuscriptId: "FVP-2026-029-072", field: "Filologiya", title: "Rasmiy-huquqiy matnda semantik birliklar va mazmuniy yaxlitlik", authors: "Fazilat Ismoilova", pages: "159" },
    { manuscriptId: "FVP-2026-029-073", field: "Filologiya", title: "A. S. Byatt hikoyalarida ichki qarshilik mexanizmi", authors: "Komiljon Djurayev", pages: "161" },

    // 13.00.00 – PEDAGOGIKA
    { manuscriptId: "FVP-2026-029-074", field: "Pedagogika", title: "Bo‘lajak ingliz tili o‘qituvchilarining lingvistik kompetensiyasini takomillashtirish metodikasi", authors: "Azizbek Abdupattayev", pages: "163" },
    { manuscriptId: "FVP-2026-029-075", field: "Pedagogika", title: "O‘zbek tilini xorijiy til sifatida o‘qitishda autentik matnlarning o‘qib tushunish kompetensiyasini rivojlantirishdagi o‘rni", authors: "Lobarxon Ergasheva", pages: "166" },
    { manuscriptId: "FVP-2026-029-076", field: "Pedagogika", title: "Developing the Creative Competence of Future English Language Teachers Through the Flipped Classroom Model", authors: "Gulbahor Eshchanova", pages: "168" },
    { manuscriptId: "FVP-2026-029-077", field: "Pedagogika", title: "Ona tili darslarida ta’limiy o‘yinlarning nazariy asoslari va didaktik mohiyati", authors: "Yulduz O‘roqova", pages: "171" },
    { manuscriptId: "FVP-2026-029-078", field: "Pedagogika", title: "Poeticheskiy tekst kak ob’ekt lingvodidakticheskogo analiza v usloviyakh bilingval’nogo obrazovaniya", authors: "Sevara Abdukayumova", pages: "173" },
    { manuscriptId: "FVP-2026-029-079", field: "Pedagogika", title: "Rol’ robototekhniki v formirovanii poznavatel’noy aktivnosti doshkol’nikov", authors: "Guljakhan Turebekova · Gulrukh Akhmedova", pages: "175" },
    { manuscriptId: "FVP-2026-029-080", field: "Pedagogika", title: "Kompleksnyy podkhod kak osnova effektivnoy podgotovki detey doshkol’nogo vozrasta k shkol’nomu obucheniyu", authors: "Venera Dauletiyarova", pages: "177" },
    { manuscriptId: "FVP-2026-029-081", field: "Pedagogika", title: "Metodicheskie osnovy razvitiya rechevykh i lingvisticheskikh kompetentsiy studentov meditsinskikh vuzov posredstvom samostoyatel’nogo obucheniya i uchebnykh zadaniy", authors: "Zarina Dzhumaeva", pages: "179" },
    { manuscriptId: "FVP-2026-029-082", field: "Pedagogika", title: "Osobennosti obucheniya i vospitaniya v doshkol’nykh obrazovatel’nykh organizatsiyakh", authors: "Lizakhan Ibragimova · Madina Igilikova", pages: "181" },
    { manuscriptId: "FVP-2026-029-083", field: "Pedagogika", title: "Razvitie intellekta u detey starshego doshkol’nogo vozrasta", authors: "Zhanar Ergalieva", pages: "183" },
    { manuscriptId: "FVP-2026-029-084", field: "Pedagogika", title: "Rol’ intonatsii i slov vracha v lechenii patsientov", authors: "Shakhlo Norkulova · Behruz Mamadiyorov", pages: "185" },
    { manuscriptId: "FVP-2026-029-085", field: "Pedagogika", title: "Osobennosti razvitiya vnimaniya studentov", authors: "Liza Saparova · Makhset Kurbaniyazov", pages: "187" },
    { manuscriptId: "FVP-2026-029-086", field: "Pedagogika", title: "Bo‘lajak o‘qituvchilarda umummadaniy dunyoqarashni shakllantirish xususiyatlari", authors: "Surayyo Sharipova", pages: "189" },
    { manuscriptId: "FVP-2026-029-087", field: "Pedagogika", title: "Teoretiko-metodicheskie osnovy prepodavaniya russkogo yazyka i literatury v bilingval’nom obrazovatel’nom prostranstve Uzbekistana", authors: "Dilrabo Ergashalieva", pages: "191" },
    { manuscriptId: "FVP-2026-029-088", field: "Pedagogika", title: "Improving Law Students’ Professional Communicative Competence Through Task-Based Legal English Instruction", authors: "Nodiraxon Xatamova", pages: "193" },
    { manuscriptId: "FVP-2026-029-089", field: "Pedagogika", title: "Adabiyotshunoslik terminlarining maktab darsliklaridagi ifodasi: tahlil va nazariy mulohazalar", authors: "Inobat Omonova", pages: "195" },
    { manuscriptId: "FVP-2026-029-090", field: "Pedagogika", title: "Metody oznakomleniya detey 3–4 let s prirodoy", authors: "Rayhan Aleuova", pages: "198" },
    { manuscriptId: "FVP-2026-029-091", field: "Pedagogika", title: "Metody izucheniya sotsial’noy sredy v doshkol’nykh obrazovatel’nykh organizatsiyakh", authors: "Guljakhan Turebekova", pages: "200" },
    { manuscriptId: "FVP-2026-029-092", field: "Pedagogika", title: "Effektivnost’ mobil’nykh tsifrovykh tekhnologiy v razvitii kommunikativnykh navykov pri kollaborativnom obuchenii", authors: "Maksad Kudratov", pages: "202" },
    { manuscriptId: "FVP-2026-029-093", field: "Pedagogika", title: "Mekhanizmy povysheniya kachestva sovremennogo yazykovogo obrazovaniya na osnove razvitiya mezhkul’turnoy kommunikativnoy kompetentsii", authors: "Vasila Mamatkasimova", pages: "204" },
    { manuscriptId: "FVP-2026-029-094", field: "Pedagogika", title: "Klassifikatsiya pis’mennykh uprazhneniy v metodike prepodavaniya koreyskogo yazyka", authors: "Muzayyana Odilova", pages: "206" },
    { manuscriptId: "FVP-2026-029-095", field: "Pedagogika", title: "Sovremennye podkhody k lingvodidaktike: obsuzhdenie novykh metodov i tekhnologiy v obuchenii russkomu yazyku", authors: "Nurzhamal Saparova", pages: "209" },
    { manuscriptId: "FVP-2026-029-096", field: "Pedagogika", title: "Sun’iy intellektning zamonaviy ESP ta’limidagi o‘rni", authors: "Aliya Abduraxmanova", pages: "211" },
    { manuscriptId: "FVP-2026-029-097", field: "Pedagogika", title: "Biologiya ta’limi sifatini oshirishda xalqaro o‘quv dasturlarining didaktik imkoniyatlari", authors: "Iqbolxon Abduraxmanova", pages: "212" },
    { manuscriptId: "FVP-2026-029-098", field: "Pedagogika", title: "Texnologiya fanida 4K modeli va interfaol metodlardan foydalanishning afzalliklari", authors: "Bakit Bisenova · Gulbaxor Xamroyeva", pages: "215" },
    { manuscriptId: "FVP-2026-029-099", field: "Pedagogika", title: "Kognitiv faoliyatni baholashning diagnostik metodlari va uni bosqichma-bosqich shakllantirish modeli", authors: "Gulrux Abdiraimova", pages: "217" },
    { manuscriptId: "FVP-2026-029-100", field: "Pedagogika", title: "Hozirgi o‘zbek adabiy tilini o‘qitishning zamonaviy metodologik asoslari", authors: "Umida Abdurasulova", pages: "219" },
    { manuscriptId: "FVP-2026-029-101", field: "Pedagogika", title: "Talabalarning o‘qish faoliyatini takomillashtirishning ta’lim samaradorligiga ta’siri", authors: "Xusanboy Tursunov", pages: "221" },
    { manuscriptId: "FVP-2026-029-102", field: "Pedagogika", title: "Maktabgacha ta’lim tashkilotlari va pedagogika kollejlari o‘rtasida ijtimoiy hamkorlikni tashkil etish", authors: "Gulruxsor Sharipova", pages: "223" },
    { manuscriptId: "FVP-2026-029-103", field: "Pedagogika", title: "Kursantlarning bilish faolligini oshirishda tinglab tushunish ko‘nikmalari va ularni o‘rgatishda uchrayotgan muammolar", authors: "Nargiza Shirinova", pages: "225" },
    { manuscriptId: "FVP-2026-029-104", field: "Pedagogika", title: "Sun’iy intellekt va raqamli texnologiyalar asosida xitoy tilini o‘qitish metodikasini takomillashtirish", authors: "Muxlisa Usmonaliyeva", pages: "227" },
    { manuscriptId: "FVP-2026-029-105", field: "Pedagogika", title: "Tibbiy ta’limda xorijiy talabalarning o‘zbek tilidagi kommunikativ kompetensiyasini rivojlantirish masalalari", authors: "Rukiya Ashurbayeva", pages: "229" },
    { manuscriptId: "FVP-2026-029-106", field: "Pedagogika", title: "Talabalarning robototexnikaga oid intellektual qobiliyatini rivojlantirishning didaktik ta’minotini takomillashtirish", authors: "Feruza Mardonova", pages: "232" },
    { manuscriptId: "FVP-2026-029-107", field: "Pedagogika", title: "Bitiruvchilar bandligi monitoringi asosida oliy ta’lim sifatini boshqarish mexanizmlarini takomillashtirish", authors: "Shahobiddin Abdug‘aniyev", pages: "234" },
    { manuscriptId: "FVP-2026-029-108", field: "Pedagogika", title: "O‘zbekiston mehnat bozoridagi zamonaviy tendensiyalar va oliy ma’lumotli kadrlarga bo‘lgan talab tahlili", authors: "Shahobiddin Abdug‘aniyev", pages: "236" },
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
  {
    volume: 11,
    year: 2026,
    issues: [ISSUE_11_30],
  },
  {
    volume: 10,
    year: 2026,
    issues: [ISSUE_10_29],
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

