import React from "react";
import { TouchableOpacity, View } from "react-native";

// utils
import { cn } from "@/src/utils/cn";

interface IButton {
  children: React.ReactNode;
  type?: "border";
  classname?: string;
  onClick?: () => void;
}

export default function Button(props: IButton) {
  return (
    <TouchableOpacity onPress={props.onClick || undefined}>
      <View
        className={cn(
          "w-fit bg-primary rounded-full px-4 py-2",
          {
            "px-2 py-2 border-solid border-[1px] border-primary":
              props.type === "border",
          },
          props.classname
        )}
      >
        {props.children}
      </View>
    </TouchableOpacity>
  );
}
