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

class Map
{
	constructor()
	{
		this.map = new Object();
	}

	parseFromString(mapText)
	{
		const parser = new DOMParser();
		const xml = parser.parseFromString(mapText, "text/xml");

		const map = xml.documentElement; // The first tag should be <map></map> and nothing else afterwards
		const staticGeom = map.firstChild;
		const collisionGeom = map.lastChild; // XXX: Handle no collision geometry: this is usually gonna be a version 3.0 map

		console.log(staticGeom);
		console.log(collisionGeom);
	}
}

export { Map };
