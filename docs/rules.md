# Rules

Rules are used to enable a flag for a subset of users. Rules are evaluated from
top to bottom. If a rule matches, the flag will return the configured value and
stop evaluating the remaining rules.

See the [example](#example) below.

Each rule has an attribute (1), a comparison operator (2), one or multiple
targets (3) and an output value (4).

![Rule](/img/edge-flags/rule.png)

## Available Attributes

### Geolocation Attributes

<Note>
  Geolocation is not available when running your edge function locally in
  development.
</Note>

#### City

The city name for the location of the requester's public IP address. Non-ASCII
characters are encoded according to
[RFC3986](https://www.rfc-editor.org/rfc/rfc3986).

#### Country

Countries are identified by their
[ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code.

We provide a list of many available countries as suggestions in the input
component in the [console](https://console.upstash.com/edge-flags).

![Countries](/img/edge-flags/countries.png)

#### IP

The public IP address of the client that made the request.

#### Region

A string of up to three characters containing the region-portion of the
[ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code for the first level
region associated with the requester's public IP address.

Unfortunately, there is no official extensive list of available regions from
Vercel.

### Custom Attribute

You can use custom attributes to enable a flag for a subset of users. For
example, you can enable a flag for users with a specific `userId` or `email`.

Please refer to the [API documentation](/redis/sdks/edge-flags/react) for more
information on how to set custom attributes.

## Comparison Operators

These are the available rule types. Each of them includes a small code snippet
that shows the exact implementation for reference

`value` is the value of the attribute. `target` is what we compare the attribute
value to.

### `is in array`

The rule will apply if the attribute is in the target array.

```ts
return target.includes(attribute);
```

### `is not in array`

The rule will apply if the attribute is not in the target array.

```ts
return !target.includes(attribute);
```

### `contains`

The rule will apply if the attribute contains the specified target.

```ts
return attribute.includes(target);
```

### `does not contain`

The rule will apply if the attribute value does not contain the specified
target.

```ts
return !attribute.includes(target);
```

### `equals`

The rule will apply if the attribute value equals the specified targe.

```ts
return attribute === target;
```

### `does not equal`

The rule will apply if the attribute value does not equal the specified target.

```ts
return attribute !== target;
```

### `is empty`

The rule will apply if the attribute value is empty.

```ts
return attribute === "";
```

### `is not empty`

The rule will apply if the attribute value is not empty.

```ts
return attribute !== "";
```

### `is greater than`

The rule will apply if the attribute value is greater than the specified value.

```ts
return attribute > target;
```

### `is greater than or equals`

The rule will apply if the attribute value is greater than or equals the
specified value.

```ts
return attribute >= target;
```

### `is less than`

The rule will apply if the attribute value is less than the specified value.

```ts
return attribute < target;
```

### `is less than or equals`

The rule will apply if the attribute value is less than or equals the specified
value.

```ts
return attribute <= target;
```

## Example

The following flag will be evaluated for 80% of all users and enabled for those
in Germany or the United Kingdom and for users with the attribute `userId` set
to `chronark`.

![Flag](/img/edge-flags/flag.png)

### First Rule matches

Let's assume our user is lucky enough to be chosen for the 80% and is located in
Germany: The order of operations is as follows:

1. Evaluate percentage: ✅
2. Evaluate country: ✅ Since the user is located in Germany, and that is one of
   the countries specified in the rule, the value `true` will be returned.

### Any Rule matches

Our user is located in Norway and their userId is `chronark`, the order of
operations is as follows:

1. Evaluate country: ❌
2. Evaluate userId: ✅

All rules will be avaluated until one of them matches. In this case, the flag
will return `true`.

### Percentage fall through

Our user is not lucky enough to be chosen for the 80%:

In this case the rules will not be avalated and the flag returns `false`

### No rule hit

Lastly, let's look at what happens if none of the rules match:

If your user is in the United States, and their username is not `chronark`:

1. Evaluate country: ❌
2. Evaluate userId: ❌

The flag will return `false`.
