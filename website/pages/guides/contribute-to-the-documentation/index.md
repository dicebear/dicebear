# Contribute to the documentation

For the documentation and website we use
[VitePress](https://vitepress.vuejs.org/). A static website generator powered by
[Vue](https://vuejs.org/). You can find the source files in the
[dicebear/dicebear](https://github.com/dicebear/dicebear) repository in the
`website` folder. You will also find a link to the source file of the respective
page in the documentation below each page.

## Requirements

- A GitHub account
- Git installed (Learn how to install Git
  [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
- [Node.js](https://nodejs.dev/en/) and
  [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  installed

## Set up locally

1. [Create a fork](https://help.github.com/en/articles/fork-a-repo) from the
   [dicebear/dicebear](https://github.com/dicebear/dicebear) repository.

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

## Verifying your changes

You can start the website locally on your computer with the following command to
check your changes:

```
npm run dev --workspace @dicebear/website
```

Open `http://localhost:5173/` in your browser to see your changes.

## Branching and committing

Once you are happy with the changes, create a branch so you can commit the
changes.

```
git checkout -b <YOUR_BRANCH>
```

Afterwards you have to add your changes to the stage and commit them.

```
git add .
git commit -m "Change: <YOUR_CHANGES>"
git push origin <YOUR_BRANCH>
```

## Creating a Pull Request

Follow
[these instructions](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)
to create a Pull Request.
