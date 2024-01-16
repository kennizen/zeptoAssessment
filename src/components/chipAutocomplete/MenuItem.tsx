import { MouseEvent } from "react";
import { Data } from "./ChipAutocomplete";
import styles from "./style.module.css";

interface IProps {
  data: Data;
  onSelect: (id: string) => void;
}

const MenuItem = ({ data, onSelect }: IProps) => {
  // methods
  function handleOnSelect(e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>) {
    e.stopPropagation();
    onSelect(data.id);
  }

  return (
    <li className={styles["menu-item"]} onClick={handleOnSelect}>
      <img
        src={data.avatar}
        alt="avatar"
        width={30}
        height={30}
        style={{
          borderRadius: "50%",
        }}
      />
      <span>{data.name}</span>
      <span>{data.email}</span>
    </li>
  );
};

export default MenuItem;
