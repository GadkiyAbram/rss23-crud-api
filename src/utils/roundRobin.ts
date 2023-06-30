const INCREMENT = 1;
export const roundRobin = (index: number, workerUrls: string[]) => {
    return (index + INCREMENT) % workerUrls.length
}