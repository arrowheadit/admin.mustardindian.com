export const convertByteToKB = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + "KB";
};

export const checkIsImage = (ext: string) => {
    switch (ext) {
        case "pdf":
            return false;
        case "html":
            return false;
        case "ai":
            return false;
        case "fig":
            return false;
        case "zip":
            return false;
        default:
            return true;
    }
};


export const convertToSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

export const snackCaseToUpperCase = (str: string): string  => {
    //return str.split("_").join(" ").toUpperCase();
    return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
export const JsonParse = (str: string): unknown[] | Record<string, unknown> => {
    try {
        const parsed = JSON.parse(str);
        return parsed;
    } catch {
        return [];
    }
};

export const JsonStringify = (obj: unknown): string  => {
    try {
        return JSON.stringify(obj);
    } catch {
        return "";
    }
};  