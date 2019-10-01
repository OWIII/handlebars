let button = document.getElementById('button');
let block = document.querySelector('.content');
let headerInfo = document.querySelector('.header-info');

VK.init({
  apiId: 7154746
});

function auth() {
  return new Promise((resolve, reject) => {
    VK.Auth.login(data => {
      if (data.session) {
        resolve();
      } else {
        reject(new Error('Не удалось авторизоваться'));
      }
    }, 2);
  });
}

function callAPI(method, params) {
  params.v = '5.101';

  return new Promise((resolve, reject) => {
    VK.api(method, params, (data) => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.response);
      }
    })
  })
}

(async () => {
  try {
    await auth();
    const [user] = await callAPI('users.get', {fields: 'photo_100', name_case: 'gen'});
    const friends = await callAPI('friends.get', {fields: 'city, country, photo_100'});
    const template = document.querySelector('#user-template').innerHTML;

    const render = Handlebars.compile(template);
    const html = render(friends);


    button.addEventListener('click', () => {
      headerInfo.textContent = `Друзья на странице ${user.first_name} ${user.last_name}:`;
      //block.innerHTML = html;
      block.insertAdjacentHTML('beforeend', html);
    });
  } catch (e) {
    console.error(e);
  }
})();




