import { cls } from "@libs/client/cls";
import AvatarSet from "./avatarSet";
import { dateFormat } from "./postSlider";

interface AnswerData {
  answer: string | number;
  id: number;
  createdAt: Date;
  user: {
    id: number;
    username: string;
    avatar?: string;
    email: string;
  };
}

export default function Message({ answer, createdAt, id, user }: AnswerData) {
  return (
    <main className="p-1 mb-6 mt-2">
      <div className=" flex items-center text-gray-700 text-sm ">
        <div>
          <AvatarSet avatar={user.avatar} />
        </div>
        <div className="space-y-2">
          <div className="flex">
            <div className="mr-2">
              <span>{user.username}</span>
            </div>
            <span>{dateFormat(createdAt)}</span>
          </div>
          <div>
            <p>{answer}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
