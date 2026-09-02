<?php

declare(strict_types=1);

namespace App\Data;

use App\Support\UserAgent;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use stdClass;

final class SessionData extends Data
{
    /**
     * Deliberately has no id field. A session id is a credential and must never
     * reach the client; omitting it by construction is stronger than remembering
     * to strip it at every call site.
     */
    public function __construct(
        public string $device,
        public ?string $ip_address,
        public string $last_active,
        public bool $is_current,
    ) {}

    public static function fromRow(stdClass $row, string $currentSessionId): self
    {
        return new self(
            device: UserAgent::describe($row->user_agent),
            ip_address: $row->ip_address,
            last_active: CarbonImmutable::createFromTimestamp($row->last_activity)->diffForHumans(),
            is_current: $row->id === $currentSessionId,
        );
    }
}
