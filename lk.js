document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");
  const workoutForm = document.getElementById("workout-form");
  const workoutName = document.getElementById("workout-name");
  const workoutTime = document.getElementById("workout-time");
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

  // Проверка авторизации
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
  }

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

  const saveUserData = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
  };

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

  // Настройки: Переключение темы
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
  });

  // Настройки: Сброс данных
  resetDataButton.addEventListener("click", () => {
    if (confirm("Вы уверены, что хотите сбросить все данные?")) {
      localStorage.clear();
      window.location.reload();
    }
  });

  // Загрузка тренировок из localStorage
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];

  // Сохранение тренировок в localStorage
  const saveWorkouts = () => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  };

  // Расчет общего времени
  const calculateTotalTime = (steps) => {
    let totalMinutes = 0;
    steps.forEach((step) => {
      const [hours, minutes] = step.time.split(":").map(Number);
      totalMinutes += hours * 60 + minutes;
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  // Обновление статистики
  const updateStats = () => {
    const totalWorkouts = workouts.length;
    const totalTimeMinutes = workouts.reduce(
      (acc, workout) => acc + calculateTotalTime(workout.steps || []),
      0
    );
    const totalTime = `${Math.floor(totalTimeMinutes / 60)
      .toString()
      .padStart(2, "0")}:${(totalTimeMinutes % 60).toString().padStart(2, "0")}`;
    const completedSteps = workouts.reduce((acc, workout) => acc + (workout.steps?.length || 0), 0);

    document.getElementById("total-workouts").textContent = totalWorkouts;
    document.getElementById("total-time").textContent = totalTime;
    document.getElementById("completed-steps").textContent = completedSteps;
  };

  // Генерация календаря
  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarContainer.innerHTML = "";

    // Пустые дни до начала месяца
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("calendar-day");
      calendarContainer.appendChild(emptyCell);
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("calendar-day");
      dayElement.innerHTML = `<span class="day-number">${day}</span>`;
      calendarContainer.appendChild(dayElement);

      // Клик для выбора дня
      dayElement.addEventListener("click", () => {
        document.querySelectorAll(".calendar-day").forEach((el) => el.classList.remove("selected"));
        dayElement.classList.add("selected");
        showWorkoutsForDate(year, month, day);
      });
    }
  };

  // Показать тренировки для выбранной даты
  const showWorkoutsForDate = (year, month, day) => {
    const selectedDate = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const workoutsForDate = workouts.filter((workout) => workout.date === selectedDate);

    alert(`Тренировки на ${selectedDate}: ${workoutsForDate.map((w) => w.name).join(", ") || "нет тренировок"}`);
  };

  // Добавление тренировок с датой
  workoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const workoutName = workoutName.value;
    const workoutDate = document.getElementById("workout-date").value;

    workouts.push({ name: workoutName, date: workoutDate, favorite: false, steps: [] });
    saveWorkouts();
    renderWorkouts();
    generateCalendar(new Date().getFullYear(), new Date().getMonth());
  });

  

  // Удаление тренировки
  workoutList.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const index = e.target.dataset.index;
      workouts.splice(index, 1);
      saveWorkouts();
      renderWorkouts();
    }
  });

  // Редактирование времени и названия
  // Редактирование времени, даты и названия
workoutList.addEventListener("input", (e) => {
  const index = e.target.dataset.index;
  if (e.target.classList.contains("edit-time")) {
    workouts[index].time = e.target.value;
  } else if (e.target.classList.contains("edit-date")) {
    workouts[index].date = e.target.value;
  } else if (e.target.classList.contains("editable")) {
    workouts[index].name = e.target.innerText.trim();
  }
  saveWorkouts();
  updateStats();
});

// Избранное
workoutList.addEventListener("click", (e) => {
  if (e.target.classList.contains("favorite-icon")) {
    const index = e.target.dataset.index;
    workouts[index].favorite = !workouts[index].favorite;

    // Обновляем иконку мгновенно
    e.target.textContent = workouts[index].favorite ? "⭐" : "☆";

    // Сортируем массив
    workouts.sort((a, b) => b.favorite - a.favorite);

    // Перемещаем элемент вверх
    const workoutItem = e.target.closest("li");
    workoutList.removeChild(workoutItem);
    workoutList.insertBefore(workoutItem, workoutList.firstChild);

    saveWorkouts(); // Сохраняем изменения
  }
});




  // Логика выхода
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
  });

  // Инициализация
  const now = new Date();
  loadUserData();
  renderWorkouts();
  generateCalendar(now.getFullYear(), now.getMonth());
});


// lk.js
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");
  const workoutForm = document.getElementById("workout-form");
  const workoutNameInput = document.getElementById("workout-name");
  const workoutTimeInput = document.getElementById("workout-time");
  const workoutDateInput = document.getElementById("workout-date");
  const workoutList = document.getElementById("workout-list");
  const calendarContainer = document.getElementById("calendar-container");

  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];

  const saveWorkouts = () => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  };

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

  const renderWorkouts = () => {
    workoutList.innerHTML = "";
    workouts.sort((a, b) => b.favorite - a.favorite); // Сортировка по избранному
  
    workouts.forEach((workout, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="workout-header">
          <h3 contenteditable="true" class="editable">${workout.name}</h3>
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

  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    calendarContainer.innerHTML = "";

    // Пустые дни до начала месяца
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("calendar-day");
      calendarContainer.appendChild(emptyCell);
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("calendar-day");
      const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      dayElement.innerHTML = `<span class="day-number">${day}</span>`;

      // Подсветка дней с тренировками
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

  const now = new Date();
  const loadCalendar = () => {
    generateCalendar(now.getFullYear(), now.getMonth());
  };

  workoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const workoutName = workoutNameInput.value;
    const workoutTime = workoutTimeInput.value;
    const workoutDate = workoutDateInput.value;

    if (workoutName && workoutTime && workoutDate) {
      workouts.push({ name: workoutName, time: workoutTime, date: workoutDate });
      saveWorkouts();
      renderWorkouts();
      loadCalendar();
      workoutForm.reset();
    }
  });

  workoutList.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const index = e.target.dataset.index;
      workouts.splice(index, 1);
      saveWorkouts();
      renderWorkouts();
      loadCalendar();
    }
  });

  renderWorkouts();
  loadCalendar();
});
