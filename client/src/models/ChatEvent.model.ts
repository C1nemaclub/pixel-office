export type ChatEvent = {
  message: string;
  id: string;
  type: 'event';
};

export type ChatMessage = {
  name: string;
  time: string;
  type: 'message';
  id: string;
  message: string;
};
