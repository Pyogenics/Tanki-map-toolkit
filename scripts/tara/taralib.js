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

// XXX: Implement checks and error handling!
class Tara extends EventTarget
{
	constructor()
	{
		super();
		this.parseEvent = new Event("parse");
		this.parseErrorEvent = new Event("error");

		this.files = [];
	}

	parseFromFile(file)
	{
		if (this.files.length != 0)
		{
			this.Error = "parse: Files array not empty; this function can only be used once!";
			this.dispatchEvent(this.parseErrorEvent);
			return -1;
		}

		this.buffer = new byteStream(file);
		const numFiles = this.buffer.getUint32();

		let names = [];
		let sizes = [];

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

			names.push(name);
			sizes.push(size);
		}

		// Get file contents
		for (let fileIdx = 0; fileIdx != numFiles; fileIdx++)
		{
			const content = new ArrayBuffer(sizes[fileIdx]);
			const contentView = new Int8Array(content);
			for (let fileContentIdx = 0; fileContentIdx != sizes[fileIdx]; fileContentIdx++)
			{
				contentView[fileContentIdx] = this.buffer.getInt8();
			}

			const file = new File([content], names[fileIdx]);
			this.files.push(file);			
		}

		this.dispatchEvent(this.parseEvent);
	}
}

class PropLibrary extends EventTarget
{
	constructor()
	{
		super();
		this.parseEvent = new Event("parse");
		this.parseErrorEvent = new Event("error");
	
		this.props = new Object();
	}

	// XXX: Slow?
	parseFromTara(tara)
	{
		this.files = tara.files; // XXX: Is this necessary
		let imagesXML = undefined;
		let libraryXML = undefined;

		// Find image and library xml
		for (const file of tara.files)
		{
			// XXX: Should duplicates be handled?
			if (file.name === "library.xml")
			{
				libraryXML = file;
			}
			else if (file.name === "images.xml")
			{
				imagesXML = file;
			}
			if (imagesXML !== undefined && libraryXML !== undefined)
			{
				break;
			}
		}

		if (libraryXML === undefined)
		{
			this.Error = "parseFromTara: library.xml missing! Is the library correct?";
			this.dispatchEvent(this.parseErrorEvent);
			return -1;
		}
	
		this.parseLibrary(libraryXML);
	}

	// XXX: clean this up!
	parseLibrary(libraryXML)
	{
		libraryXML.text().then((result) => { 
			const parser = new DOMParser();
			const xml = parser.parseFromString(result, "text/xml"); 

			this.name = xml.documentElement.getAttribute("name");
			for (const propGroup of xml.documentElement.children)
			{
				this.props[propGroup.getAttribute("name")] = new Object();
				for (const prop of propGroup.children)
				{
					this.props[propGroup.getAttribute("name")][prop.getAttribute("name")] = prop.children[0].getAttribute("file");
				}
			}

			this.dispatchEvent(this.parseEvent);
		});
	}

/*
	parseFromFileList(fileList)
	{
		
	}

	parseFromArray(fileArray)
	{

	}
*/
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

export { Tara, PropLibrary };
