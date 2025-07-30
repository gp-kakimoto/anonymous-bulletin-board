const validUserName = (userName: string | null) => {
    // ユーザー名のバリデーション
    if (typeof userName !== "string" || userName.trim().length === 0) {
        return "ユーザー名は必須です。";

    }
    if (userName.length > 20) {
        return "ユーザー名は 20 文字以内にしてください。";


    }
    // 予約語の禁止(例)
    const forbiddenUserNames = [
        "admin",
        "administolater",
        "管理者",
        "運営",
        "管理人",
        "管理",
    ];
    if (forbiddenUserNames.includes(userName.toLowerCase())) {
        return "そのユーザー名は使用できません。";
    }
    return null;
};

const validContent = (content: string | null) => {
    // コメント本文のバリデーション
    if (typeof content !== "string" || content.trim().length === 0) {
        return "コメントは必須です。";
        //throw new Error("コメントは必須です。");
    }
    if (content.length > 1000) {
        return "コメントは 1000 文字以内にしてください。";
        //throw new Error("コメントは 1000 文字以内にしてください。");
    }
    return "";
};

export { validUserName, validContent };