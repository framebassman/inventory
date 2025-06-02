import inventoryLogo from "./assets/inventory-circles-in-square.png";
import iosStep1 from "./assets/ios_1.png";
import iosStep2 from "./assets/ios_2.png";
import iosStep3 from "./assets/ios_3.png";
import androidStep1 from "./assets/android_1.png";
import androidStep2 from "./assets/android_2.png";
import androidStep3 from "./assets/android_3.png";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <a href="https://inventory.romashov.tech" target="_blank">
          <img src={inventoryLogo} className="logo" alt="Inventory logo" />
        </a>
      </div>
      <h1>
        <span>Инвéнтори</span>
        <span> — </span>
        <span>решения для складских помещений</span>
      </h1>
      <div className="card">
        С помощью гугл таблиц поможем отследить, куда какой ящик уехал.
      </div>
      <h2>Инструкция для iOS</h2>
      <div className="slider">
        <div className="step">
          <img src={iosStep1} className="step-icon" alt="Inventory logo" />
          <div>
            <h3>Шаг 1</h3>
            <p>
              Зайдите в Safari на avito.ru и нажмите на значок «Поделиться»
              внизу экрана.
            </p>
          </div>
        </div>

        <div className="step">
          <img src={iosStep2} className="step-icon" alt="Inventory logo" />
          <div>
            <h3>Шаг 2</h3>
            <p>
              Во всплывающем окне открутите вниз и выберите «На экран „Домой“».
            </p>
          </div>
        </div>

        <div className="step">
          <img src={iosStep3} className="step-icon" alt="Inventory logo" />
          <div>
            <h3>Шаг 3</h3>
            <p>
              Нажмите «Добавить» — значок сайта появится рядом с другими
              приложениями.
            </p>
          </div>
        </div>
      </div>
      <h2>Инструкция для Android</h2>
      <div className="slider">
        <div className="step">
          <img src={androidStep1} className="step-icon" alt="Inventory logo" />
          <div>
            <h3>Шаг 1</h3>
            <p>
              Наведите камеру телефона на QR-код или скачайте файл по ссылке.
            </p>
            <p>
              Если увидите уведомление безопасности, нажмите «Всё равно скачать»
              — приложение надежное и безопасное.
            </p>
          </div>
        </div>

        <div className="step">
          <img src={androidStep2} className="step-icon" alt="Inventory logo" />
          <div>
            <h3>Шаг 2</h3>
            <p>
              После скачивания найдите файл в загрузках и начните установку.
            </p>
          </div>
        </div>

        <div className="step">
          <img src={androidStep3} className="step-icon" alt="Inventory logo" />
          <div>
            <h3>Шаг 3</h3>
            <p>После установки приложение появится на экране смартфона.</p>
          </div>
        </div>
      </div>
      <p className="read-the-docs">
        Инвентори — часть продуктов компании Kolenka Inc.
      </p>
    </>
  );
}

export default App;
