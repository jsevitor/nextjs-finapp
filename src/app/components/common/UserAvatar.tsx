import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

type UserAvatarProps = {
  url: string;
};

export default function UserAvatar({ url }: UserAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={url} />
      <AvatarFallback>
        <User />
      </AvatarFallback>
    </Avatar>
  );
}
