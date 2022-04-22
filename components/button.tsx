import { cls } from "@libs/client/cls";

interface ButtonProps {
  lgScreen: boolean;
  text?: string;
  loading?: boolean;
  onClick?: () => void;
}

export default function Button({
  lgScreen,
  text,
  loading,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cls(
        lgScreen ? "lg:w-2/4" : "",
        "w-full py-1 bg-orange-400 hover:bg-orange-600  text-white  rounded-xl  uppercase shadow-sm focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 hover:transition-all"
      )}
    >
      {loading ? "Loading" : text}
    </button>
  );
}
