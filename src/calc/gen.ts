function gen(...args: number[]) {
    return args.reduce((ac, cur) => ac + cur)
}

export default gen