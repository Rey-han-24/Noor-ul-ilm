// Test hadithapi.com hadiths endpoint
const apiKey = '$2y$10$UFUEwfUyf3EYVlibXgsk9eo0wXxW5LKg3hBeiftCaCI5Y1R2QVUS';

async function testAPI() {
  // Test 1: Get books
  console.log('=== Test 1: Get Books ===');
  const booksUrl = `https://hadithapi.com/api/books?apiKey=${apiKey}`;
  console.log('URL:', booksUrl);
  
  try {
    const booksRes = await fetch(booksUrl);
    const booksData = await booksRes.json();
    console.log('Books status:', booksRes.status);
    console.log('Books count:', booksData.books?.length || 0);
    if (booksData.books?.[0]) {
      console.log('First book:', booksData.books[0].bookName, booksData.books[0].bookSlug);
    }
  } catch (e) {
    console.log('Books error:', e.message);
  }
  
  // Test 2: Get chapters for sahih-bukhari
  console.log('\n=== Test 2: Get Chapters ===');
  const chaptersUrl = `https://hadithapi.com/api/sahih-bukhari/chapters?apiKey=${apiKey}`;
  console.log('URL:', chaptersUrl);
  
  try {
    const chaptersRes = await fetch(chaptersUrl);
    const chaptersData = await chaptersRes.json();
    console.log('Chapters status:', chaptersRes.status);
    console.log('Chapters count:', chaptersData.chapters?.length || 0);
    if (chaptersData.chapters?.[0]) {
      console.log('First chapter:', chaptersData.chapters[0].chapterEnglish);
    }
  } catch (e) {
    console.log('Chapters error:', e.message);
  }
  
  // Test 3: Get hadiths from chapter 1
  console.log('\n=== Test 3: Get Hadiths ===');
  const hadithsUrl = `https://hadithapi.com/api/hadiths?apiKey=${apiKey}&book=sahih-bukhari&chapter=1&paginate=5`;
  console.log('URL:', hadithsUrl);
  
  try {
    const hadithsRes = await fetch(hadithsUrl);
    const hadithsData = await hadithsRes.json();
    console.log('Hadiths status:', hadithsRes.status);
    console.log('Total hadiths:', hadithsData.hadiths?.total || 0);
    console.log('Current page:', hadithsData.hadiths?.current_page || 0);
    console.log('Hadiths in page:', hadithsData.hadiths?.data?.length || 0);
    if (hadithsData.hadiths?.data?.[0]) {
      const h = hadithsData.hadiths.data[0];
      console.log('First hadith number:', h.hadithNumber);
      console.log('First hadith text (truncated):', (h.hadithEnglish || '').substring(0, 100) + '...');
    }
  } catch (e) {
    console.log('Hadiths error:', e.message);
  }
}

testAPI();
