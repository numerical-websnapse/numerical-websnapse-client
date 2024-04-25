---

# Numerical WebSnapse

This is a project for visualizing and simulating **Numerical Spiking Neural P Systems**. The live application can be accessed [here](https://numerical-websnapse.vercel.app).

To clone the project:

```bash
git clone https://github.com/numerical-websnapse/numerical-websnapse-client
cd numerical-websnapse-client
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

## Get started

Install the dependencies:

```bash
cd numerical-websnapse-client
npm install
```

then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080) (if no host was set) or to `<host>:8080`. You should see an instance of Numerical WebSnapse running.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

```
sirv public --no-clear --host 192.168.100.2
```

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Vercel](https://vercel.com).

## Deploying to the web

### With [Vercel](https://vercel.com)

Install `vercel` if you haven't already:

```bash
npm install -g vercel
```

Then, from within your project folder:

```bash
cd public
vercel deploy --name my-project
```

## Development

The file structure for the client-side of Numerical WebSnapse is shown as:

```
public/
scripts/
src/
├─ api/
├─ assets/
├─ components/
├─ graph/
├─ lib/
├─ stores/
├─ utils/
App.svelte
main.js
```

Graph related logic is under the **graph** folder which contains all the graph rendering needs like node and behavior definitions. All UI elements are under the **components** folder and are added in `App.svelte` when defined.

When working together with the [server implementation](https://github.com/numerical-websnapse/numerical-websnapse-server), be sure to set the correct url and protocols in `src>stores>system.js`. By default the local server url is defined as:

```
url: '127.0.0.1:8000'
```

## Author

Rey Christian E. Delos Reyes
