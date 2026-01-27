/**
 * Database Seed Script
 * 
 * This script populates the database with initial hadith collections
 * and an admin user for the dashboard.
 * 
 * Run with: npx prisma db seed
 */

import { PrismaClient, UserRole, HadithGrade } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/** Hadith collection data for seeding */
const hadithCollections = [
  {
    name: 'Sahih al-Bukhari',
    nameArabic: 'صحيح البخاري',
    slug: 'bukhari',
    compiler: 'Imam Muhammad al-Bukhari',
    compilerArabic: 'الإمام محمد البخاري',
    description: 'The most authentic collection of Hadith, compiled by Imam al-Bukhari (810-870 CE). Contains 7,275 hadiths.',
    totalHadiths: 7275,
  },
  {
    name: 'Sahih Muslim',
    nameArabic: 'صحيح مسلم',
    slug: 'muslim',
    compiler: 'Imam Muslim ibn al-Hajjaj',
    compilerArabic: 'الإمام مسلم بن الحجاج',
    description: 'The second most authentic collection of Hadith, compiled by Imam Muslim (821-875 CE). Contains 7,563 hadiths.',
    totalHadiths: 7563,
  },
  {
    name: 'Sunan Abu Dawud',
    nameArabic: 'سنن أبي داود',
    slug: 'abudawud',
    compiler: 'Imam Abu Dawud',
    compilerArabic: 'الإمام أبو داود',
    description: 'Collection of Hadith compiled by Imam Abu Dawud (817-889 CE). Contains 5,274 hadiths.',
    totalHadiths: 5274,
  },
  {
    name: 'Jami` at-Tirmidhi',
    nameArabic: 'جامع الترمذي',
    slug: 'tirmidhi',
    compiler: 'Imam at-Tirmidhi',
    compilerArabic: 'الإمام الترمذي',
    description: 'Collection of Hadith compiled by Imam at-Tirmidhi (824-892 CE). Contains 3,956 hadiths.',
    totalHadiths: 3956,
  },
  {
    name: 'Sunan an-Nasa\'i',
    nameArabic: 'سنن النسائي',
    slug: 'nasai',
    compiler: 'Imam an-Nasa\'i',
    compilerArabic: 'الإمام النسائي',
    description: 'Collection of Hadith compiled by Imam an-Nasa\'i (829-915 CE). Contains 5,761 hadiths.',
    totalHadiths: 5761,
  },
  {
    name: 'Sunan Ibn Majah',
    nameArabic: 'سنن ابن ماجه',
    slug: 'ibnmajah',
    compiler: 'Imam Ibn Majah',
    compilerArabic: 'الإمام ابن ماجه',
    description: 'Collection of Hadith compiled by Imam Ibn Majah (824-887 CE). Contains 4,341 hadiths.',
    totalHadiths: 4341,
  },
  {
    name: 'Muwatta Malik',
    nameArabic: 'موطأ مالك',
    slug: 'malik',
    compiler: 'Imam Malik ibn Anas',
    compilerArabic: 'الإمام مالك بن أنس',
    description: 'One of the earliest collections of Hadith, compiled by Imam Malik (711-795 CE). Contains 1,720 hadiths.',
    totalHadiths: 1720,
  },
  {
    name: 'Musnad Ahmad',
    nameArabic: 'مسند أحمد',
    slug: 'ahmad',
    compiler: 'Imam Ahmad ibn Hanbal',
    compilerArabic: 'الإمام أحمد بن حنبل',
    description: 'Massive collection of Hadith compiled by Imam Ahmad (780-855 CE). Contains 27,000+ hadiths.',
    totalHadiths: 27000,
  },
  {
    name: 'Riyad as-Salihin',
    nameArabic: 'رياض الصالحين',
    slug: 'riyadussalihin',
    compiler: 'Imam an-Nawawi',
    compilerArabic: 'الإمام النووي',
    description: 'Compilation of verses from the Quran and Hadith by Imam Nawawi (1233-1277 CE). Contains 1,896 hadiths.',
    totalHadiths: 1896,
  },
  {
    name: 'Bulugh al-Maram',
    nameArabic: 'بلوغ المرام',
    slug: 'bulugh',
    compiler: 'Ibn Hajar al-Asqalani',
    compilerArabic: 'ابن حجر العسقلاني',
    description: 'Collection of Hadith on Islamic jurisprudence by Ibn Hajar (1372-1449 CE). Contains 1,358 hadiths.',
    totalHadiths: 1358,
  },
];

