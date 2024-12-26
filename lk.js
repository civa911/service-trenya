document.addEventListener("DOMContentLoaded", () => {
  // DOM элементы
  const logoutButton = document.getElementById("logout-button");
  const workoutForm = document.getElementById("workout-form");
  const workoutName = document.getElementById("workout-name");
  const workoutTime = document.getElementById("workout-time");
  const workoutDate = document.getElementById("workout-date");
  const workoutList = document.getElementById("workout-list");
  const editUserButton = document.getElementById("edit-user-button");
  const userNameElement = document.getElementById("user-name");
  const userEmailElement = document.getElementById("user-email");
  const editModal = document.getElementById("edit-modal");
  const editUserForm = document.getElementById("edit-user-form");
  const editNameInput = document.getElementById("edit-name");
  const editEmailInput = document.getElementById("edit-email");
  const closeModalButton = document.getElementById("close-modal");
  const themeToggle = document.getElementById("theme-toggle");
  const resetDataButton = document.getElementById("reset-data");
  const calendarContainer = document.getElementById("calendar-container");

  // Данные тренировок
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];

  // Сохранение данных
  const saveWorkouts = () => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  };

  const saveUserData = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
  };

  // Загрузка данных пользователя
  const loadUserData = () => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {
      name: "Пользователь",
      email: "user@example.com",
    };
    userNameElement.textContent = userData.name;
    userEmailElement.textContent = userData.email;
    return userData;
  };

  // Обновление статистики
  const updateStats = () => {
    const totalWorkouts = workouts.length;
    const totalTimeMinutes = workouts.reduce((acc, workout) => {
      const [hours, minutes] = workout.time.split(":").map(Number);
      return acc + hours * 60 + minutes;
    }, 0);
    const hours = Math.floor(totalTimeMinutes / 60).toString().padStart(2, "0");
    const minutes = (totalTimeMinutes % 60).toString().padStart(2, "0");
    document.getElementById("total-workouts").textContent = totalWorkouts;
    document.getElementById("total-time").textContent = `${hours}:${minutes}`;
  };

  // Рендер списка тренировок
  const renderWorkouts = () => {
    workoutList.innerHTML = "";
    workouts.sort((a, b) => b.favorite - a.favorite);

    workouts.forEach((workout, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="workout-header">
          <h3 contenteditable="true" class="editable" data-index="${index}">${workout.name}</h3>
          <span class="favorite-icon" data-index="${index}">${workout.favorite ? "⭐" : "☆"}</span>
        </div>
        <p>Время: <input type="time" class="edit-time" data-index="${index}" value="${workout.time}"></p>
        <p>Дата: <input type="date" class="edit-date" data-index="${index}" value="${workout.date}"></p>
        <button class="btn btn-delete" data-index="${index}">Удалить</button>
      `;
      workoutList.appendChild(li);
    });
    updateStats();
  };

  // Обновление избранного
  const updateFavoriteStatus = (index) => {
    workouts[index].favorite = !workouts[index].favorite;
    saveWorkouts();
    renderWorkouts();
  };

  // Генерация календаря
  // Функция генерации календаря
const generateCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarContainer.innerHTML = ""; // Очищаем старый календарь

  // Добавляем пустые дни до первого дня месяца
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("calendar-day");
    calendarContainer.appendChild(emptyCell);
  }

  // Заполняем дни месяца
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("calendar-day");
    const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    dayElement.innerHTML = `<span class="day-number">${day}</span>`;

    // Подсветка тренировок
    if (workouts.some((workout) => workout.date === dateStr)) {
      dayElement.classList.add("highlight");
    }

    dayElement.addEventListener("click", () => {
      alert(
        `Тренировки на ${dateStr}: ${
          workouts
            .filter((workout) => workout.date === dateStr)
            .map((w) => w.name)
            .join(", ") || "нет тренировок"
        }`
      );
    });

    calendarContainer.appendChild(dayElement);
  }
};

// Вызываем генерацию календаря
const now = new Date();
generateCalendar(now.getFullYear(), now.getMonth());

  // События списка тренировок
  workoutList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    // Обработка избранного
    if (e.target.classList.contains("favorite-icon")) {
      updateFavoriteStatus(index);
    }

    // Удаление тренировки
    if (e.target.classList.contains("btn-delete")) {
      workouts.splice(index, 1);
      saveWorkouts();
      renderWorkouts();
    }
  });

  workoutList.addEventListener("input", (e) => {
    const index = e.target.dataset.index;

    // Редактирование времени
    if (e.target.classList.contains("edit-time")) {
      workouts[index].time = e.target.value;
    }

    // Редактирование даты
    if (e.target.classList.contains("edit-date")) {
      workouts[index].date = e.target.value;
    }

    // Редактирование имени
    if (e.target.classList.contains("editable")) {
      workouts[index].name = e.target.textContent.trim();
    }

    saveWorkouts();
  });

  // Добавление новой тренировки
  workoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = workoutName.value.trim();
    const time = workoutTime.value;
    const date = workoutDate.value;

    if (name && time && date) {
      workouts.push({
        name,
        time,
        date,
        favorite: false,
      });
      saveWorkouts();
      renderWorkouts();
      workoutForm.reset();
    }
  });

  // Редактирование данных пользователя
  editUserButton.addEventListener("click", () => {
    const userData = loadUserData();
    editNameInput.value = userData.name;
    editEmailInput.value = userData.email;
    editModal.classList.remove("hidden");
  });

  editUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const updatedUserData = {
      name: editNameInput.value,
      email: editEmailInput.value,
    };
    saveUserData(updatedUserData);
    loadUserData();
    editModal.classList.add("hidden");
  });

  closeModalButton.addEventListener("click", () => {
    editModal.classList.add("hidden");
  });

  // Настройки
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
  });

  resetDataButton.addEventListener("click", () => {
    if (confirm("Вы уверены, что хотите сбросить все данные?")) {
      localStorage.clear();
      window.location.reload();
    }
  });

  // Инициализация
  renderWorkouts();
  loadUserData();
});


