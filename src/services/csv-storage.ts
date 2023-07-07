import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import papa from "papaparse";

export class CsvService<T> {
  constructor(
    private readonly storagePath: string,
  ) {
    const parentDir = path.dirname(storagePath);
    fsSync.mkdirSync(parentDir, { recursive: true });
  }

  private exists(): boolean {
    return !fsSync.existsSync(this.storagePath) ||
      fsSync.statSync(this.storagePath).size === 0;
  }

  async insert(data: T[]) {
    const isEmpty = this.exists();
    const csvRows = papa.unparse(data, { header: isEmpty });

    return fs.appendFile(
      this.storagePath,
      isEmpty ? csvRows : "\n" + csvRows,
      "utf-8",
    );
  }
}
