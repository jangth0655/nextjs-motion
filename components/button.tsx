import { cls } from "@libs/client/cls";

interface ButtonProps {
  lgScreen: boolean;
  text: string;
}

export default function Button({ lgScreen, text }: ButtonProps) {
  return (
    <button
      className={cls(
        lgScreen ? "lg:w-2/4" : "",
        "w-full py-1 bg-orange-400 hover:bg-orange-600  text-white  rounded-xl mt-10 uppercase shadow-sm focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 hover:transition-all"
      )}
    >
      {text}
    </button>
  );
}
