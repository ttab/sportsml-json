sportsml-json converter
=================================

Translates between the SportsML form and an JSON representation.

### Constraints

The serialization is only possible given a number of constraints.

* The entire structure is mapped out in a `order` json structure that
  can be provided as an option.
  
* Nodes where we use the value of text-node children for data must not have
  attributes (`<name role="nrol:first">Quentin</name><name role="nrol:last">Halys</name>`).

* An attribute name must never be also a child node name.

### Usage

```javascript
const {tojson} = require('sportsml-json')

const myorder = {
  // entry point
  __root: "sports-content",
  
  // when mapping a text child-node (see constraints about no attributes)
  "name": "string",
  
  // the expected nested elements, * indicate repeated (i.e. map to array)
  "sports-content": ["sports-metadata", "sports-event*", "standing", "schedule", "tournament"],
  ...
}

var xml = '<sports-content>...</sports-content>'

var json = tojson(xml, {order:myorder})
```

The `order` JSON object describes what node expects what children, with a simple
notation of `*`-suffix when we expect repeated subnodes (this translates to an array).

### Factory

For any nested object, it's possible to instantiate a specific object class using
a provided `factory`-parameter

```javascript

class Team {
...
}

const myfactory = {
  // for anything that doesn't have an explicit mapping
  __default: () => new Object(),
  
  // team gets it's own class
  team: () => new Team(),
}

var json = tojson(xml, {factory:myfactory})
```


### XML

```xml
   <sports-event>
      <event-metadata key="tt:FF3491032"
                      event-status="speventstatus:post-event"
                      event-outcome-type="speventoutcometype:regular"
                      start-date-time="2017-05-29"
                      competition="tt:5841"
                      round-number="11"/>
      <team id="et12408">
         <team-metadata alignment="home" key="tt:12408">
            <name>Örebro</name>
         </team-metadata>
         <team-stats score="2" score-opposing="1" event-standing-points="3"/>
      </team>
      <team id="et12753">
         <team-metadata alignment="away" key="tt:12753">
            <name>Sirius</name>
         </team-metadata>
         <team-stats score="1" score-opposing="2" event-standing-points="0"/>
      </team>
      ...
```

### JSON

```json
  "sports-event": [
    {
      "event-metadata": {
        "key": "tt:FF3491032",
        "event-status": "speventstatus:post-event",
        "event-outcome-type": "speventoutcometype:regular",
        "start-date-time": "2017-05-29",
        "competition": "tt:5841",
        "round-number": "11"
      },
      "team": [
        {
          "id": "et12408",
          "team-metadata": {
            "alignment": "home",
            "key": "tt:12408",
            "name": "Örebro"
          },
          "team-stats": {
            "score": "2",
            "score-opposing": "1",
            "event-standing-points": "3"
          }
        },
        {
          "id": "et12753",
          "team-metadata": {
            "alignment": "away",
            "key": "tt:12753",
            "name": "Sirius"
          },
          ...
```
