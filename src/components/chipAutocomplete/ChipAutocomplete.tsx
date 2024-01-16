import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import style from "./style.module.css";
import MenuItem from "./MenuItem";
import Chip from "./Chip";

const MENU_OFFSET = 20;

export type Data = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export type ChipType = {
  highlight: boolean;
} & Data;

interface IProps {
  data: Data[];
  renderChip?: (data: Data) => ReactNode;
}

const ChipAutocomplete = ({ data, renderChip }: IProps) => {
  // states
  const [chips, setChips] = useState<ChipType[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [filteredRes, setFilteredRes] = useState<Array<Data>>([]);
  const [value, setValue] = useState("");

  // hooks
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  // methods

  // --------------------------------------------------------------------------------- //
  function handlePositionMenu() {
    if (!menuRef || !menuRef.current) return;
    if (!inputRef || !inputRef.current) return;

    const { left, top } = inputRef.current.getBoundingClientRect();
    inputRef.current.focus();

    menuRef.current.style.top = `${top + MENU_OFFSET}px`;
    menuRef.current.style.left = `${left}px`;

    resetFilteredArr();
  }

  // --------------------------------------------------------------------------------- //

  function handleOnInputBlur() {
    console.log("calling blur");

    setShowMenu(false);
    setValue("");
  }

  // --------------------------------------------------------------------------------- //

  function handleOnInputChange(e: ChangeEvent<HTMLInputElement>) {
    const val = (e.target as HTMLInputElement).value;
    setValue(val);

    if (val.trim() === "") {
      resetFilteredArr();
      return;
    }

    const tmp = new Set<string>();

    chips.forEach((chip) => tmp.add(chip.id));

    const filteredArr = [] as Data[];
    data.forEach((data) => {
      if (data.name.toLowerCase().indexOf(val) > -1 && !tmp.has(data.id)) {
        filteredArr.push(data);
      }
    });

    setFilteredRes(filteredArr);
  }

  // --------------------------------------------------------------------------------- //

  function resetFilteredArr() {
    const tmp = new Set<string>();

    chips.forEach((chip) => tmp.add(chip.id));

    const filteredArr = [] as Data[];
    data.forEach((data) => {
      if (!tmp.has(data.id)) filteredArr.push(data);
    });
    setFilteredRes(filteredArr);
  }

  // --------------------------------------------------------------------------------- //

  function handleOnSelect(id: string) {
    const ele = data.find((data) => data.id === id);

    if (!ele) return;
    const filteredArr = filteredRes.filter((items) => items.id !== ele?.id);

    setChips((prev) => [...prev, { ...ele, highlight: false }]);
    setFilteredRes(filteredArr);
    setValue("");
  }

  // --------------------------------------------------------------------------------- //

  function handleOnDelete(id: string) {
    const tmpChips = structuredClone(chips);
    const tmpFilteredArr = structuredClone(filteredRes);
    const index = tmpChips.findIndex((chip: ChipType) => chip.id === id);

    if (index === -1) return;

    tmpFilteredArr.push({
      id: tmpChips[index].id,
      name: tmpChips[index].name,
      avatar: tmpChips[index].avatar,
      email: tmpChips[index].email,
    });

    tmpChips.splice(index, 1);

    setFilteredRes(tmpFilteredArr);
    setChips(tmpChips);
  }

  // --------------------------------------------------------------------------------- //

  function handleClickAwayListener(e: globalThis.MouseEvent) {
    const div = document.getElementById("autocomplete");
    const node = e.target as HTMLElement;
    if (!div) return;
    if (node.id === "chip") return;
    if (!div.contains(node)) {
      handleOnInputBlur();
    }
  }

  // --------------------------------------------------------------------------------- //

  function handleKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Backspace") return;
    if (chips.length <= 0) return;

    const tmpChips = structuredClone(chips);
    const chip = tmpChips[tmpChips.length - 1];
    const tmpFilArr = structuredClone(filteredRes);

    if (value !== "") return;

    if (chip.highlight) {
      const chip = tmpChips.pop()!;
      tmpFilArr.push({
        id: chip.id,
        name: chip.name,
        avatar: chip.avatar,
        email: chip.email,
      });
    } else chip.highlight = true;

    setChips(tmpChips);
  }

  // --------------------------------------------------------------------------------- //

  // lifecycles
  useEffect(() => {
    resetFilteredArr();
    document.addEventListener("click", handleClickAwayListener);
    return () => {
      document.removeEventListener("click", handleClickAwayListener);
    };
  }, []);

  useLayoutEffect(() => {
    if (!showMenu) return;
    handlePositionMenu();
  }, [showMenu, chips]);

  return (
    <>
      <div id="autocomplete" className={style["autocomplete"]}>
        {chips.map((chip) => (
          <Chip key={chip.id} data={chip} onDelete={handleOnDelete} />
        ))}
        <input
          type="text"
          ref={inputRef}
          value={value}
          placeholder="Add new user..."
          autoComplete="off"
          onChange={handleOnInputChange}
          onFocus={(e) => setShowMenu(true)}
          onKeyUp={handleKeyUp}
        />
      </div>
      {showMenu && (
        <ul ref={menuRef} className={style["menu"]}>
          {filteredRes.map((res) => (
            <MenuItem key={res.id} data={res} onSelect={handleOnSelect} />
          ))}
        </ul>
      )}
    </>
  );
};

export default ChipAutocomplete;
