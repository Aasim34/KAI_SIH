import { ChatClient } from "@/components/chat/chat-client";

export default function ChatPage() {
    return (
        <div className="pt-20 h-screen">
             <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 h-[calc(100%-5rem)]">
                <ChatClient />
             </div>
        </div>
    );
}
