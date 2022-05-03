import { cls } from "@libs/client/cls";
import AvatarSet from "./avatarSet";
import { dateFormat } from "./postSlider";

interface AnswerData {
  answer?: string | number;
  id?: number;
  createdAt?: Date;
  user?: {
    id?: number | null;
    username?: string | null;
    avatar?: string | null;
    email?: string | null;
  };
  reverse?: boolean;
}

export default function Comment({
  answer,
  createdAt,
  id,
  user,
  reverse,
}: AnswerData) {
  return (
    <main className="p-1  mt-2">
      {reverse ? (
        <div className=" text-gray-700 text-sm flex justify-end shadow-sm">
          <div className="flex items-center flex-row-reverse">
            <div className="mr-1">
              <AvatarSet avatar={user?.avatar} />
            </div>
            <div className="space-y-2 mr-1">
              <div className="flex justify-end">
                <div className="flex flex-row-reverse">
                  <div className="ml-2 ">
                    <span className="font-bold">{user?.username}</span>
                  </div>
                  <div>{createdAt && <span>{dateFormat(createdAt)}</span>}</div>
                </div>
              </div>

              <div>
                <p className="p-2 rounded-md ">{answer}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-700 text-sm ">
          <div className="flex items-center ">
            <div className="mr-1 ">
              <AvatarSet avatar={user?.avatar} />
            </div>
            <div className="space-y-2">
              <div className="flex">
                <div className="mr-2">
                  <span className="font-bold">{user?.username}</span>
                </div>
                {createdAt && <span>{dateFormat(createdAt)}</span>}
              </div>
              <div>
                <p className=" p-1 rounded-md">{answer}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
