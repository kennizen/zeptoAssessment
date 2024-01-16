import ChipAutocomplete from "./components/chipAutocomplete/ChipAutocomplete";
import data from "./data/data.json";
import style from "./style.module.css";

function App() {
  return (
    <div className={style["container"]}>
      <h2 className={style["header"]}>Pick Users</h2>
      <ChipAutocomplete data={data.data} />
    </div>
  );
}

export default App;
