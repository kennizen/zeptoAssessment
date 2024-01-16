import { ChipType } from "./ChipAutocomplete";
import CloseIcon from "../../assets/icons/close.svg";

interface IProps {
  data: ChipType;
  onDelete: (id: string) => void;
}

const Chip = ({ data, onDelete }: IProps) => {
  // methods
  function handleOnClick() {
    onDelete(data.id);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        borderRadius: "15px",
        backgroundColor: "lightgrey",
        paddingRight: "0.5rem",
        border: data.highlight ? "2px solid blue" : "none",
      }}
    >
      <img
        src={data.avatar}
        alt="avatar"
        width={30}
        height={30}
        style={{
          borderRadius: "50%",
        }}
      />
      <p style={{ whiteSpace: "nowrap" }}>{data.name}</p>
      <button
        onClick={handleOnClick}
        style={{
          background: "none",
          color: "inherit",
          border: "none",
          padding: 0,
          font: "inherit",
          cursor: "pointer",
          outline: "inherit",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img src={CloseIcon} alt="close" width={16} height={16} id="chip" />
      </button>
    </div>
  );
};

export default Chip;
