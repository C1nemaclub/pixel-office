export type ChatEvent = {
  message: string;
  id: string;
  type: "event" | "message";
};

export type ChatMessage = ChatEvent & {
  name: string;
  time: string;
};
