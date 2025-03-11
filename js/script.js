const swiperContainer = document.querySelector('.card-list');

// Função para buscar os dados da API
async function fetchMeals() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();

    if (data.meals) {
      displayMeals(data.meals);
    } else {
      console.error("Nenhum prato encontrado na API.");
    }
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
  }
}

// Função para exibir os pratos no slider
function displayMeals(meals) {
  swiperContainer.innerHTML = ''; // Limpa o conteúdo atual

  meals.forEach(meal => {
    const cardItem = document.createElement('div');
    cardItem.classList.add('card-item', 'swiper-slide');

    // Adiciona o atributo data-id para identificar os pratos
    cardItem.setAttribute('data-id', meal.idMeal);

    cardItem.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="cat-image">
      <h3 class="h3-style">${meal.strMeal}</h3>
      <button class="message-button">Favoritar?</button>
    `;

    swiperContainer.appendChild(cardItem);
  });

  // Atualiza o Swiper para reconhecer os novos elementos
  swiper.update();
}

let favoriteMeals = []; // Lista para armazenar favoritos

// Função para adicionar um prato aos favoritos
function addToFavorites(mealId) {
  if (!favoriteMeals.includes(mealId)) {
    favoriteMeals.push(mealId);
    console.log(`Prato com ID ${mealId} adicionado aos favoritos!`);
    alert(`Prato com ID ${mealId} foi favoritado!`);
    updateFavorites(); // Atualiza a lista de favoritos
  } else {
    console.log("O prato já está nos favoritos.");
  }
}

// Função para remover um prato dos favoritos
function removeFromFavorites(mealId) {
  favoriteMeals = favoriteMeals.filter(id => id !== mealId);
  console.log(`Prato com ID ${mealId} removido dos favoritos!`);
  alert(`Prato com ID ${mealId} foi removido dos favoritos!`);
  updateFavorites(); // Atualiza a lista de favoritos
}

// Adiciona eventos para os botões (Favoritar ou Remover)
swiperContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('message-button')) {
    const mealId = e.target.closest('.card-item').getAttribute('data-id');
    if (!favoriteMeals.includes(mealId)) {
      addToFavorites(mealId);
    } else {
      removeFromFavorites(mealId);
    }
  }
});

const favoritesContainer = document.querySelector('.favorites-list');

// Função para exibir os favoritos
async function updateFavorites() {
  favoritesContainer.innerHTML = ''; // Limpa os favoritos atuais

  for (const mealId of favoriteMeals) {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const data = await response.json();

      if (data.meals) {
        const meal = data.meals[0];

        const favoriteItem = document.createElement('div');
        favoriteItem.classList.add('favorite-item');

        favoriteItem.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
          <button onclick="removeFromFavorites('${meal.idMeal}')">Remover</button>
        `;

        favoritesContainer.appendChild(favoriteItem);
      }
    } catch (error) {
      console.error("Erro ao buscar prato favorito:", error);
    }
  }
}

// Configuração do Swiper
const swiper = new Swiper('.slider-wrapper', {
  loop: true,
  grabCursor: true,
  spaceBetween: 30,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  breakpoints: {
    0: {
      slidesPerView: 1
    },
    620: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 3
    }
  }
});

// Chama a função para buscar e exibir os pratos
fetchMeals();
