import download from 'download';
import ora from 'ora';
import validateName from 'validate-npm-package-name';
import { replaceInFile } from 'replace-in-file';
import execa from 'execa';
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'commander';

export async function makeNewCommand() {
  const cmd = new Command('new');

  cmd.arguments('<name>');

  cmd.action(async (name: string) => {
    if (false === validateName(name).validForNewPackages) {
      throw new Error(`${name} is not a valid package name.`);
    }

    const target = path.resolve(process.cwd(), name);

    await fs.ensureDir(target);

    const downloadSpinner = ora('Download and extract template').start();

    await download('https://github.com/dicebear/template/archive/refs/heads/main.zip', target, {
      extract: true,
      strip: 1,
    });

    downloadSpinner.succeed();

    const replaceSpinner = ora('Initialize project').start();

    const styleName = name
      .split('/')
      .reverse()[0]
      .replace(/[^a-z0-9\/]/gi, ' ')
      .replace(/[ ]{2,}/g, ' ')
      .split(' ')
      .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
      .join('');

    await replaceInFile({
      files: [path.resolve(target, 'package.json'), path.resolve(target, 'src', 'index.ts')],
      from: 'project-name',
      to: name,
    });

    await replaceInFile({
      files: [path.resolve(target, 'package.json')],
      from: 'ProjectName',
      to: styleName,
    });

    replaceSpinner.succeed();

    const dependencySpinner = ora('Install dependencies').start();

    try {
      await execa('yarn', ['install'], { cwd: target, stdio: 'ignore' });

      dependencySpinner.succeed();
    } catch {
      try {
        await execa('npm', ['install'], { cwd: target, stdio: 'ignore' });

        dependencySpinner.succeed();
      } catch {
        dependencySpinner.warn('Dependency installation failed. Skipped.');
      }
    }

    const banner: string[] = [''];

    banner.push(chalk.green(`Your avatar style is ready!`));
    banner.push('');
    banner.push(chalk.gray(`cd ${name}`));

    banner.push('');

    console.log(banner.join('\n'));
  });

  return cmd;
}
