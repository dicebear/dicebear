# How to contribute?

There are several ways you can contribute to this project. You can contribute an avatar style or improve an existing
one. Or you add tests or update the documentation.

## Requirements

- A GitHub account
- Git installed (Learn how to install Git [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
- NodeJS and NPM installed (Learn how to install NodeJS [here](https://nodejs.org/en/download/))

## Set up project locally

1. [Create a fork](https://help.github.com/en/articles/fork-a-repo) of this project

2. Clone the project:

   ```
   git clone https://github.com/<YOUR_GITHUB_USERNAME>/dicebear.git
   ```

   If you've set up SSH, you can do this instead:

   ```
   git clone git@github.com:<YOUR_GITHUB_USERNAME>/dicebear.git
   ```

3. Install dependencies:

   ```
   cd dicebear
   npm install
   ```

4. Create a build:

   ```
   npm run build
   ```

## Contributing an avatar style

The [Figma Exporter](/styles/create-your-own/with-figma/) plugin is the easiest way to add an avatar style. Most avatar
styles for DiceBear avatars were created this way. Alternatively, you can create an avatar style
[from scratch](/styles/create-your-own/from-scratch/).

Place your avatar style in the following folder:

```
packages/@dicebear/<YOUR_AVATAR_STYLE_NAME>/
```

Note that your package name must be in the namespace `@dicebear`. You store the package name in the `package.json` of
your avatar style.

```json
{
  "name": "@dicebear/<YOUR_AVATAR_STYLE_NAME>"
  // ...
}
```

### Verifying your changes

You can test your new avatar style as follows:

```
npm install
npm run build --workspace @dicebear/<YOUR_AVATAR_STYLE_NAME>
npm run test --workspace @dicebear/<YOUR_AVATAR_STYLE_NAME>
```

The test (if set up correctly) creates multiple avatars under the path
`packages/@dicebear/<YOUR_AVATAR_STYLE_NAME>/tests/svg/` and checks that the result has not changed when the test is
called again. It should not change because the creation with seed must be deterministic.

If you visually check the created avatars and find errors, you can correct your work and run the build and test again.
But first delete the files in the directory.

### Branching and committing

Once you are happy with the changes, create a branch so you can commit the changes.

```
git checkout -b <YOUR_AVATAR_STYLE_NAME>
```

Afterwards you have to add your changes to the stage and commit them.

```
git add .
git commit -m "Add: <YOUR_AVATAR_STYLE_NAME>"
git push origin <YOUR_AVATAR_STYLE_NAME>
```

### Creating a Pull Request

Follow
[these instructions](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)
to create a Pull Request.

## Contribute changes to an existing avatar style

Usually the official avatar styles were created with our [Figma Exporter](/styles/create-your-own/with-figma/) plugin.
You can find the Figma source files in the [SOURCES.md](https://github.com/dicebear/dicebear/blob/main/SOURCES.md) file.
So if you want to customize an avatar style, it's best to do the customization directly in Figma.

In order to edit the files in Figma, you must
[duplicate](https://help.figma.com/hc/en-us/articles/360038511533-Duplicate-files) them. Otherwise, the steps are
identical to those in [Contributing an avatar style](#contributing-an-avatar-style) with the difference that you are
working on an existing avatar style.

## Contribute to a package

You want to contribute to a package, like `@avatars/core` or the official CLI? All packages are written in
[TypeScript](https://www.typescriptlang.org/) and you can find them in the `packages` folder.

### Verifying your changes

You can test your changes as follows:

```
npm install
npm run build --workspace <PACKAGE_NAME>
npm run test --workspace <PACKAGE_NAME>
```

If you are working on the CLI, you can test your changes _after_ the build by calling the CLI script directly as
follows:

```
node packages/dicebear/bin/index.js <COMMAND>
```

### Branching and committing

Once you are happy with the changes, create a branch so you can commit the changes.

```
git checkout -b <YOUR_BRANCH>
```

Afterwards you have to add your changes to the stage and commit them.

```
git add .
git commit -m "Change: <YOUR_CHANGES>"
git push origin <YOUR_BRANCH>
```

### Creating a Pull Request

Follow
[these instructions](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)
to create a Pull Request.

## Contribute to the documentation

For the documentation and website we use Vuepress. A static website generator powered by Vue. You can find the source
files in the `website` directory. You will also find a link to the source file of the respective page in the
documentation below each page.

### Verifying your changes

You can start the website locally on your computer with the following command to check your changes:

```
npm run dev --workspace @dicebear/website
```

Open [http://localhost:8080/](http://localhost:8080/) in your browser to see your changes.

### Branching and committing

Once you are happy with the changes, create a branch so you can commit the changes.

```
git checkout -b <YOUR_BRANCH>
```

Afterwards you have to add your changes to the stage and commit them.

```
git add .
git commit -m "Change: <YOUR_CHANGES>"
git push origin <YOUR_BRANCH>
```

### Creating a Pull Request

Follow
[these instructions](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)
to create a Pull Request.
