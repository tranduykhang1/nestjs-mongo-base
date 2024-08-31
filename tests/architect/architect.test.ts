import * as fs from 'fs';
import * as path from 'path';

describe('Architect - Module matching', () => {
  const modulesDirectory = path.resolve(__dirname, '../../src/modules/');
  const modulePattern = /^[a-z-]+\.module\.ts$/;

  it('should ensure all folders contain files matching the .module.ts pattern', () => {
    const folders = fs
      .readdirSync(modulesDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    folders
      .filter((folder) => folder !== 'seeder')
      .forEach((folder) => {
        const folderPath = path.join(modulesDirectory, folder);
        const files = fs.readdirSync(folderPath);

        const matchingFiles = files.filter((file) => modulePattern.test(file));

        expect(matchingFiles.length).toBeGreaterThan(0);
      });
  });
});

describe('Architect - Common matching', () => {
  const modulesDirectory = path.resolve(__dirname, '../../src/common/');

  it('should ensure all folders contain files matching the .module.ts pattern', () => {
    const folders = fs
      .readdirSync(modulesDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    folders
      .filter((folder) => folder !== 'seeder')
      .forEach((folder) => {
        const folderPath = path.join(modulesDirectory, folder);
        const files = fs.readdirSync(folderPath);

        console.log(`${folder.slice(0, -1)}.ts`);
        const matchingFiles = files.filter((file) =>
          file.includes(`.${folder.slice(0, -1)}.ts`),
        );

        expect(matchingFiles.length).toBeGreaterThan(0);
      });
  });
});
