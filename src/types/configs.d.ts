export type ConfigItem = {
        id?: number,
        slug?: string,
        property: string,
        value: string,
        suggestion?: string,
        status: "active" | "inactive";
}
    
export interface ControlListElement {
    form_hide?: string[];
    list_hide?: string[];
}
