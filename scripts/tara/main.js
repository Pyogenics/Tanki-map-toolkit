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

	const taraInput = document.getElementById("tara-input");
	taraInput.addEventListener("change", loadTaras);

	console.log("Done");
}

function loadTaras(event)
{
	console.log("Loading taras");

	// XXX: Add a check if we have tara files or not and for empty uploads
        for (const file of event.target.files)
        {
		const reader = new FileReader();
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
	tara.addEventListener("parse", (event) => {
		console.log("Parsed!");
		console.log(event.target.files);
	});
	tara.addEventListener("error", (event) => {
		console.error(event.target.Error);
	});
	tara.parse(event.target.result);
	tara.parse();
}

/* Error events */
function taraLoadError(event)
{
	console.error("Failed to load %s!:\n%s", event.target.fileName, event.target.error);
}
