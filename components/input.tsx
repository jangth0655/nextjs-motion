import { cls } from "@libs/client/cls";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  type: string;
  required?: boolean;
  lgScreen: boolean;
  register: UseFormRegisterReturn;
  placeholder?: string;
}

export default function Input({
  type,
  required,
  lgScreen,
  register,
  placeholder,
}: InputProps) {
  return (
    <input
      {...register}
      type={type}
      placeholder={placeholder}
      required={required}
      className={cls(
        lgScreen ? "lg:2/4" : "w-full",
        "focus:border-2 focus:border-orange-400  w-full border-gray-200 p-2  border-2 rounded-md placeholder:text-gray-300 text-gray-500"
      )}
    />
  );
}