/** Sample hadiths for demonstration */
const sampleHadiths = [
  {
    collectionSlug: 'bukhari',
    bookName: 'Revelation',
    bookNameArabic: 'بدء الوحي',
    bookNumber: 1,
    hadiths: [
      {
        hadithNumber: 1,
        arabicText: 'حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ قَالَ حَدَّثَنَا سُفْيَانُ قَالَ حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ قَالَ أَخْبَرَنِي مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ يَقُولُ سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ عَلَى الْمِنْبَرِ قَالَ سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
        englishText: 'I heard Allah\'s Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended."',
        narrator: 'Umar ibn al-Khattab',
        grade: HadithGrade.SAHIH,
        gradeSource: 'Bukhari',
        reference: 'Sahih al-Bukhari 1',
      },
      {
        hadithNumber: 2,
        arabicText: 'حَدَّثَنَا عَبْدُ اللَّهِ بْنُ يُوسُفَ قَالَ أَخْبَرَنَا مَالِكٌ عَنْ هِشَامِ بْنِ عُرْوَةَ عَنْ أَبِيهِ عَنْ عَائِشَةَ أُمِّ الْمُؤْمِنِينَ رَضِيَ اللَّهُ عَنْهَا أَنَّ الْحَارِثَ بْنَ هِشَامٍ رَضِيَ اللَّهُ عَنْهُ سَأَلَ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ فَقَالَ يَا رَسُولَ اللَّهِ كَيْفَ يَأْتِيكَ الْوَحْيُ',
        englishText: 'Al-Harith bin Hisham asked Allah\'s Messenger (ﷺ) "O Allah\'s Messenger! How is the Divine Inspiration revealed to you?"',
        narrator: 'Aisha',
        grade: HadithGrade.SAHIH,
        gradeSource: 'Bukhari',
        reference: 'Sahih al-Bukhari 2',
      },
    ],
  },
  {
    collectionSlug: 'muslim',
    bookName: 'Faith',
    bookNameArabic: 'كتاب الإيمان',
    bookNumber: 1,
    hadiths: [
      {
        hadithNumber: 1,
        arabicText: 'حَدَّثَنِي أَبُو خَيْثَمَةَ زُهَيْرُ بْنُ حَرْبٍ حَدَّثَنَا وَكِيعٌ عَنْ كَهْمَسٍ عَنْ عَبْدِ اللَّهِ بْنِ بُرَيْدَةَ عَنْ يَحْيَى بْنِ يَعْمَرَ قَالَ كَانَ أَوَّلَ مَنْ قَالَ فِي الْقَدَرِ بِالْبَصْرَةِ مَعْبَدٌ الْجُهَنِيُّ',
        englishText: 'Yahya b. Ya\'mur said: The first man who discussed Qadr (Divine Decree) in Basra was Ma\'bad al-Juhani.',
        narrator: 'Yahya ibn Ya\'mur',
        grade: HadithGrade.SAHIH,
        gradeSource: 'Muslim',
        reference: 'Sahih Muslim 1a',
      },
    ],
  },
];

/**
 * Main seed function
 */
async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@noorulilm.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
      role: UserRole.ADMIN,
    },
  });

  console.log(`✅ Admin user created: ${adminUser.email}`);

  // Create hadith collections
  console.log('\n📚 Creating hadith collections...');
  
  for (const collectionData of hadithCollections) {
    const collection = await prisma.hadithCollection.upsert({
      where: { slug: collectionData.slug },
      update: collectionData,
      create: collectionData,
    });
    console.log(`   ✓ ${collection.name}`);
  }

  // Create sample hadiths
  console.log('\n📖 Creating sample hadiths...');

  for (const sampleData of sampleHadiths) {
    const collection = await prisma.hadithCollection.findUnique({
      where: { slug: sampleData.collectionSlug },
    });

    if (!collection) continue;

    // Create or get the book
    const book = await prisma.hadithBook.upsert({
      where: {
        collectionId_bookNumber: {
          collectionId: collection.id,
          bookNumber: sampleData.bookNumber,
        },
      },
      update: {
        name: sampleData.bookName,
        nameArabic: sampleData.bookNameArabic,
      },
      create: {
        name: sampleData.bookName,
        nameArabic: sampleData.bookNameArabic,
        bookNumber: sampleData.bookNumber,
        collectionId: collection.id,
        totalHadiths: sampleData.hadiths.length,
      },
    });

    // Create hadiths
    for (const hadithData of sampleData.hadiths) {
      await prisma.hadith.upsert({
        where: {
          collectionId_hadithNumber: {
            collectionId: collection.id,
            hadithNumber: hadithData.hadithNumber,
          },
        },
        update: {
          arabicText: hadithData.arabicText,
          englishText: hadithData.englishText,
          primaryNarrator: hadithData.narrator,
          grade: hadithData.grade,
          gradedBy: hadithData.gradeSource,
          reference: hadithData.reference,
        },
        create: {
          collectionId: collection.id,
          bookId: book.id,
          hadithNumber: hadithData.hadithNumber,
          arabicText: hadithData.arabicText,
          englishText: hadithData.englishText,
          primaryNarrator: hadithData.narrator,
          grade: hadithData.grade,
          gradedBy: hadithData.gradeSource,
          reference: hadithData.reference,
        },
      });
    }

    console.log(`   ✓ ${sampleData.bookName} (${sampleData.hadiths.length} hadiths)`);
  }

  console.log('\n✨ Database seeding completed successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
