# blanco-valencia

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.9. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Copy Dropbox settings

```
rclone sync Dropbox:/BlancoValencia ~/Dropbox/BlancoValencia
cp -r ~/Dropbox/BlancoValencia/* ./apps/blancovalencia/src/content/

cp -r ./apps/blancovalencia/src/content/* ~/Dropbox/BlancoValencia/
rclone sync ~/Dropbox/BlancoValencia Dropbox:/BlancoValencia
```
