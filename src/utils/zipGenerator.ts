/**
 * Pure client-side PKZIP standard archive builder.
 * Zero external dependencies. Creates valid ZIP files extractable on macOS, Windows, Linux, and unzip CLI.
 */

// Precompute CRC32 lookup table
const CRC32_TABLE: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function calculateCrc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ data[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface ZipFileEntry {
  path: string;
  content: string | Uint8Array;
}

export class SimpleZip {
  private files: ZipFileEntry[] = [];

  addFile(path: string, content: string | Uint8Array) {
    // Normalize path: forward slashes, remove leading slash
    const cleanPath = path.replace(/\\/g, '/').replace(/^\/+/, '');
    this.files.push({ path: cleanPath, content });
  }

  generateBlob(): Blob {
    const encoder = new TextEncoder();
    const localHeaders: Uint8Array[] = [];
    const centralDirectoryEntries: Uint8Array[] = [];

    let offset = 0;

    // Fixed DOS time/date: 2026-10-27 10:00:00
    // Time: ((10 << 11) | (0 << 5) | 0) = 0x5000
    // Date: (((2026 - 1980) << 9) | (10 << 5) | 27) = ((46 << 9) | (10 << 5) | 27) = 0x5d5b
    const dosTime = 0x5000;
    const dosDate = 0x5d5b;

    for (const file of this.files) {
      const pathBytes = encoder.encode(file.path);
      const dataBytes = typeof file.content === 'string' ? encoder.encode(file.content) : file.content;
      const crc = calculateCrc32(dataBytes);
      const size = dataBytes.length;

      // 1. Local File Header (30 bytes + name + data)
      const localHeader = new Uint8Array(30 + pathBytes.length + size);
      const lv = new DataView(localHeader.buffer);

      lv.setUint32(0, 0x04034b50, true); // Local file header signature
      lv.setUint16(4, 20, true);         // Version needed to extract (2.0)
      lv.setUint16(6, 0x0800, true);     // General purpose bit flag (UTF-8)
      lv.setUint16(8, 0, true);          // Compression method (0 = Store)
      lv.setUint16(10, dosTime, true);   // Last mod file time
      lv.setUint16(12, dosDate, true);   // Last mod file date
      lv.setUint32(14, crc, true);       // CRC-32
      lv.setUint32(18, size, true);      // Compressed size
      lv.setUint32(22, size, true);      // Uncompressed size
      lv.setUint16(26, pathBytes.length, true); // File name length
      lv.setUint16(28, 0, true);         // Extra field length

      localHeader.set(pathBytes, 30);
      localHeader.set(dataBytes, 30 + pathBytes.length);

      localHeaders.push(localHeader);

      // 2. Central Directory Header (46 bytes + name)
      const cdHeader = new Uint8Array(46 + pathBytes.length);
      const cv = new DataView(cdHeader.buffer);

      cv.setUint32(0, 0x02014b50, true); // Central directory header signature
      cv.setUint16(4, 20, true);         // Version made by (2.0)
      cv.setUint16(6, 20, true);         // Version needed (2.0)
      cv.setUint16(8, 0x0800, true);     // General purpose bit flag (UTF-8)
      cv.setUint16(10, 0, true);         // Compression method (0 = Store)
      cv.setUint16(12, dosTime, true);   // Last mod file time
      cv.setUint16(14, dosDate, true);   // Last mod file date
      cv.setUint32(16, crc, true);       // CRC-32
      cv.setUint32(20, size, true);      // Compressed size
      cv.setUint32(24, size, true);      // Uncompressed size
      cv.setUint16(28, pathBytes.length, true); // File name length
      cv.setUint16(30, 0, true);         // Extra field length
      cv.setUint16(32, 0, true);         // File comment length
      cv.setUint16(34, 0, true);         // Disk number start
      cv.setUint16(36, 0, true);         // Internal file attributes
      cv.setUint32(38, 0, true);         // External file attributes
      cv.setUint32(42, offset, true);    // Relative offset of local header

      cdHeader.set(pathBytes, 46);
      centralDirectoryEntries.push(cdHeader);

      offset += localHeader.length;
    }

    const cdOffset = offset;
    let cdSize = 0;
    for (const entry of centralDirectoryEntries) {
      cdSize += entry.length;
    }

    // 3. End of Central Directory Record (22 bytes)
    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);

    ev.setUint32(0, 0x06054b50, true); // EOCD signature
    ev.setUint16(4, 0, true);          // Number of this disk
    ev.setUint16(6, 0, true);          // Disk where central directory starts
    ev.setUint16(8, this.files.length, true);  // Number of CD records on this disk
    ev.setUint16(10, this.files.length, true); // Total number of CD records
    ev.setUint32(12, cdSize, true);    // Size of central directory
    ev.setUint32(16, cdOffset, true);  // Offset of start of CD
    ev.setUint16(20, 0, true);         // Comment length

    // Assemble parts into standard ZIP blob
    const allParts: any[] = [
      ...localHeaders,
      ...centralDirectoryEntries,
      eocd,
    ];

    return new Blob(allParts, { type: 'application/zip' });
  }
}

/**
 * Trigger real browser download of a generated file.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
