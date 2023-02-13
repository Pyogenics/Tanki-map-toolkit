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
		this.props = [];
		this.collision = new Object();
	}

	parseFromString(mapText)
	{
		const parser = new DOMParser();
		const xml = parser.parseFromString(mapText, "text/xml");

		const map = xml.documentElement; // The first tag should be <map></map> and nothing else afterwards
		const staticGeom = map.firstElementChild;
		const collisionGeom = map.lastElementChild; // XXX: Handle no collision geometry: this is usually gonna be a version 3.0 map

		for (const propXML of staticGeom.children)
		{
			const prop = new Object();
			const position = propXML.firstElementChild;
			prop.x = Number(position.getElementsByTagName("x")[0].textContent);
			prop.y = Number(position.getElementsByTagName("y")[0].textContent);
			prop.z = Number(position.getElementsByTagName("z")[0].textContent);
			prop.rotation = Number(propXML.getElementsByTagName("rotation")[0].firstElementChild.textContent); // The rotation always only contains z?

			prop.geometry = new Object();
			const attributes = propXML.attributes;
			prop.geometry.library = attributes["library-name"].value;
			prop.geometry.group = attributes["group-name"].value;
			prop.geometry.name = attributes["name"].value;
			
			prop.texture = propXML.getElementsByTagName("texture-name")[0].textContent;

			this.props.push(prop);
		}
	}
}

export { Map };
