// Illustrative archive data for Phase 0. Publication is not yet part of the
// vertical workflow, so these entries are labeled as a tahririy ko‘rinish
// (editorial preview) in the UI. They are static and read-only.

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
  papers: ArchivePaper[];
};

export type ArchiveVolume = {
  volume: number;
  year: number;
  issues: ArchiveIssue[];
};

// Current issue lives at the top; used by /joriy-son as well.
export const CURRENT_ISSUE: ArchiveIssue = {
  volume: 70,
  number: 3,
  year: 2026,
  month: "Iyul",
  papers: [
    {
      manuscriptId: "OTA-2026-0042",
      field: "Filologiya",
      title: "O‘zbek tilida zamon kategoriyasining zamonaviy talqinlari",
      authors: "Akmal Karimov · Dilnoza Rasulova",
      affiliation:
        "Alisher Navoiy nomidagi Toshkent davlat o‘zbek tili va adabiyoti universiteti",
      pages: "5–24",
      excerpt:
        "Fe’l zamonlarining nutqiy vaziyatga bog‘liqligi struktural va kognitiv yondashuvlar asosida yoritilgan.",
      keywords: ["o‘zbek tili", "grammatika", "zamon kategoriyasi"],
    },
    {
      manuscriptId: "OTA-2026-0041",
      field: "Filologiya",
      title:
        "Alisher Navoiy g‘azallarida ramziy obrazlar tizimi: matnshunoslik yondashuvi",
      authors: "Dilnoza Rasulova",
      affiliation: "Samarqand davlat universiteti",
      pages: "25–48",
      excerpt:
        "«Xazoyin ul-maoniy» devonidagi ramziy obrazlarning matnlararo aloqalari tahlil qilinadi.",
      keywords: ["Alisher Navoiy", "g‘azal", "matnshunoslik"],
    },
    {
      manuscriptId: "OTA-2026-0043",
      field: "Filologiya",
      title: "Cho‘lpon she’riyatining ingliz tiliga tarjimasi: uslubiy masalalar",
      authors: "Sherzod Nazarov",
      affiliation: "O‘zbekiston jahon tillari universiteti",
      pages: "49–66",
      excerpt:
        "Cho‘lpon lirikasidagi milliy poetik obrazlarning zamonaviy inglizcha tarjimalari qiyoslanadi.",
      keywords: ["Cho‘lpon", "tarjima", "she’riyat"],
    },
  ],
};

const ISSUE_70_2: ArchiveIssue = {
  volume: 70,
  number: 2,
  year: 2026,
  month: "Aprel",
  papers: [
    {
      manuscriptId: "OTA-2026-0038",
      field: "Filologiya",
      title:
        "XIX asr Buxoro qo‘lyozmalarida imlo tizimi: tanqidiy nashr masalalari",
      authors: "Bahodir Ergashev",
      affiliation:
        "O‘zbekiston Respublikasi Fanlar akademiyasi Sharqshunoslik instituti",
      pages: "5–28",
      excerpt:
        "Buxoro madrasalarida ko‘chirilgan qo‘lyozmalardagi imlo o‘zgarishlari va tanqidiy nashr amaliyotidagi aks etishi.",
      keywords: ["qo‘lyozma", "tanqidiy nashr", "imlo"],
    },
    {
      manuscriptId: "OTA-2026-0035",
      field: "Filologiya",
      title: "Qoraqalpoq xalq dostonlaridagi ovozli formulalar: qiyosiy tahlil",
      authors: "Nodira Yusupova · Rustam Sattorov",
      affiliation: "Qoraqalpoq davlat universiteti",
      pages: "29–52",
      excerpt:
        "O‘zbek va qoraqalpoq epik an’analaridagi takrorlanuvchi ovozli formulalar tizimi qiyoslanadi.",
      keywords: ["folklor", "doston", "og‘zaki ijod"],
    },
    {
      manuscriptId: "OTA-2026-0033",
      field: "Filologiya",
      title: "Farg‘ona vodiysi shevalarida unlilar tizimining evolyutsiyasi",
      authors: "Rustam Sattorov",
      affiliation: "Farg‘ona davlat universiteti",
      pages: "53–72",
      excerpt:
        "So‘nggi yarim asrdagi maydon materiallariga asoslangan tovush o‘zgarishlari kuzatiladi.",
      keywords: ["dialektologiya", "unlilar", "Farg‘ona"],
    },
  ],
};

const ISSUE_70_1: ArchiveIssue = {
  volume: 70,
  number: 1,
  year: 2026,
  month: "Yanvar",
  papers: [
    {
      manuscriptId: "OTA-2026-0012",
      field: "Filologiya",
      title: "Abdulla Qodiriy nasrida tarixiy roman poetikasi",
      authors: "Gulnora Toshmatova",
      affiliation: "Toshkent davlat universiteti",
      pages: "5–26",
    },
    {
      manuscriptId: "OTA-2026-0009",
      field: "Filologiya",
      title: "O‘zbek tilida sintaktik konstruksiyalarning korpus tahlili",
      authors: "Akmal Karimov",
      affiliation: "O‘zbek tili va adabiyoti universiteti",
      pages: "27–48",
    },
  ],
};

const ISSUE_69_4: ArchiveIssue = {
  volume: 69,
  number: 4,
  year: 2025,
  month: "Oktyabr",
  papers: [
    {
      manuscriptId: "OTA-2025-0141",
      field: "Filologiya",
      title: "«Boburnoma» qo‘lyozmalarining qiyosiy tavsifi",
      authors: "Bahodir Ergashev",
      pages: "5–32",
    },
    {
      manuscriptId: "OTA-2025-0137",
      field: "Filologiya",
      title: "Zamonaviy o‘zbek she’riyatida shakl izlanishlari",
      authors: "Dilnoza Rasulova",
      pages: "33–54",
    },
  ],
};

const ISSUE_69_3: ArchiveIssue = {
  volume: 69,
  number: 3,
  year: 2025,
  month: "Iyul",
  papers: [
    {
      manuscriptId: "OTA-2025-0108",
      field: "Filologiya",
      title: "Turkiy tillar oilasida o‘zbek tilining tipologik o‘rni",
      authors: "Akmal Karimov · Sherzod Nazarov",
      pages: "5–30",
    },
  ],
};

export const ARCHIVE_VOLUMES: ArchiveVolume[] = [
  {
    volume: 70,
    year: 2026,
    issues: [CURRENT_ISSUE, ISSUE_70_2, ISSUE_70_1],
  },
  {
    volume: 69,
    year: 2025,
    issues: [ISSUE_69_4, ISSUE_69_3],
  },
  { volume: 68, year: 2024, issues: [] },
  { volume: 67, year: 2023, issues: [] },
  { volume: 66, year: 2022, issues: [] },
];

export function findIssue(volume: number, number: number): ArchiveIssue | null {
  for (const v of ARCHIVE_VOLUMES) {
    if (v.volume !== volume) continue;
    return v.issues.find((i) => i.number === number) ?? null;
  }
  return null;
}
