type Input = {
    name: string,
    value: {
        fileName: string | null,
        path: string | null,
        inputColumn: string | null
    }[]
};

export default Input;
