
module.exports = {

    // entry point
    __root: "sports-content",

    // when mapping a text child-node (see constraints about no attributes)
    "name": "string",
    "p":    "string",

    // the expected nested elements, * indicate repeated (i.e. map to array)
    "sports-content": ["sports-metadata", "sports-event*", "standing", "schedule", "tournament"],

    "tournament": ["tournament-division*"],
    "tournament-division": ["tournament-division-metadata", "tournament-part"],
    "tournament-division-metadata": ["sport-content-codes", "name"],
    "tournament-part": ["tournament-part-metadata", "sports-event"],
    "tournament-part-metadata": ["name"],

    "sports-metadata": ["sports-content-codes", "sports-property", "catalogRef*"],
    "sports-content-codes": ["sports-content-code*"],
    "sports-content-code": ["sports-content-qualifier"],

    "sports-event": ["event-metadata", "team*", "player*", "officials", "actions", "highlight"],

    "event-metadata": ["sport-content-codes", "site", "name"],
    "site": ["site-metadata", "site-stats"],
    "site-metadata": ["name"],

    "team": ["team-metadata", "team-stats", "player*"],
    "team-metadata": ["name"],
    "team-stats": ["sub-score*", "team-stats-soccer", "outcome-totals*", "award", "rank"],

    "player": ["player-metadata", "player-stats"],
    "player-metadata": ["name"],
    "player-stats": ["rank", "player-stats-tennis"],
    "player-stats-tennis": ["stats-tennis-set*"],

    "officials": ["official*"],
    "official": ["official-metadata"],
    "official-metadata": ["name", "home-location"],
    "home-location": ["name"],

    "actions": ["action*"],
    "action": ["participant*"],

    "highlight": ["p*"],

    "standing": ["standing-metadata", "team*"],

    "schedule": ["schedule-metadata", "sports-event*"],

}
