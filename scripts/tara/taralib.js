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

		this.files = new Object();
	}

	parseFromFile(file)
	{
		if (Object.keys(this.files).length != 0)
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

			this.files[name] = new Object();
			this.files[name].size = size;
		}

		const files = Object.values(this.files);
		files[0].offset = this.buffer.bytePTR;
		// Pre calculate offsets
		for (let fileIdx = 1; fileIdx != files.length; fileIdx++)
			files[fileIdx].offset = files[fileIdx-1].offset + files[fileIdx-1].size; // Start offset of previous file + size of previous file = offset of this file

		this.dispatchEvent(this.parseEvent);
	}

	getFile(name)
	{
		const fileInfo = this.files[name];
		const buffer = new ArrayBuffer(fileInfo.size);
		const buffView = new Int8Array(buffer);

		this.buffer.bytePTR = fileInfo.offset;
		for (let byteIdx = 0; byteIdx != fileInfo.size; byteIdx++)
		{
			buffView[byteIdx] = this.buffer.getInt8()
		}

		return new File([buffer], name);
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
		this.images = new Object();
	}

	// XXX: Slow?
	parseFromTara(tara)
	{
		this.files = tara.files; // XXX: Is this necessary
		let imagesXML = undefined;
		let libraryXML = undefined;

		// Find image and library xml
		for (const fileName in tara.files)
		{
			// XXX: Should duplicates be handled?
			if (fileName === "library.xml")
			{
				libraryXML = tara.getFile(fileName);
			}
			else if (fileName === "images.xml")
			{
				imagesXML = tara.getFile(fileName);
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

		const parseXML = new Promise((resolve, reject) => {
			if (imagesXML === undefined)
				this.buildImages();
			else
				this.parseImages(imagesXML);
			this.parseLibrary(libraryXML);
			resolve();
		});
		parseXML.then(() => {
			this.dispatchEvent(this.parseEvent);
		});
	}

	// XXX: clean this up!
	parseLibrary(libraryXML)
	{
		// XXX: Handle errors where we receive non text files
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
		});
	}

	parseImages(imagesXML)
	{
		imagesXML.text().then((result) => {
			const parser = new DOMParser();
			const xml = parser.parseFromString(result, "text/xml");
			
			for (const image of xml.documentElement.children)
			{
				const name = image.getAttribute("name");
				const newName = image.getAttribute("new-name");
				const alpha = image.getAttribute("alpha");

				this.images[newName] = new Object();
				this.images[newName]["name"] = name;
				// XXX: Probably should just leave it as null? More efficient that way
				if (alpha)
					this.images[newName]["alpha"] = alpha;
				else
					this.images[newName]["alpha"] = undefined;
			}
		});
	}

	buildImages()
	{
		console.warn("There is no images.xml! Is this an old style prop library? Building images......");
		for (const file of Object.values(this.files))
		{
			if (file.name === "library.xml")
				continue;
			this.images[file.name] = new Object();
			this.images[file.name]["name"] = file.name; // Assume the names don't change, that's what you get for using old-style
			this.images[file.name]["alpha"] = undefined; // XXX: Is there alpha????????????
		}
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
