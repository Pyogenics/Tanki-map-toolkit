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

window.onload = main;

function main()
{
	console.log("Starting.....");

	/* Propyl upload */
	const submitBtn = document.getElementById("upload");
	const fileArea = document.getElementById("propyl-folder");
	const reader = new FileReader();

	submitBtn.fileArea = fileArea;
	submitBtn.addEventListener("click", loadPropyl);

	console.log("Done!");
}

/* Propyl events */
function loadPropyl(event)
{
	console.log("Loading propyl....");

	// XXX: Handle empty file uploads

	let files = [];
	for (const file of event.target.fileArea.files)
	{
		console.log(file.webkitRelativePath);
		const fileReader = new FileReader();
		fileReader.files = files;
		fileReader.addEventListener("error", () => { console.error("Failed to load file from propyl!"); });
		fileReader.addEventListener("load", (event) => { console.log("Loaded"); event.target.files.push(event.target.result); });
		fileReader.readAsArrayBuffer(file);
	}

	// XXX: We should wait for all the files to finish loading, make an elegant fetching solution!
	console.log(files);
}
