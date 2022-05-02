import { deliveryFile } from "@libs/client/deliveryFIle";
import Image from "next/image";

interface Avatar {
  avatar?: string | null;
}

const AvatarSet = ({ avatar }: Avatar) => {
  return avatar ? (
    <div className="mr-2 relative w-6 h-6 sm:w-8 sm:h-8">
      <Image
        src={deliveryFile(avatar)}
        className="bg-slate-100 rounded-full flex justify-center items-center"
        layout="fill"
        alt=""
        priority
      />
    </div>
  ) : (
    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex justify-center items-center border-2 border-orange-200 mr-2">
      <svg
        className="h-6 w-6 text-orange-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  );
};

export default AvatarSet;
