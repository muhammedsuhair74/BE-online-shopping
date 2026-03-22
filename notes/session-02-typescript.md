**why ->  Nodeserver only knows js not ts, we have to convert ts to js**

1. Install TypeScript: `npm install typescript`
2. Initialize TypeScript configuration: `npx tsc --init`

**Explain tsconfig.json after replacing it with the following values**

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "esModuleInterop": true,
        "target": "es6",
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist"
    }
}
```

3. Rename `app.js` to `app.ts`

4. Run TypeScript compiler to generate JavaScript in `dist` folder: `npx tsc`

5. Add build command in scripts in `package.json`:

```json
"build": "npx tsc"
```

6. Modify `start-server` command as:

```json
"start-server": "node dist/app.js"
```

7. Modify `start-server` to a single command:

```json
"start-server": "npx tsc && node dist/app.js"
```

Now you have the TypeScript configuration set up, and you can build and run your Node.js server using TypeScript.
