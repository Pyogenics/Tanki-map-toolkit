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

	let files = [];
	submitBtn.files = files;
	submitBtn.fileArea = fileArea;
	submitBtn.addEventListener("click", loadPropyl);

	console.log(files);

	console.log("Done!");
}

/* Propyl events */
function loadPropyl(event)
{
	console.log("Loading propyl....");

	// XXX: Handle empty file uploads

	for (const file of event.target.fileArea.files)
	{
		console.log(file.webkitRelativePath);
		const fileReader = new FileReader();
		fileReader.taras = event.target.files;
		fileReader.addEventListener("error", () => { console.error("Failed to load file from propyl!"); });
		fileReader.addEventListener("load", loadTara); 
		fileReader.readAsArrayBuffer(file);
	}

	// XXX: We should wait for all the files to finish loading, make an elegant fetching solution!
	// Perhaps even dynamic loading? E.g. load on demand.
}

function loadTara(event)
{
	const tara = new Tara(event.target.result);
	event.target.taras.push(tara);
}
