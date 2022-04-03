import {readdirSync, statSync} from 'fs';
const getAllFilePaths = (path: string) => {
  let files = readdirSync(path);
  const htmlFiles: string[] = new Array<string>();
  files.forEach(file => {
    const filepath = `${path}/${file}`; 
    if (statSync(filepath).isDirectory()) {
      htmlFiles.push(...getAllFilePaths(filepath));
      return;
    }
    if (file.endsWith('.html')) {
      htmlFiles.push(filepath);
    }
  });
  return htmlFiles;
};

export default getAllFilePaths;
