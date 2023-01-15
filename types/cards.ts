export interface PromptCard {
    id: string;
    prompt: string;
    slots?: number;
    version: string | string[];
}

export interface ResponseCard {
    id: string;
    response: string;
    info?: string;
    version: string | string[];
}