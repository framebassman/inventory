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
          <img src={iosStep1} className="step-icon" alt="IOS step 1" />
          <div>
            <h3>Шаг 1</h3>
            <p>
              Зайдите в Safari на m.inventory.romashov.tech и нажмите на значок «Поделиться»
              внизу экрана.
            </p>
          </div>
        </div>

        <div className="step">
          <img src={iosStep2} className="step-icon" alt="IOS step 2" />
          <div>
            <h3>Шаг 2</h3>
            <p>
              Во всплывающем окне открутите вниз и выберите «На экран „Домой“».
            </p>
          </div>
        </div>

        <div className="step">
          <img src={iosStep3} className="step-icon" alt="IOS step 3" />
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
          <img src={androidStep1} className="step-icon" alt="Android step 1" />
          <div>
            <h3>Шаг 1</h3>
            <p>
              Наведите камеру телефона на QR-код или откройте m.inventory.romashov.tech в Chrome.
            </p>
          </div>
        </div>

        <div className="step">
          <img src={androidStep2} className="step-icon" alt="Android step 2" />
          <div>
            <h3>Шаг 2</h3>
            <p>
              Во всплывающем окне выберете «Установить».
            </p>
          </div>
        </div>

        <div className="step">
          <img src={androidStep3} className="step-icon" alt="Android step 3" />
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
