export class GenFileName {
  static gen(mimeType: string): string {
    const type = mimeType.split('/').at(-1);
    return Date.now() + '-' + Math.round(Math.random() * 1e9) + `.${type}`;
  }
}
