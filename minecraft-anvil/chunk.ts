import { NBTParser, AnvilParser, LocationEntry } from "mc-anvil"
import * as fs from 'fs'

const raw: Buffer = fs.readFileSync('./worlds/1_16_5/region/r.0.0.mca')
const parser: AnvilParser = new AnvilParser(toArrayBuffer(raw))
const chunks: LocationEntry[] = parser.getLocationEntries()
const firstNonEmptyChunk: number = chunks.filter(x => x.offset > 0)[0].offset;
const data: ArrayBuffer = parser.getChunkData(firstNonEmptyChunk);
const nbtParser: NBTParser = new NBTParser(data);
const tag = nbtParser.getTag();
console.log(tag)

function toArrayBuffer(buf: string | any[] | Buffer) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}