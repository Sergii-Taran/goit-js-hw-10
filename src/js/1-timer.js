import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'flatpickr/dist/flatpickr.min.css';

// Ініціалізація змінних
let userSelectedDate = null;
let timerInterval = null;
const startButton = document.getElementById('start-btn');
const datetimePicker = document.getElementById('datetime-picker');
const timerFields = document.querySelectorAll('.value');

// Функція для додавання ведучого нуля
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція для конвертації мілісекунд в дні, години, хвилини, секунди
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для оновлення інтерфейсу
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  timerFields[0].textContent = addLeadingZero(days);
  timerFields[1].textContent = addLeadingZero(hours);
  timerFields[2].textContent = addLeadingZero(minutes);
  timerFields[3].textContent = addLeadingZero(seconds);
}

// Ініціалізація flatpickr
flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= new Date()) {
      iziToast.error({
        title: 'Помилка',
        message: 'Please choose a date in the future',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
});

// Обробка натискання на кнопку "Start"
startButton.addEventListener('click', () => {
  startButton.disabled = true;
  datetimePicker.disabled = true;

  const targetDate = userSelectedDate;

  // Запуск зворотного відліку
  timerInterval = setInterval(() => {
    const currentTime = new Date();
    const timeLeft = targetDate - currentTime;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      iziToast.success({
        title: 'Таймер завершено',
        message: 'Час вийшов!',
      });
      startButton.disabled = true;
      datetimePicker.disabled = false;
    } else {
      const time = convertMs(timeLeft);
      updateTimerDisplay(time);
    }
  }, 1000);
});
