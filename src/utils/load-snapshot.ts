import fs from 'node:fs';
import path from 'node:path';

const SNAPSHOTS_FOLDER_PATH = path.resolve(__dirname, '../../../static');

export function loadSnapshot(relativePath: string): string {
    const snapshotPath = `${SNAPSHOTS_FOLDER_PATH}/${relativePath}`;
    const snapshot = fs.readFileSync(snapshotPath, 'utf-8');
    return snapshot;
}
