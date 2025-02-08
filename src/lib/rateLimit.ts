import { LRUCache } from "lru-cache";

const rateLimitOptions = {
    max: 100,
    ttl: 60 * 1000
};

const rateLimiter = new LRUCache<string, number>(rateLimitOptions);

export default function isRateLimited(ip: string): boolean {
    const currentRequests = rateLimiter.get(ip) || 0;

    if (currentRequests >= rateLimitOptions.max) {
        return true;
    }

    rateLimiter.set(ip, currentRequests + 1, { ttl: rateLimitOptions.ttl });
    return false;
}
