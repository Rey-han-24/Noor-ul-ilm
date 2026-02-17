// Test hadithapi.com API
const apiKey = '$2y$10$UFUEwfUyf3EYVlibXgsk9eo0wXxW5LKg3hBeiftCaCI5Y1R2QVUS';
const apiUrl = `https://hadithapi.com/api/books?apiKey=${apiKey}`;

console.log('Testing URL:', apiUrl);

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log('Success! Books count:', data.books?.length);
    if (data.books?.length > 0) {
      console.log('First book:', data.books[0].bookName);
    }
  })
  .catch(error => {
    console.log('Error:', error.message);
  });
