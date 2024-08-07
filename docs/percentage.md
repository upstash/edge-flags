# Percentage

Using a percentage allows you to only apply rules to a subset of users. This is
useful if you want to roll out a feature to a small percentage of users first
and then increase it over time.

Adding a percentage to a flag can be done in the top half of the flag editor.

![Percentage](/img/edge-flags/percentage.png)

The percentage is applied to the flag before the rules are evaluated. If the
percentage is 80%, the flag will be evaluated for 80% of the users and disabled
for the other 20%.

Set the percentage to 0 or click the small trash icon to remove the percentage.

If no percentage is set, the flag will be evaluated for all users.
