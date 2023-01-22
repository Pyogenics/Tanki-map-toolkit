/*
 *   Web based map editor for tanki online
 *   Copyright (C) 2023  Pyogenics <https://github.com/Pyogenics>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

class Tara
{
	constructor(ArrayBuffer)
	{
		this.buffer = new byteStream(ArrayBuffer);
		this.files = [];

		this.parse();
	}

	parse()
	{
		const numFiles = this.buffer.getUint32();
		// Get file names and lengths
		for (let fileIdx = 0; fileIdx != numFiles; fileIdx++)
		{
			const nameLen = this.buffer.getUint16();
			let name = [];
			for (let charIdx = 0; charIdx != nameLen; charIdx++)
			{
				name.push(this.buffer.getInt8());
			}
			name = String.fromCharCode(...name);
			const size = this.buffer.getUint32();

			this.files.push([name, size]);
		}

		// Get file contents
		for (let fileIdx = 0; fileIdx != this.files.length; fileIdx++)
		{
			const content = new ArrayBuffer(this.files[fileIdx][1]);
			const contentView = new Int8Array(content);
			for (let fileContentIdx = 0; fileContentIdx != this.files[fileIdx][1]; fileContentIdx++)
			{
				contentView[fileContentIdx] = this.buffer.getInt8();
			}
			this.files[fileIdx].push(content);
		}
	}
}

class byteStream extends DataView
{
    constructor(ArrayBuff, littleEndian = false)
    {
        super(ArrayBuff)
        this.bytePTR = 0
        this.littleEndian = littleEndian
    }

    getInt8()
    {
        let byte = super.getInt8(this.bytePTR)
        this.bytePTR++

        return byte
    }

    getUint8()
    {
        let byte = super.getUint8(this.bytePTR)
        this.bytePTR++

        return byte
    }

    getInt16()
    {
        let bytes = super.getInt16(this.bytePTR, this.littleEndian)
        this.bytePTR += 2

        return bytes
    }

    getUint16()
    {
        let bytes = super.getUint16(this.bytePTR, this.littleEndian)
        this.bytePTR += 2

        return bytes
    }

    getInt32()
    {
        let bytes = super.getInt32(this.bytePTR, this.littleEndian)
        this.bytePTR += 4

        return bytes
    }

    getUint32()
    {
        let bytes = super.getUint32(this.bytePTR, this.littleEndian)
        this.bytePTR += 4

        return bytes
    }
}
