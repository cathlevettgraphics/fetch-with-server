/*************************
 *
 * NEWS APP + LOCAL SERVER HOOKUP
 *
 *************************/

// get form
const newsForm = document.forms['news-form'];
// get data from form
newsForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(newsForm);
  const newsData = Object.fromEntries(formData);
  console.log('searching for news about ', newsData);

  const newsDataValue = Object.values(newsData);
  // console.log(newsDataValue);
  fetchNews(newsDataValue);
});

// send data from form to the server
async function fetchNews(newsDataValue) {
  try {
    const response = await fetch('/api/v1/get-news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsDataValue),
    });

    if (response.ok) {
      // pass food we receive from the server to render function
      const news = await response.json();
      console.log('news response is', news);

      console.log({ news });
      renderNewsList(news);
    } else {
      throw new Error(response);
    }
  } catch (err) {
    console.log('error', err.sendMessage || err.statusText);
  }
}

// render the data
const mountNodeNews = document.getElementById('target-news');

// Data passed to this function inside the fetch call
export function renderNewsList(news) {
  if (news.totalArticles === 0) {
    mountNodeNews.innerHTML = 'No news found ... please search again';
  } else {
    const list = document.createElement('ul');
    list.classList.add('news-list');

    // Li for each article
    for (const { title, content, image, url, source } of news.articles) {
      // build the list
      const li = document.createElement('li');
      li.innerHTML = `
          <div class="news-wrapper">
            <h3 class="news-headline">${title}</h3>
            <a href="${url}"><img src="${image}" class="news-image"></a>
            <p class="news-content">${content.slice(0, -12)}</p>
            <a href="${url}" class="news-link">Read the ${
        source.name
      } story here</a>
          </div>
          `;
      list.append(li);
    }
    mountNodeNews.innerHTML = ``;
    mountNodeNews.append(list);
  }
}
