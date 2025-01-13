// Перевіряємо, чи URL відповідає потрібному
if (window.location.hostname === "neo.bullx.io") {
  // Функція для отримання ID монети з атрибута href
  function getCoinId(card) {
    const link = card.querySelector('a[href]');
    if (!link) return null; // Якщо немає посилання, повертаємо null
    const href = link.getAttribute('href');
    const idMatch = href.match(/address=([a-zA-Z0-9]+)/); // Шукаємо ID після "address="
    return idMatch ? idMatch[1] : null;
  }

  // Функція для додавання текстового поля та кнопок у картку
  function addInputField(card) {
    // Перевіряємо, чи текстове поле вже додано
    if (card.querySelector('.custom-input-container')) return;

    // Отримуємо ID монети
    const coinId = getCoinId(card);
    if (!coinId) {
      console.warn('ID монети не знайдено для картки:', card);
      return;
    }

    // Встановлюємо position: relative для батьківського елемента
    card.style.position = 'relative';

    // Створюємо контейнер для всього блоку
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('custom-input-container'); // Додаємо клас для унікальної ідентифікації
    inputContainer.style.position = 'absolute';
    inputContainer.style.top = '10px';
    inputContainer.style.right = '10px';
    inputContainer.style.backgroundColor = 'rgba(128, 128, 128, 0.6)'; // Сірий напівпрозорий фон
    inputContainer.style.border = 'none';
    inputContainer.style.padding = '5px';
    inputContainer.style.borderRadius = '5px';
    inputContainer.style.zIndex = '1000';
    inputContainer.style.display = 'flex';
    inputContainer.style.alignItems = 'center';
    inputContainer.style.gap = '5px';

    // Створюємо кнопку "палець вгору"
    const thumbsUp = document.createElement('span');
    thumbsUp.textContent = '👍';
    thumbsUp.style.cursor = 'pointer';
    thumbsUp.style.color = 'gray';

    // Створюємо кнопку "палець вниз"
    const thumbsDown = document.createElement('span');
    thumbsDown.textContent = '👎';
    thumbsDown.style.cursor = 'pointer';
    thumbsDown.style.color = 'gray';

    // Створюємо текстове поле
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Note...';
    inputField.style.width = '100px';

    // Завантаження збережених даних з localStorage
    const savedText = localStorage.getItem(`note-${coinId}`);
    const savedReaction = localStorage.getItem(`reaction-${coinId}`);
    if (savedText) {
      inputField.value = savedText;
    }
    if (savedReaction === 'up') {
      thumbsUp.style.color = 'green';
      inputContainer.style.backgroundColor = 'rgba(0, 128, 0, 0.6)'; // Зелений напівпрозорий фон
    } else if (savedReaction === 'down') {
      thumbsDown.style.color = 'red';
      inputContainer.style.backgroundColor = 'rgba(255, 0, 0, 0.6)'; // Червоний напівпрозорий фон
    }

    // Збереження тексту при зміні
    inputField.addEventListener('input', function () {
      localStorage.setItem(`note-${coinId}`, inputField.value);
    });

    // Обробка натискання на "палець вгору"
    thumbsUp.addEventListener('click', function () {
      localStorage.setItem(`reaction-${coinId}`, 'up');
      thumbsUp.style.color = 'green';
      thumbsDown.style.color = 'gray';
      inputContainer.style.backgroundColor = 'rgba(0, 128, 0, 0.6)'; // Зелений напівпрозорий фон
    });

    // Обробка натискання на "палець вниз"
    thumbsDown.addEventListener('click', function () {
      localStorage.setItem(`reaction-${coinId}`, 'down');
      thumbsDown.style.color = 'red';
      thumbsUp.style.color = 'gray';
      inputContainer.style.backgroundColor = 'rgba(255, 0, 0, 0.6)'; // Червоний напівпрозорий фон
    });

    // Додаємо елементи до контейнера
    inputContainer.appendChild(thumbsUp);
    inputContainer.appendChild(thumbsDown);
    inputContainer.appendChild(inputField);

    // Додаємо контейнер до картки
    card.appendChild(inputContainer);
  }

  // Функція для ініціалізації всіх існуючих карток
  function initializeCards() {
    const cards = document.querySelectorAll('.pump-card');
    cards.forEach(addInputField);
  }

  // Використовуємо MutationObserver для відстеження нових карток
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.classList && node.classList.contains('pump-card')) {
            addInputField(node);
          } else if (node.querySelectorAll) {
            // Якщо картка знаходиться всередині іншого доданого вузла
            const nestedCards = node.querySelectorAll('.pump-card');
            nestedCards.forEach(addInputField);
          }
        });
      }
    });

    // Перевірка на пропущені картки
    initializeCards();
  });

  // Налаштування для MutationObserver
  observer.observe(document.body, {
    childList: true, // Відстежуємо додавання/видалення елементів
    subtree: true, // Відстежуємо зміни у всіх дочірніх елементах
  });

  // Ініціалізуємо текстові поля для вже існуючих карток
  initializeCards();
}
