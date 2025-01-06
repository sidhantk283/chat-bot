import Chat from "@/components/ChatSection";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <h1 className="p-5">Chat with GPT4</h1>
      <Chat />
    </div>
  );
}
