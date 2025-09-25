import { ChatClient } from "@/components/chat/chat-client";

export default function ChatPage() {
    return (
        <div className="h-screen pt-20 flex flex-col">
             <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
                <ChatClient />
             </div>
        </div>
    );
}
