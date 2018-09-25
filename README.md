# Stratumn tutorials

This repo contains the source code for the tutorial series.
It will help you get started with Stratumn's Proof-of-Process technology.

A branch exists for each part of the tutorials:

- [Part 1: A process for TODO lists](https://github.com/stratumn/tutorials/tree/part1)
- [Part 2: Thinking non-linearly](https://github.com/stratumn/tutorials/tree/part2)
- [Part 3: Handling multiple processes](https://github.com/stratumn/tutorials/tree/part3)

## How to update before a release

- Checkout `part1`:

```sh
git checkout part1
```

- Make your changes (and make sure the tutorial runs)
- Commit your changes:

```sh
git commit --all --message update to v{newVersion}
```

- Create a patch with your changes:

```sh
git format-patch HEAD~1 --stdout > /tmp/update-tuto-{newVersion}.patch
```

- Tag your commit:

```sh
git tag part1-v{newVersion}
```

For each remaining partX:

- Checkout `partX`:

```sh
git checkout partX
```

- Apply the patch:

```sh
apply /tmp/update-tuto-{newVersion}.patch --3way
```

- Make the changes that are specific to this part, if any (and make sure the tutorial runs)
- Commit your changes:

```sh
git commit --all --message update to v{newVersion}
```

- Tag your commit:

```sh
git tag partX-v{newVersion}
```

Copyright 2017-2018 Stratumn SAS.

Licensed under the Apache License, Version 2.0.
