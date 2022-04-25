import { cls } from "@libs/client/cls";

interface ButtonProps {
  text?: string;
  loading?: boolean;
  onClick?: () => void;
  addStyle?: string;
}

export default function Button({
  text,
  loading,
  onClick,
  addStyle,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "w-full py-1 bg-orange-400 hover:bg-orange-600  text-white  rounded-xl uppercase shadow-sm focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 hover:transition-all",
        addStyle ? addStyle : ""
      )}
    >
      {loading ? "Loading" : text}
    </button>
  );
}
