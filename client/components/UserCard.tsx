import { User } from "@/types/user";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/utils";

export default function UserCard({ user }: { user: User }) {
  return (
    <Link
      href={{
        pathname: '/(tabs)/(courts)/user/[userId]',
        params: { userId: user.id },
      }}
      className="w-full">
      <View className="flex w-full flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <Avatar className="size-10" alt={`${user.name}'s image`}>
            <AvatarImage source={{ uri: user.image }} />
            <AvatarFallback>
              <Text>{getInitials(user.name)}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex flex-col">
            <Text className="text-sm font-semibold">{user.name}</Text>
            <Text className="text-xs font-medium text-muted-foreground">{user.archetype}</Text>
          </View>
        </View>
        <View className="flex size-9 items-center justify-center rounded-full border border-border bg-muted/30">
          <Text className="font-bold">{user.overall}</Text>
        </View>
      </View>
    </Link>
  );
}