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

import { Tara } from "taralib";

window.onload = main

function main()
{
	console.log("Starting...");

	let taras = [];
	const taraInput = document.getElementById("tara-input");
	taraInput.taras = taras;
	taraInput.addEventListener("change", loadTaras);

	const downloadAll = document.getElementById("download-all");
	downloadAll.taras = taras;
	downloadAll.addEventListener("click", downloadAllFiles);

	console.log("Done");
}

function loadTaras(event)
{
	// Hide pop up before loading files
	const popup = document.getElementById("upload-files-popup");
	popup.classList.add("hidden");
	const main = document.getElementsByTagName("main")[0];
	main.classList.remove("hidden");

	console.log("Loading taras");

	// XXX: Add a check if we have tara files or not and for empty uploads
        for (const file of event.target.files)
        {
		const reader = new FileReader();
		reader.taras = event.target.taras;
		reader.fileName = file.webkitRelativePath;
		reader.addEventListener("load", unPackTara);
		reader.addEventListener("error", taraLoadError);
		reader.readAsArrayBuffer(file);
	}
}

function unPackTara(event)
{
	console.log("Unpacking %s", event.target.fileName);
	const tara = new Tara();
	tara.taras = event.target.taras;
	tara.addEventListener("parse", (event) => {
		const fileTable = document.getElementById("files");
		for (const file of event.target.files)
		{
			event.target.taras.push(file);

			const row = document.createElement("tr");
			const fileName = document.createElement("td");
			const size = document.createElement("td");

			fileName.appendChild(document.createTextNode(file.name));
			size.appendChild(document.createTextNode(file.size));
			row.appendChild(fileName);
			row.appendChild(size);
			fileTable.appendChild(row);
		}
	});
	tara.addEventListener("error", (event) => {
		console.error(event.target.Error);
	});
	tara.parse(event.target.result);
}

function downloadAllFiles(event)
{
	console.log("Downloading files...");
	for (const file of event.target.taras)
	{
		const link = document.createElement("a");
		link.href = URL.createObjectURL(file); // XXX: Revoke this
		link.download = file.name;
		link.click();
	}
}

/* Error events */
function taraLoadError(event)
{
	console.error("Failed to load %s!:\n%s", event.target.fileName, event.target.error);
}
