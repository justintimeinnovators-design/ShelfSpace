export type Message = {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  suggestions?: string[];
};
