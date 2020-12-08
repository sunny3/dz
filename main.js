//функция возвращающая случайное число, по которому мы определяем
function getRandomInt() {
  let max = 3;
  let min = 1;
  return Math.floor(Math.random() * (max - min)) + min;
}

async function fetchWithTimeout(resource) {
  //контроллер, помогающий убить долго виснущий фетч промис
  controller = new AbortController();
  timeId = setTimeout(() => controller.abort(), 13000);
  response = await fetch(resource, {
    signal: controller.signal
  });
  //промис выполнился, значит мы можем уже очистить ранее созданный таймер
  clearTimeout(timeId);

  return response;
}

console.log('Берем наугад json файлы');
var score = 0;
var json;
var random;
var url;
for (var i = 0; i < 5; i++){
  random = getRandomInt();
  if (random>1){
    url = 'https://api.github.com/repos/sunny3/dz/contents/empty_box.json';
  } else {
    url = 'https://api.github.com/repos/sunny3/dz/contents/gold_box.json';
  }
  //функция возвращает завершивийся промис, для его обработки используем then/catch
  fetchWithTimeout(url)
   .then(response => response.ok ? response.json() : Promise.reject(response))
   .then(data=>{
     //декодируем json
     json = JSON.parse(atob(data.content));
     //console.log(json.amount);
     score+=json.amount;
   })
   .catch(() => console.log('Connection failed: wrong url adress or network error or too long waiting'));
}

var promise = new Promise((resolve, reject) => {
  console.log('Посмотрим на результат..');
  setTimeout(()=>{ if (score>40){
      resolve('Ура, победа');
    } else {
      reject('О нет, проигрыш');
    }
  }, 2000);
});
promise.then(
  result => console.log(result),
  error => console.log(error)
);
