import { Inject, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import { IRatelimitOptions } from 'src/interface/rate-limit';

export class RateLimitService {
  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}

  async checkLimit(key: string, options: IRatelimitOptions) {
    const { limit, ttl } = options;
    const limitKey = `limit_count:${key}`;

    const current = await this.redis.incr(limitKey);
    if (current === 1) {
      await this.redis.expire(limitKey, 60 * ttl);
    }

    if (current > limit) {
      throw new UnauthorizedException(`Please try again after ${ttl} minutes`);
    }
  }
}
