export type LoginState = {
    username: string;
    password: string;
    isLogin: boolean;
    isFetching: boolean;
    error: string;
    successMsg: string;
};

export type ThreadState = {
    title: string;
    content: string;
    tags: string;
}

export type CommentState = {
    content: string;
}