export interface Message {
    id: string;
    senderid: string;
    text: string;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
}
export interface Conversation {
    id: string;
    participantName: string; // Name of the participant for display
    participantImage: string; // URL of the participant's profile picture
    isOnline: boolean; // Online status of the conversation (true if any participant is online)
    messages: Message[];
    lastMessage: string; // Last message in the conversation
}