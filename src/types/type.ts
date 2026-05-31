
export interface ContactDocument {
    _id: string | null;
    participants: [
        {
            profilePic: string | null,
            email: string | null,
            name: string | null,
            _id: string | null

        }
    ]
    , lastMessage: {
        text: string | null,
        createdAt: any | null

    }
}
export interface contactInfoInterface {

    conversationId: string | null
    _id: string | null,
    name: string | null,
    email: string | null,
    profilePic: string | null,
    savedName: string | null,
    isOnline: boolean | null
}
export interface searhedUserInterface {
    _id: string | null,
    name: string | null,
    email: string | null,
    profilePic: string | null
}